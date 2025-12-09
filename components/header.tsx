import { ICONS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
// we need subheader,title,userImg props here since they are shared between
// various components like video detail header and header in the home page
const header = ({ subHeader, title, userImg }: SharedHeaderProps) => {
    return (
        <div>
            <header className='header'>
                <section className='header-container'>
                    <div className='details'>
                        {/* // if there is an user image given then render it */}
                        {userImg && (
                            <Image src={userImg || 'assets/icons/dummy.png'} alt={title} width={66} height={66} className='rounded-full' />
                        )}

                        <article>
                            <p>{subHeader}</p>
                            <h1>{title}</h1>
                        </article>
                    </div>

                    <aside>
                        <Link href='/upload'>
                            <Image src='assets/icons/upload.svg' alt='Upload' width={16} height={16} />
                            <span>Upload a video</span>
                        </Link>
                        <div className='record'>
                            <button className='primary-btn'>
                                <Image src={ICONS.record} alt='record' width={16} height={16} />
                                <span>Record a video</span>
                            </button>
                        </div>
                    </aside>
                </section>

                {/* Section for the filters*/}
                <section className='search-filter'>
                    <div className='search'>
                        <input type="text" 
                        placeholder='Search for videos, tags, folders ...'/>
                        <Image src='/assets/icons/search.svg' alt="Search" width={16} height={16} />
                    </div>

                    {'Dropdown list'}
                </section>
            </header>
        </div>
    )
}

export default header
