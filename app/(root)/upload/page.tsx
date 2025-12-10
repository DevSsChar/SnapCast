'use client'
import React, { ChangeEvent, useState, FormEvent, useEffect } from 'react'
import FormField from '@/components/FormField';
import FileInput from '@/components/FileInput';
import { useFileInput } from '@/lib/hooks/useFileInput';
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '@/constants';
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from '@/lib/actions/video';
import { useRouter } from 'next/navigation';

const uploadFileToBunny=(file:File, uploadUrl:string, accessKey:string)=>{
     return fetch(uploadUrl,{
        method: 'PUT',
        headers: {
            'AccessKey': accessKey,
            'Content-Type': file.type,
        },
        body: file,
     }).then((res)=>{
        if(!res.ok)
        {
            throw new Error('Failed to upload file to Bunny CDN');
        }
        // return res;
        });
}

const page = () => {
    const router=useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [videoDuration, setvideoDuration] = useState(0);

    const [formData, setformData] = useState(({
          title: '',
          description: '',
          visibility: 'public',
    }))
    // we will get video here, rn its empty, same for thumbnail
    const video=useFileInput(MAX_VIDEO_SIZE);
    const thumbnail=useFileInput(MAX_THUMBNAIL_SIZE);

    useEffect(() => {
        if(video.duration!=null || 0)
        {
            setvideoDuration(video.duration); 
        }
    }, [video.duration]);

    const [error, setError] = useState('');
// The problem is that the ChangeEvent type is not specific enough and needs to be typed as ChangeEvent<HTMLInputElement> to access the name and value properties.
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // name is the name of the input and so is value
        const { name, value } = e.target;
        setformData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try{
            // before submitting we need to validate if video and thumbnail are present
            if(!video.file || !thumbnail.file)
            {
                setError('Please upload the requested file');
                return;
            }
            if(!formData.title || !formData.description)
            {
                setError('Please fill in all required fields');
                return;
            }

            //upload to bunny
            // we need to get upload urls from our api routes, returns 3 things
            const {
                videoId,
                uploadUrl: videoUploadUrl,
                accessKey: videoAccessKey,
            }=await getVideoUploadUrl();

            if(!videoUploadUrl || !videoAccessKey) throw new Error('Failed to get video upload URL');
            await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);
            // upload thumbhnail to db, we create function uploadFileTobunny
            const {
                uploadUrl: thumbnailUploadUrl,
                accessKey: thumbnailAccessKey,
                cdnUrl: thumbnailCdnUrl,
            }=await getThumbnailUploadUrl(videoId);

            if(!thumbnailUploadUrl || !thumbnailAccessKey || !thumbnailCdnUrl) throw new Error('Failed to get thumbnail upload URL');
            // attach thumbhnail
            await uploadFileToBunny(thumbnail.file, thumbnailUploadUrl, thumbnailAccessKey);
            // create a new db entry for each video details (urls to data)
            await saveVideoDetails({
                // since it doesnt know the return type, put return type to bunny response in api fetch
                videoId,
                thumbnailUrl: thumbnailCdnUrl,
                ...formData,
                // create a state videoDuration
                duration: videoDuration,
            });
 
            router.push(`/videos/${videoId}`);
            // when video is uploaded we need to push it to video details page
        }catch(error)
        {
            console.log('Error uploading video:',error);
        }finally{
            setIsSubmitting(false);
        }
    }
    return (
        // wrapper md to keep form in middle of the screen
        <div className='wrapper-md upload-page'>
            <h1>Upload a Video</h1>
            {error && <div className='error-field'>{error}</div>}

            <form className='rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5' onSubmit={handleSubmit}>
                <FormField 
                   id='title'
                   label='Title'
                   value={formData.title}
                   onChange={handleInputChange}
                   placeholder='Enter video title'
                />
                <FormField 
                   id='description'
                   label='Description'
                   value={formData.description}
                   as='textarea'
                   onChange={handleInputChange}
                   placeholder='Enter video description'
                />
                {/* file input for video upload */}
                <FileInput 
                  id="video"
                  label="Video"
                  /* accept allows to accept different kinds of video files */
                  accept="video/*"
                  file={video.file}
                  previewUrl={video.previewUrl}
                  inputRef={video.inputRef}
                  onChange={video.handleFileChange}
                  onReset={video.resetFile}
                  type='video'
                />
                {/* file input for thumbnail */}
                <FileInput 
                  id="thumbnail"
                  label="Thumbnail"
                  /* accept allows to accept different kinds of video files */
                  accept="image/*"
                  file={thumbnail.file}
                  previewUrl={thumbnail.previewUrl}
                  inputRef={thumbnail.inputRef}
                  onChange={thumbnail.handleFileChange}
                  onReset={thumbnail.resetFile}
                  type='image'
                />
                <FormField 
                   id='visibility'
                   label='Visibility'
                   value={formData.visibility}
                   as='select'
                   options={[
                    {value:'public',label: 'Public'},
                    {value:'private',label: 'Private'},
                   ]}
                   onChange={handleInputChange}
                />
                {/* submit button */}
                <button type='submit' disabled={isSubmitting} className='submit-button'>
                     {isSubmitting ? 'Uploading...' : 'Upload Video'}
                </button>
            </form>
        </div>
    )
}

export default page
