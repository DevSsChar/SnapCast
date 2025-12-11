import VideoDetailHeader from '@/components/VideoDetailHeader';
import VideoPlayer from '@/components/VideoPlayer';
import { getVideoById } from '@/lib/actions/video';
import { redirect } from 'next/navigation';
import React from 'react'
// we are using params since we want website/:id to get the video id
const page = async ({ params }: Params) => {
  const { videoId } = await params;

  const { user, video } = await getVideoById(videoId);

  if (!video) redirect('/');
  // now we need an iframe component to render the video
  return (
    <div>
      <main className='wrapper page'>
        {/* // to style the above header */}
        <VideoDetailHeader {...video} userImg={user?.image} username={user?.name} ownerId={video.userId}/>
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
