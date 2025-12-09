import Header from "@/components/header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";
const page = async ({ params }: ParamsWithSearch) => {
    const { id } = await params;
    return (
        <div className='wrapper page'>
            <Header title='User Profile' subHeader={`Profile of user ${id}`} userImg="/assets/images/dummy.jpg" />
            <section className="video-grid">
                {dummyCards.map((card) => (
                    <VideoCard {...card} key={card.id} />
                ))}
            </section>
        </div>
    )
}

export default page
