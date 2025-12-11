import EmptyState from "@/components/EmptyState";
import Header from "@/components/header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
import { getAllVideosByUser } from "@/lib/actions/video";
import { redirect } from "next/navigation";
const page = async ({ params, searchParams }: ParamsWithSearch) => {
    const { id } = await params;
    const { query, filter, page } = await searchParams;

    const { user, videos } = await getAllVideosByUser(id, query, filter);

    if (!user) redirect('/404');
    return (
        <div className='wrapper page'>
            <Header title={user?.name || ''} subHeader={user?.email} userImg={user?.image || "/assets/images/dummy.jpg"} />
            {videos.length > 0 ? (
                <section className='video-grid'>
                    {videos.map(({ video, user }) => {
                        return <VideoCard key={video.id}
                            {...video}
                            thumbnail={video.thumbnailUrl}
                            userImg={user?.image || ''}
                            username={user?.name || 'Guest'} />
                    })}
                </section>
            ) : (
                // we get empty state component here
                <EmptyState icon="/assets/icons/video.svg" title="No Videos Available yet" description="Videos will show up once uploaded" />
            )}
        </div>
    )
}

export default page
