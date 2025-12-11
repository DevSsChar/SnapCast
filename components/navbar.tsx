"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const navbar = () => {
    const router=useRouter();
    const {data: session}=authClient.useSession();
    const User=session?.user;
  return (
    <header className="navbar">
        <nav>
            <Link href="/">
            <Image src="/assets/icons/logo.svg" alt="Logo" width={50} height={50} />
            </Link>

            {User && (
                <figure>
                    {/*if any use put href before profile/id here */}
                    <button onClick={()=>router.push(`/profile/${User?.id}`)}>
                        <Image src={User.image || '/assets/icons/user.svg'} alt="User" width={36} height={36} className="rounded-full aspect-square"/>
                    </button>
                    <button className="cursor-pointer">
                        <Image src="/assets/icons/logout.svg" alt="logout" width={24} height={24} className="rotate-180" />
                    </button>
                </figure>
            )}
        </nav>
    </header>
  )
}

export default navbar
