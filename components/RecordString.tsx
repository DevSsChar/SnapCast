'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { ICONS } from '@/constants'
import { useRouter } from 'next/navigation'
import { useScreenRecording } from '@/lib/hooks/useScreenRecording'
const RecordString = () => {
    // usestate for model open close
    const router = useRouter();
    const [isOpen, setisOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // we take the reset option from our hooks
    const {
        isRecording,
        recordedBlob,
        recordedVideoUrl,
        recordingDuration,
        startRecording,
        stopRecording,
        resetRecording
    } = useScreenRecording();
    const closeModel = () => {
        resetRecording();
        setisOpen(false)
    };
    const handleStart = async () => {
        await startRecording();
    }
    const recordAgain = async () => {
        resetRecording();
        await startRecording();

        if (recordedVideoUrl && videoRef.current) {
            videoRef.current.src = recordedVideoUrl;
        }
    }
    const goToUpload = () => {
        if(!recordedBlob) return;
        const url=URL.createObjectURL(recordedBlob);

        sessionStorage.setItem('recordedVideo', JSON.stringify({
            url,
            name: `screen-recording.webm`,
            tyoe: recordedBlob.type,
            size: recordedBlob.size,
            duration: recordingDuration || 0,
        })
    );
        router.push('/upload');
        closeModel();
    }
    return (
        <div className='record'>
            <button className='primary-btn' onClick={() => setisOpen(true)}>
                <Image src={ICONS.record} alt='record' width={16} height={16} />
                <span>Record a video</span>
            </button>

            {isOpen && (
                <section className='dialog'>
                    <div className='overlay-record' onClick={closeModel}/>
                        <div className='dialog-content'>
                            <figure>
                                <h3>Screen Recording</h3>
                                <button onClick={closeModel}>
                                    <Image src={ICONS.close} alt="close" width={20} height={20} />
                                </button>
                            </figure>

                            <section>
                                {isRecording ? (
                                    <article>
                                        <div />
                                        <span>Recording in progress</span>
                                    </article>
                                ) : recordedVideoUrl ? (
                                    <video src={recordedVideoUrl} ref={videoRef} controls />
                                ) : (
                                    <p>Click record to start capturing</p>
                                )}
                            </section>

                            <div className='record-box'>
                                {!isRecording && !recordedVideoUrl && (
                                    <button className='record-start' onClick={handleStart}>
                                        <Image src={ICONS.record} alt="record" width={16} height={16} />
                                        <span>Record</span>
                                    </button>
                                )}
                                {isRecording && (
                                    <button className='record-stop' onClick={stopRecording}>
                                        <Image src={ICONS.record} alt="stop" width={16} height={16} />
                                        <span>Stop</span>
                                    </button>
                                )}

                                {recordedVideoUrl && (
                                    <>
                                        <button onClick={recordAgain} className='record-again'>
                                            Record Again
                                        </button>

                                        <button onClick={goToUpload} className='record-upload'>
                                            <Image src={ICONS.upload} alt="upload" width={16} height={16} />
                                            Continue to Upload
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    {/* </div> */}
                </section>
            )}
        </div>
    )
}

export default RecordString
