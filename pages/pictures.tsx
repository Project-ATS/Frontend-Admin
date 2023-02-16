import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk'
// import { ListObjectsV2Output } from 'aws-sdk/clients/s3';
import { Head } from 'next/document';
import { NextPage } from 'next';
import { BsTrash } from 'react-icons/bs';

const S3_BUCKET = 'atf-app-media';
const REGION = 'eu-west-3';

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
})

const Pictures: NextPage = () => {
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<any>();
    const [images, setImages] = useState<Array<any>>()

    const listFiles = () => {
        const params = {
            Bucket: S3_BUCKET,
        };
        myBucket.listObjectsV2(params, function (err, data) {
            if (err) console.log(err, err.stack);  // error
            else { setImages(data.Contents)}
        });
    }

    useEffect(() => {
        listFiles()
    }, [])

    const handleFileInput = (e: any) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = (file: any) => {
        setLoading(true)

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name
        };

        myBucket.putObject(params)
            // .on('httpUploadProgress', (evt) => {
            //     setProgress(Math.round((evt.loaded / evt.total) * 100))
            // })
            .send((err) => {
                if (err) console.log(err);
                else location.reload()
            })
    }

    const deleteFile = (key: string) => {
        const params = {
            Bucket: S3_BUCKET,
            Key: key
        };
        myBucket.deleteObject(params, function (err, data) {
            if (err) console.log(err, err.stack);  // error
            else location.reload();                 // deleted
        });
    }

    return (
        <>

            <main className="flex flex-col p-5 font-jost select-none">
                <p className="font-bold text-4xl mb-10 font-sans">Pictures</p>

                <div className="flex flex-col items-start space-y-5 bg-[#FDE100]/10 w-full p-5 rounded mb-20">
                    {/* <input type="file" onChange={handleFileInput} /> */}
                    <label className="rounded-full bg-gray-100 cursor-pointer text-center p-2 px-4 border border-black/50 placeholder:text-black/60 w-52">
                        {!selectedFile? "Add file": "Change file"}
                        <input
                            type="file"
                            placeholder="Add file"
                            id="file"
                            name="File"
                            onChange={handleFileInput}
                            className="rounded-full hidden bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                        />
                    </label>
                    {selectedFile && <p className='ml-3'>{selectedFile.name}</p> }
                    <button disabled={!selectedFile} onClick={() => uploadFile(selectedFile)} className="flex bg-[#FDE100] shadow-2xl items-center justify-around border rounded-full px-4 p-2 cursor-pointer disabled:cursor-auto disabled:opacity-50">
                        <svg
                            className={`${loading ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                        />
                        <span
                            className={`${loading ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                        >
                            Upload Picture
                        </span>
                    </button>
                </div>

                <div className="flex flex-col items-start space-y-10 max-w-max p-5 rounded">

                    {images?.map((image) => (
                        <>
                            <div className='flex space-x-10 items-center'>
                                <BsTrash
                                    onClick={() => { deleteFile(image.Key) }}
                                    className="text-xl cursor-pointer"
                                />
                                <img src={`https://atf-app-media.s3.eu-west-3.amazonaws.com/${image.Key}`} className="w-44 h-44 object-cover" />
                                <div className='flex flex-col space-y-5'>

                                    <div className='flex flex-col'>
                                        <p className='font-bold'>Object url:</p>
                                        <a className='text-gray-500 text-sm hover:text-black' target="_blank" href={`https://atf-app-media.s3.eu-west-3.amazonaws.com/${image.Key}`}>{`https://atf-app-media.s3.eu-west-3.amazonaws.com/${image.Key}`}</a>
                                    </div>
                                    <div className='flex flex-col'>
                                        <p className='font-bold'>Size:</p>
                                        <p className='text-gray-500 text-sm'>{image.Size / 1000} KB</p>
                                    </div>

                                </div>

                            </div>

                            <hr className='w-full' />
                        </>

                    ))}

                </div>
            </main>
        </>

    )
}


export default Pictures;
