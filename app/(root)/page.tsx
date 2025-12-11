import React, { use } from 'react'
import Header from '@/components/header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'
import { getAllVideos } from '@/lib/actions/video'
import EmptyState from '@/components/EmptyState'
const Page = async ({searchParams}:SearchParams) => {
  const {query,filter,page}=await searchParams;
  const { videos,pagination}=await getAllVideos(
    query,
    filter,
    Number(page) || 1,
  );
  return (
    <main className='wrapper page'>
      <Header title='All Videos' subHeader='Public Library'/>
      {videos.length>0 ? (
          <section className='video-grid'>
              {videos.map(({video,user})=>{
                return <VideoCard key={video.id} 
                {...video} 
                thumbnail={video.thumbnailUrl}
                userImg={user?.image || ''}
                username={user?.name || 'Guest'}/>
              })}
          </section>
      ):(
        // we get empty state component here
        <EmptyState icon="/assets/icons/video.svg" title="No Videos" description="There are no videos available at the moment."/>
      )}
    </main>
  )
}

export default Page