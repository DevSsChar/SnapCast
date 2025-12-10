'use client'
import React, { ChangeEvent, useState, FormEvent } from 'react'
import FormField from '@/components/FormField';
import FileInput from '@/components/FileInput';
import { useFileInput } from '@/lib/hooks/useFileInput';
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '@/constants';
const page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setformData] = useState(({
          title: '',
          description: '',
          visibility: 'public',
    }))
    // we will get video here, rn its empty, same for thumbnail
    const video=useFileInput(MAX_VIDEO_SIZE);
    const thumbnail=useFileInput(MAX_THUMBNAIL_SIZE);

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
            // upload thumbhnail to db
            // attach thumbhnail
            // create a new db entry for each video details (urls to data)
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
