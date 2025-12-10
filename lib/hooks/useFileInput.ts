import React, { useState,useRef, ChangeEvent } from "react";

// this hook is created to handle the upload logic for file inputs
export const useFileInput = (maxSize:number) => {
    // here we will store the all states required for our logic
    // since null isnt correct type for file we will have to type it
    const [file, setfile] = useState<File | null>(null);
    const [previewUrl, setpreviewUrl] = useState('');
    const [duration, setduration] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    // if we wouldnt had defined the hooks like this
    // we would have to write the same logic again and again for each file input
    // this way we can just use this hook wherever we want
    // keeps track of what the file is doing
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.[0])
        {
            const selectedFile=e.target.files[0];

            if(selectedFile.size>maxSize) return;
            // we are telling the browser to not keep the reference to the file
            // since we now have the actual file
            if(previewUrl) URL.revokeObjectURL(previewUrl);
            // changed the state to null or file so that set knows we passing a file
            setfile(selectedFile);
            // we get the objecturl from the file and set preview to it
            const objectURL=URL.createObjectURL(selectedFile);
            setpreviewUrl(objectURL);

            if(selectedFile.type.startsWith('video/'))
            {
                // we need to get the duration of the video
                const video=document.createElement('video');
                // create a video element and load the metadata
                video.preload='metadata';
                // after loading metadata we can get the duration
                video.onloadedmetadata=()=>{
                    if(isFinite(video.duration) && video.duration>0)
                    {
                        setduration(Math.round(video.duration));
                    }else{
                        setduration(0);
                    }
                }
                // set the src to object url and load the video
                URL.revokeObjectURL(video.src);
                video.src=objectURL;
            }
        }
    }

    const resetFile=()=>{
        if(previewUrl) URL.revokeObjectURL(previewUrl);

        setfile(null);
        setpreviewUrl('');
        setduration(0);

        // also reset the input value so that the same file can be uploaded again if needed
        if(inputRef.current)
        {
            // since we are using ref we need to typecast it
            // since an error exists that value cant exists
            // so we make inputref an HTML Element
            inputRef.current.value='';  
        }
    }
    
    return {file,previewUrl,duration,inputRef,handleFileChange,resetFile};
}