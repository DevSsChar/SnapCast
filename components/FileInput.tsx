import Image from "next/image"
const FileInput = ({ id, label, accept, file, previewUrl, inputRef, onChange, onReset, type }: FileInputProps) => {
    return (
        <section className="file-input">
            <label htmlFor={id}>{label}</label>

            <input
                type="file"
                id={id}
                accept={accept}
                ref={inputRef}
                hidden
                onChange={onChange}
            />

            {!previewUrl ? (
                // when we click on the figure we want to trigger the file input click
                <figure onClick={()=>inputRef.current?.click()}>
                    <Image src='assets/icons/upload.svg' alt="Upload Icon" width={24} height={24}></Image>
                    <p>Click to upload your {id}</p>
                </figure>
            ):(
                // see the thing uploaded by user
                <div>
                    {type==='video' ? (
                        <video src={previewUrl} controls/>
                    ):(
                        <Image src={previewUrl} alt={label} fill />
                    )}
                    <button type="button" onClick={onReset}>
                        <Image src='assets/icons/reset.svg' alt="Reset Icon" width={16} height={16}></Image>
                    </button>
                    <p>{file?.name}</p>
                </div>
            )}
        </section>
    )
}

export default FileInput
