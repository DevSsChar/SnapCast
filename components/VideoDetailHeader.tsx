'use client'
import { daysAgo } from '@/lib/utils'
import { deleteVideo, updateVideoVisibility } from '@/lib/actions/video'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const VideoDetailHeader = ({title,createdAt,userImg,username,videoId,ownerId,visibility,thumbnailUrl, id, currentUserId} : VideoDetailHeaderProps) => {
    const router=useRouter();
    const [Copied, setCopied] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [currentVisibility, setCurrentVisibility] = useState(visibility)
    const isOwner = currentUserId === ownerId

    const handleCopyLink = () => {
        const link = `${window.location.origin}/videos/${id}`;
        navigator.clipboard.writeText(link);
        // you can add toast notification here for better ux
        setCopied(true);
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this video?')) return;
        
        setIsDeleting(true);
        try {
            await deleteVideo(id, videoId);
            router.push('/');
        } catch (error) {
            alert('Failed to delete video');
            setIsDeleting(false);
        }
    };

    const handleVisibilityToggle = async () => {
        const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
        
        setIsUpdating(true);
        try {
            const result = await updateVideoVisibility(id, newVisibility);
            if (result?.visibility) {
                setCurrentVisibility(result.visibility);
            }
            router.refresh();
        } catch (error) {
            alert('Failed to update visibility');
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(()=>{
        const changeChecked=setTimeout(()=>{
            if(Copied)setCopied(false);
        },2000)

        return () => clearTimeout(changeChecked);
    },[Copied])
  return (
    <header className='detail-header'>
        <aside className='user-info'>
            <h1>{title}</h1>
            <figure>
                <button onClick={()=>router.push(`/profile/${ownerId}`)}>
                    <Image src={userImg || '/assets/icons/user.svg'} alt='user' width={24} height={24} className='rounded-full'/>
                    <h2>{username ?? 'Guest'}</h2>
                </button>
                <figcaption>
                <span className='mt-1'>.</span>
                <p>{daysAgo(createdAt)}</p>
            </figcaption>
            </figure>
        </aside>
        <aside className='cta'>
            {isOwner && (
                <>
                    <button 
                        onClick={handleVisibilityToggle} 
                        disabled={isUpdating}
                        className='visibility-btn'
                        title={`Make ${currentVisibility === 'public' ? 'Private' : 'Public'}`}
                    >
                        <Image src="/assets/icons/eye.svg" alt="visibility" width={24} height={24} />
                        {isUpdating ? 'Updating...' : currentVisibility === 'public' ? 'Public' : 'Private'}
                    </button>
                    <button 
                        onClick={handleDelete} 
                        disabled={isDeleting}
                        className='delete-btn'
                        title='Delete Video'
                    >
                        <Image src="/assets/icons/close.svg" alt="delete" width={24} height={24} />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </>
            )}
            <button onClick={handleCopyLink}>
                <Image src={Copied ? "/assets/icons/checkmark.svg" : "/assets/icons/link.svg"} alt="copy link" width={24} height={24} />
            </button>
        </aside>
    </header>
  )
}

export default VideoDetailHeader
