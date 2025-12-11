// here we have all video related actions, since its only for server -> use server
'use server';

import { headers } from "next/headers";
import { auth } from "../auth";
import { apiFetch, doesTitleMatch, getEnv, getOrderByClause, withErrorHandling } from "../utils";
import { BUNNY } from "@/constants";
import { db } from "@/drizzle/db";
import { user, videos } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import aj from "../arcjet";
import { fixedWindow, request } from "@arcjet/next";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

// get necessary variables and constants
const VIDEO_STREAM_BASE_URL = BUNNY.STREAM_BASE_URL;
const THUMBNAIL_STORAGE_BASE_URL = BUNNY.STORAGE_BASE_URL;
const THUMBNAIL_CDN_URL = BUNNY.CDN_URL;
const BUNNY_LIBRARY_ID = getEnv("BUNNY_LIBRARY_ID");
const ACCESS_KEYS = {
    streamAccessKey: getEnv("BUNNY_STREAM_ACCESS_KEY"),
    storageAccessKey: getEnv("BUNNY_STORAGE_ACCESS_KEY"),
}
//helper functions
// to know which user is uploading video
const getSessionUserId = async (): Promise<string | null> => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) throw new Error("Unauthenticated");
    return session?.user.id || null;
}
const revalidatePaths=(paths:string[])=>{
    paths.forEach((path) => revalidatePath(path));
}
const buildVideoWithUserQuery=()=>{
    return db.select(
        {
            video: videos,
            user: {id:user.id, name:user.name, image:user.image}
        }
    ).from(videos)
    .leftJoin(user,eq(videos.userId,user.id));
}

// fingerprint is something which allows us to connect who is the actor
// we use arcjet for validations and rate limiting
const validateWithArcjet = async (fingerprint: string) => {
    // rules would have what kind of rate limiting we want
    const ratelimit=aj.withRule(
        fixedWindow({
            mode: 'LIVE',
            window: '1m', // 1 minute
            max: 2, // max 2 requests per minute
            characteristics: ['fingerprint'],
        })
    );
    // make a typical request to arcjet to validate
    const req=await request();
    // decision to be used to allow or block request, we provide fingerprint and req
    const decision=await ratelimit.protect(req,{fingerprint});

    if(decision.isDenied())
    {
        throw new Error('Rate limit exceeded. Please try again later.');
    }
}
// server functions
// we wrap all in error handling one by one
export const getVideoUploadUrl = withErrorHandling(async () => {
    await getSessionUserId();

    const videoResponse = await apiFetch<BunnyVideoResponse>(
        // we need to send direct string here since its server side
        `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos`,
        {
            method: "POST",
            bunnyType: "stream",
            body: { title: 'Temporary Title', collectionId: '' }
        }
    );

    const uploadUrl=`${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoResponse.guid}`;

    return {
        videoId: videoResponse.guid,
        uploadUrl,
        accessKey: ACCESS_KEYS.streamAccessKey,
    }
})

export const getThumbnailUploadUrl = withErrorHandling(async (videoId: string) => {
    await getSessionUserId();
    const filename=`${Date.now()}-${videoId}-thumbnail`;
    const uploadUrl = `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${filename}`;
    const cdnUrl = `${THUMBNAIL_CDN_URL}/thumbnails/${filename}`;
    return {
        uploadUrl,
        cdnUrl,
        accessKey: ACCESS_KEYS.storageAccessKey,
    };
});

// we will upload the video to bunny, but we also have to attack metadata and add to our db
// thus we have new function save video details
export const saveVideoDetails = withErrorHandling(async (
    videoDetails: VideoDetails
) => {
    const userId = await getSessionUserId();
    if (!userId) throw new Error("User ID not found");
    // user id is given as fingerprint to identify actor
    await validateWithArcjet(userId);
    // now we have all details to save video to our db
    // we will call our api route to save video details
    await apiFetch(
        `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoDetails.videoId}`,
        {
            method: "POST",
            bunnyType: "stream",
            body: {
                title: videoDetails.title,
                description: videoDetails.description,
            }
        }
    )
    // this videos are new schema in drizzle
    await db.insert(videos).values({
        ...videoDetails,
        visibility: videoDetails.visibility as "public" | "private",
        // we tell nextjs to reload the page to fetch specific details
        // usually we can validate one path at a time, thus to revalidate more
        // we create helper function
        videoUrl: `${BUNNY.EMBED_URL}/${BUNNY_LIBRARY_ID}/${videoDetails.videoId}`,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    revalidatePaths([`/`]);

    return {videoId: videoDetails.videoId}; 
});

// to fetch all the videos from the db, and this are the params which we can use to paginate the videos using query
export const getAllVideos = withErrorHandling(async (
    searchQuery: string='',
    sortFilter?: string,
    pageNumber: number=1,
    pageSize: number=8
) => {
    const session=await auth.api.getSession({
        headers: await headers()
    })
    // const currentUserId=session?.user.id;
    // // include a fallback where if no session exists we only show public videos
    // const canSeeTheVideos=currentUserId
    //     ? or(
    //         eq(videos.visibility,'public'),
    //         eq(videos.userId,currentUserId)
    //     )
    //     : eq(videos.visibility,'public');
    const canSeeTheVideos = eq(videos.visibility,'public');

    const whereCondition=searchQuery.trim()
    ? and(
        canSeeTheVideos,
        doesTitleMatch(videos,searchQuery)
    ): canSeeTheVideos;

    const [{totalcount}]=await db.select({totalcount: sql<number>`count(*)`})
    .from(videos)
    .where(whereCondition); 

    const totalVideos=Number(totalcount || 0);
    const totalPages=Math.ceil(totalVideos/pageSize);

    const videoRecord=await buildVideoWithUserQuery().where(whereCondition).
    orderBy(
        sortFilter? getOrderByClause(sortFilter): sql`${videos.createdAt} DESC`
    ).limit(pageSize)
    // 
    .offset((pageNumber-1)*pageSize);

    return {
        videos: videoRecord,
        pagination: {
            currentPage: pageNumber,
            totalPages,
            totalVideos,
            pageSize
        }
    }
});

// to fetch a certain video by its id
export const getVideoById = withErrorHandling(async (videoId: string) => {
    const [videoRecord]=await buildVideoWithUserQuery().
    where(eq(videos.id,videoId));
    return videoRecord;
})

export const getAllVideosByUser = withErrorHandling(
  async (
    userIdParameter: string,
    searchQuery: string = "",
    sortFilter?: string
  ) => {
    const currentUserId = (
      await auth.api.getSession({ headers: await headers() })
    )?.user.id;
    const isOwner = userIdParameter === currentUserId;

    const [userInfo] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, userIdParameter));
    if (!userInfo) throw new Error("User not found");

    const conditions = [
      eq(videos.userId, userIdParameter),
      !isOwner && eq(videos.visibility, "public"),
      searchQuery.trim() && ilike(videos.title, `%${searchQuery}%`),
    ].filter(Boolean) as any[];

    const userVideos = await buildVideoWithUserQuery()
      .where(and(...conditions))
      .orderBy(
        sortFilter ? getOrderByClause(sortFilter) : desc(videos.createdAt)
      );

    return { user: userInfo, videos: userVideos, count: userVideos.length };
  }
);

// delete video
export const deleteVideo = withErrorHandling(async (videoId: string, bunnyVideoId: string) => {
    const userId = await getSessionUserId();
    if (!userId) throw new Error("Unauthenticated");

    // verify ownership
    const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
    if (!video) throw new Error("Video not found");
    if (video.userId !== userId) throw new Error("Unauthorized");

    // delete from bunny
    await apiFetch(
        `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}`,
        {
            method: "DELETE",
            bunnyType: "stream",
        }
    );

    // delete from database
    await db.delete(videos).where(eq(videos.id, videoId));

    revalidatePaths([`/`, `/profile/${userId}`]);
    
    return { success: true };
});

// update video visibility
export const updateVideoVisibility = withErrorHandling(async (
    videoId: string,
    visibility: "public" | "private"
) => {
    const userId = await getSessionUserId();
    if (!userId) throw new Error("Unauthenticated");

    // verify ownership
    const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
    if (!video) throw new Error("Video not found");
    if (video.userId !== userId) throw new Error("Unauthorized");

    // update in database
    await db.update(videos)
        .set({ visibility, updatedAt: new Date() })
        .where(eq(videos.id, videoId));

    revalidatePaths([`/`, `/videos/${videoId}`, `/profile/${userId}`]);
    
    return { success: true, visibility };
});

// increment video views
export const incrementVideoViews = withErrorHandling(async (videoId: string) => {
    const [video] = await db.select().from(videos).where(eq(videos.id, videoId));
    if (!video) throw new Error("Video not found");

    // increment views
    await db.update(videos)
        .set({ views: sql`${videos.views} + 1` })
        .where(eq(videos.id, videoId));

    return { success: true, views: video.views + 1 };
});