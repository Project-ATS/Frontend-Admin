import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import products from '../data/products.json'
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai'
import { nftMint } from '../services/contractService'
import { isWeb3 } from '../services/walletService'
import { useAppSelector } from '../state/hooks'
import PopUpAlert from '../components/PopUpAlert'
import AWS from 'aws-sdk'

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

const NFTs: NextPage = (data) => {
    const [loading, setLoading] = useState(false)
    const [successAlert, setSuccessAlert] = useState(false)
    const [visualAlert, setVisualAlert] = useState(false)
    const [quantity, setQuantity] = useState<{ [index: string]: number }>({
        '1': 1,
        '2': 1,
        '3': 1,
        '4': 1,
        '5': 1,
        '6': 1,
        '7': 1,
        '8': 1,
    })
    const [selectedFile, setSelectedFile] = useState<any>();

    const { user } = useAppSelector((state) => state.account.walletConfig)
    const router = useRouter()

    const increase = (id: string) => {
        // if (quantity < 20) {
        setQuantity((prevState) => ({ ...prevState, [id]: prevState[id] + 1 }))
        // }
    }

    const decrease = (id: string) => {
        if (quantity[id] > 1) {
            setQuantity((prevState) => ({
                ...prevState,
                [id]: prevState[id] - 1,
            }))
        }
    }

    const mint = async (
        jwt: any,
        id: string,
        token_amount: number,
        token_id: string,
        token_media_link: string,
        token_symbol: string,
        token_price: string,
        name: any,
        description: any,
        buyLevel: any
    ) => {
        setLoading(true)
        const messageBoolean = await nftMint({
            token_id,
            token_amount,
            media_link: token_media_link,
            token_price,
            name,
            description,
            jwt,
            token_symbol,
            buyLevel
        })
        setSuccessAlert(messageBoolean)
        setVisualAlert(true)
        setLoading(false)
    }
    console.log(user)

    useEffect(() => {
        const web3Check = async () => {
            if (!(await isWeb3(user)))
                router.push("/profile")
        }
        web3Check()
    })

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
            .send((err, data) => {
                if (err)
                    console.log(err);
                else {
                    (document.getElementById(`nft1_media`) as HTMLInputElement).value = `https://atf-app-media.s3.eu-west-3.amazonaws.com/${file.name}`
                    setSelectedFile()
                    setLoading(false)
                }
            })
    }

    return (
        <>
            <Head>
                <title>ATF Shop</title>
            </Head>

            <main className="flex flex-col p-5 font-jost select-none">
                <p className="font-bold text-4xl mb-10 font-sans">NFTs</p>
                <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                    <img src="/images/nft.png" className="w-44" />
                    <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                        <AiFillMinusCircle
                            onClick={() => decrease('1')}
                            className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                        />
                        <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                            {quantity['1']}
                        </p>
                        <AiFillPlusCircle
                            onClick={() => increase('1')}
                            className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                        />
                    </div>
                    <div className="flex flex-col items-start space-y-5 bg-[#FDE100]/10 w-full p-5 rounded mb-20">
                        {/* <input type="file" onChange={handleFileInput} /> */}
                        <label className="rounded-full bg-gray-100 cursor-pointer text-center p-2 px-4 border border-black/50 placeholder:text-black/60 w-52">
                            {!selectedFile ? "Add file" : "Change file"}
                            <input
                                type="file"
                                placeholder="Add file"
                                id="file"
                                name="File"
                                onChange={handleFileInput}
                                className="rounded-full hidden bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </label>
                        {selectedFile && <p className='ml-3'>{selectedFile.name}</p>}
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
                    <input
                        id={`nft1_media`}
                        placeholder="Media Link"
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            ; (
                                document.getElementById(
                                    `nft1_media`
                                ) as HTMLInputElement
                            ).value = event.target.value
                        }}
                        className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                    />

                    <div>
                        <select
                            id="token_symbol"
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-20"
                        >
                            <option>ATF</option>
                            <option>AP</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Token Amount"
                            id="token_price"
                            className="ml-2 rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Buy level"
                        id="buy_level"
                        className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                    />

                    <input
                        type="text"
                        placeholder="NFT Name"
                        id="token_name"
                        className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                    />
                    <input
                        type="text"
                        placeholder="NFT decription"
                        id="token_description"
                        className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                    />


                    <div
                        onClick={() =>
                            mint(
                                user.token,
                                '1',
                                quantity['1'],
                                new Date(Date.now())
                                    .toISOString()
                                    .replace(/[^a-zA-Z0-9 ]/g, '')
                                    .replace(/T/g, '')
                                    .replace(/Z/g, '')
                                    .replace(/z/g, ''),
                                (
                                    document.getElementById(
                                        `nft1_media`
                                    ) as HTMLInputElement
                                )?.value,
                                (
                                    document.getElementById(
                                        'token_symbol'
                                    ) as HTMLInputElement
                                )?.value!,
                                (
                                    document.getElementById(
                                        'token_price'
                                    ) as HTMLInputElement
                                )?.value!,
                                (
                                    document.getElementById(
                                        'token_name'
                                    ) as HTMLInputElement
                                )?.value!,

                                (
                                    document.getElementById(
                                        'token_description'
                                    ) as HTMLInputElement
                                )?.value!,
                                (
                                    document.getElementById(
                                        'buy_level'
                                    ) as HTMLInputElement
                                )?.value!
                            )
                        }
                        className="flex bg-[#FDE100] shadow-2xl items-center justify-around border  rounded-full px-4 p-2 cursor-pointer"
                    >
                        <svg
                            className={`${loading ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                        />
                        <span
                            className={`${loading ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                        >
                            Mint
                        </span>
                    </div>
                    {
                        visualAlert && <PopUpAlert
                            isSuccess={successAlert}
                            successMessage="NFT mint successful"
                            deniedMessage="NFT min denied"
                            setVisualAlert={setVisualAlert}
                        />
                    }

                </div>
                {/* <div className="flex space-x-5 flex-wrap mb-10">
                    <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                        <img src="/images/nft.png" className="w-44" />
                        <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                            <AiFillMinusCircle
                                onClick={() => decrease('1')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                            <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                                {quantity['1']}
                            </p>
                            <AiFillPlusCircle
                                onClick={() => increase('1')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                        </div>
                        <div className="flex space-x-5">
                            <input
                                type="number"
                                placeholder="price AP"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                            <input
                                type="number"
                                placeholder="price ATF"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </div>
                        <input
                            id={`nft1_media`}
                            placeholder="Media Link"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                ;(
                                    document.getElementById(
                                        `nft1_media`
                                    ) as HTMLInputElement
                                ).value = event.target.value
                            }}
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                        />
                        <div
                            onClick={() => mint('1')}
                            className="flex bg-[#FDE100] shadow-2xl items-center justify-around border  rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${
                                    loading === '1' ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${
                                    loading === '1' ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                            >
                                Mint
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                        <img src="/images/nft.png" className="w-44" />
                        <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                            <AiFillMinusCircle
                                onClick={() => decrease('2')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                            <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                                {quantity['2']}
                            </p>
                            <AiFillPlusCircle
                                onClick={() => increase('2')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                        </div>
                        <div className="flex space-x-5">
                            <input
                                type="number"
                                placeholder="price AP"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                            <input
                                type="number"
                                placeholder="price ATF"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </div>
                        <input
                            id={`nft2_media`}
                            placeholder="Media Link"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                ;(
                                    document.getElementById(
                                        `nft2_media`
                                    ) as HTMLInputElement
                                ).value = event.target.value
                            }}
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                        />
                        <div
                            onClick={() => mint('2')}
                            className="flex bg-[#FDE100] shadow-2xl items-center justify-around border  rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${
                                    loading === '2' ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${
                                    loading === '2' ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                            >
                                Mint
                            </span>
                        </div>
                    </div>
                </div>

                <p className="font-bold text-2xl my-2">Custom Avatars</p>

                <div className="flex space-x-5 flex-wrap mb-10">
                    <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                        <img src="/images/nft.png" className="w-44" />
                        <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                            <AiFillMinusCircle
                                onClick={() => decrease('3')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                            <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                                {quantity['3']}
                            </p>
                            <AiFillPlusCircle
                                onClick={() => increase('3')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                        </div>
                        <div className="flex space-x-5">
                            <input
                                type="number"
                                placeholder="price AP"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                            <input
                                type="number"
                                placeholder="price ATF"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </div>
                        <input
                            id={`nft3_media`}
                            placeholder="Media Link"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                ;(
                                    document.getElementById(
                                        `nft3_media`
                                    ) as HTMLInputElement
                                ).value = event.target.value
                            }}
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                        />
                        <div
                            onClick={() => mint('3')}
                            className="flex bg-[#FDE100] shadow-2xl items-center justify-around border  rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${
                                    loading === '3' ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${
                                    loading === '3' ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                            >
                                Mint
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                        <img src="/images/nft.png" className="w-44" />
                        <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                            <AiFillMinusCircle
                                onClick={() => decrease('4')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                            <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                                {quantity['4']}
                            </p>
                            <AiFillPlusCircle
                                onClick={() => increase('4')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                        </div>
                        <div className="flex space-x-5">
                            <input
                                type="number"
                                placeholder="price AP"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                            <input
                                type="number"
                                placeholder="price ATF"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </div>
                        <input
                            id={`nft4_media`}
                            placeholder="Media Link"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                ;(
                                    document.getElementById(
                                        `nft4_media`
                                    ) as HTMLInputElement
                                ).value = event.target.value
                            }}
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                        />
                        <div
                            onClick={() => mint('4')}
                            className="flex bg-[#FDE100] shadow-2xl items-center justify-around border  rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${
                                    loading === '4' ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${
                                    loading === '4' ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                            >
                                Mint
                            </span>
                        </div>
                    </div>
                </div>

                <p className="font-bold text-2xl my-2">Metaverse Tickets</p>

                <div className="flex space-x-5 flex-wrap mb-10">
                    <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                        <img src="/images/nft.png" className="w-44" />
                        <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                            <AiFillMinusCircle
                                onClick={() => decrease('5')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                            <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                                {quantity['5']}
                            </p>
                            <AiFillPlusCircle
                                onClick={() => increase('5')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                        </div>
                        <div className="flex space-x-5">
                            <input
                                type="number"
                                placeholder="price AP"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                            <input
                                type="number"
                                placeholder="price ATF"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </div>
                        <input
                            id={`nft5_media`}
                            placeholder="Media Link"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                ;(
                                    document.getElementById(
                                        `nft5_media`
                                    ) as HTMLInputElement
                                ).value = event.target.value
                            }}
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                        />
                        <div
                            onClick={() => mint('5')}
                            className="flex bg-[#FDE100] shadow-2xl items-center justify-around border  rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${
                                    loading === '5' ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${
                                    loading === '5' ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                            >
                                Mint
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                        <img src="/images/nft.png" className="w-44" />
                        <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                            <AiFillMinusCircle
                                onClick={() => decrease('6')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                            <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                                {quantity['6']}
                            </p>
                            <AiFillPlusCircle
                                onClick={() => increase('6')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                        </div>
                        <div className="flex space-x-5">
                            <input
                                type="number"
                                placeholder="price AP"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                            <input
                                type="number"
                                placeholder="price ATF"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </div>
                        <input
                            id={`nft6_media`}
                            placeholder="Media Link"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                ;(
                                    document.getElementById(
                                        `nft6_media`
                                    ) as HTMLInputElement
                                ).value = event.target.value
                            }}
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                        />
                        <div
                            onClick={() => mint('6')}
                            className="flex bg-[#FDE100] shadow-2xl items-center justify-around border  rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${
                                    loading === '6' ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${
                                    loading === '6' ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                            >
                                Mint
                            </span>
                        </div>
                    </div>
                </div>

                <p className="font-bold text-2xl my-2">Other</p>

                <div className="flex space-x-5 flex-wrap mb-10">
                    <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                        <img src="/images/nft.png" className="w-44" />
                        <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                            <AiFillMinusCircle
                                onClick={() => decrease('7')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                            <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                                {quantity['7']}
                            </p>
                            <AiFillPlusCircle
                                onClick={() => increase('7')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                        </div>
                        <div className="flex space-x-5">
                            <input
                                type="number"
                                placeholder="price AP"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                            <input
                                type="number"
                                placeholder="price ATF"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </div>
                        <input
                            id={`nft7_media`}
                            placeholder="Media Link"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                ;(
                                    document.getElementById(
                                        `nft7_media`
                                    ) as HTMLInputElement
                                ).value = event.target.value
                            }}
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                        />
                        <div
                            onClick={() => mint('7')}
                            className="flex bg-[#FDE100] shadow-2xl items-center justify-around border rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${
                                    loading === '7' ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${
                                    loading === '7' ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                            >
                                Mint
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-5 bg-[#FDE100]/10 max-w-max p-5 rounded">
                        <img src="/images/nft.png" className="w-44" />
                        <div className="flex items-center space-x-0 sm:space-x-1 justify-center">
                            <AiFillMinusCircle
                                onClick={() => decrease('8')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                            <p className="text-4xl sm:text-5xl font-medium w-18 text-center pt-2">
                                {quantity['8']}
                            </p>
                            <AiFillPlusCircle
                                onClick={() => increase('8')}
                                className="text-3xl sm:text-4xl text-gray-700 hover:text-gray-600 transition-all ease-in-out duration-300 cursor-pointer"
                            />
                        </div>
                        <div className="flex space-x-5">
                            <input
                                type="number"
                                placeholder="price AP"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                            <input
                                type="number"
                                placeholder="price ATF"
                                className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </div>
                        <input
                            id={`nft8_media`}
                            placeholder="Media Link"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                ;(
                                    document.getElementById(
                                        `nft8_media`
                                    ) as HTMLInputElement
                                ).value = event.target.value
                            }}
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-full"
                        />
                        <div
                            onClick={() => mint('8')}
                            className="flex bg-[#FDE100] shadow-2xl items-center justify-around border  rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${
                                    loading === '8' ? 'block' : 'hidden'
                                } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${
                                    loading === '8' ? 'hidden' : 'block'
                                } text-black w-full px-10`}
                            >
                                Mint
                            </span>
                        </div>
                    </div>
                </div>
 */}{' '}
            </main>
        </>
    )
}

export default NFTs
