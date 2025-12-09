// we moved here since the parallel pages with same name in same dir cant be there
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
const page = () => {
  return (
    <main className='sign-in'>
       <aside className='testimonial'>
         <Link href={'/'}>
         <Image src='/assets/icons/logo.svg' alt='Logo' width={32} height={32} />
         <h1>Snapcast</h1>
         </Link>

         <div className='description'>
            <section>
                <figure>
                    {Array.from({length:5}).map((_,index)=>(
                        <Image key={index} src={`/assets/icons/star.svg`} alt={`star`} width={20} height={20} />
                    ))}
                </figure>
                <p>SnapCast makes screen recording easy. From quick walkthroughs to full presentations, it's fast, smooth, and shareable in seconds</p>
                <article>
                    <Image src='/assets/images/jason.png' alt='jason' width={64} height={64} className='rounded-full' />
                </article>
                <div>
                    <p>Jason Rivera</p>
                    <h2>Product Manager, Novabyte</h2>
                </div>
            </section>
         </div>
         <p>© Snapcast {new Date().getFullYear()}</p>
       </aside>
       <aside className='google-sign-in'>
            <section>
                <Link href={'/'}>
                <Image src='/assets/icons/logo.svg' alt='Logo' width={40} height={40} />
                <h1>Snapcast</h1></Link>
                <p>Create & Share your very first <span>Snapcast Video</span> in no time</p>
                <button>
                    <Image src='/assets/icons/google.svg' alt='Google Sign-In' width={22} height={22} />
                    <span>Sign in with Google</span>
                </button>
            </section>
       </aside>
       <div className='overlay'/>
    </main>
  )
}

export default page
