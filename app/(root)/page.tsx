import React from 'react'
import Header from '@/components/header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'
const Page = () => {
  return (
    <main className='wrapper page'>
      <Header title='All Videos' subHeader='Public Library'/>
      <section className="video-grid">
                {dummyCards.map((card) => (
                    <VideoCard {...card} key={card.id} />
                ))}
      </section>
      {/* <VideoCard 
      id='1'
      title='Snapchat Message'
      thumbnail='/assets/samples/thumbnail (1).png'
      createdAt={new Date("2025-06-30 06:35:54.437")}
      userImg='/assets/images/jason.png'
      username='Jason'
      views={10}
      visibility='public'
      duration={156}
      /> */}
    </main>
  )
}

export default Page