import VideoDetailHeader from '@/components/VideoDetailHeader';
import VideoPlayer from '@/components/VideoPlayer';
import VideoViewTracker from '@/components/VideoViewTracker';
import { getVideoById } from '@/lib/actions/video';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'
// we are using params since we want website/:id to get the video id
const page = async ({ params }: Params) => {
  const { videoId } = await params;

  const { user, video } = await getVideoById(videoId);
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user?.id;

  if (!video) redirect('/');
  // now we need an iframe component to render the video
  return (
    <div>
      <VideoViewTracker videoId={video.id} />
      <main className='wrapper page'>
        {/* // to style the above header */}
        <VideoDetailHeader {...video} userImg={user?.image} username={user?.name} ownerId={video.userId} currentUserId={currentUserId}/>
        <section className='video-details'>
          <div className='content'>
          {/* video id since we want the video id from bunny instead of the database id */}
            <VideoPlayer videoId={video.videoId} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default page
