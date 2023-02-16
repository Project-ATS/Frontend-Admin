import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { BsStar, BsTrash } from 'react-icons/bs';
import { isWeb3 } from '../services/walletService'
import { createEvent, getEvents } from '../services/eventService';
// import products from "../data/products.json"
import { useAppSelector } from '../state/hooks';
import PopUpAlert from '../components/PopUpAlert';

const Events: NextPage = (data) => {
    const [loading, setLoading] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [products, setProducts] = useState<any>();
    const [itemTitle, setItemTitle] = useState('');
    const [itemPriceAP, setItemPriceAP] = useState('');
    const [itemPriceATF, setItemPriceATF] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemMedia, setItemMedia] = useState('');
    const [successAlert, setSuccessAlert] = useState(false)
    const [visualAlert, setVisualAlert] = useState(false)

    const { user } = useAppSelector((state) => state.account.walletConfig);
    const router = useRouter()

    const addNewItem = async (id: string) => {
        setLoading(id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading('');
        setSuccess(id);
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleUpdate = async (e: any) => { };

    const handleTrash = async (e: any) => { };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setError('');
            setSuccess('');
            setLoading('new');
            let title = itemTitle
            let priceAP = itemPriceAP;
            let priceATF = itemPriceATF;
            let desc = itemDescription;
            let mediaLink = itemMedia;
            let body = {
                discount: 0,
                price: priceATF,
                detail: {
                    name: title,
                    description: desc,
                    priceAP: priceAP,
                    priceATF: priceATF,
                },
                miniature: mediaLink,
            };
            let response = await createEvent(body, user.token)
                .then((data) => {
                    fetchData();
                    return data;
                })
                .catch((err) => setError(err));
            setLoading('');
            if (!response || !response.msg) {
                setError('new');
            } else {
                setSuccess('new');
            }
            setItemTitle("")
            setItemPriceAP("")
            setItemPriceATF("")
            setItemDescription("")
            setItemMedia("")
            setSuccessAlert(true)
            setVisualAlert(true)
        } catch (err) {
            setSuccessAlert(false)
            setVisualAlert(true)
            setError('new');
        }
    };

    const fetchData = async () => {
        const data = await getEvents();
        if (!Array.isArray(data)) {
            setError(data);
        } else {
            setProducts(data as any);
        }
    };

    useEffect(() => {
        const web3Check = async () => {
            if (!(await isWeb3(user)))
                router.push("/profile")
        }
        web3Check()
        fetchData();
    }, []);

    return (
        <>
            <Head>
                <title>ATF Shop</title>
            </Head>

            <main className="flex flex-col p-5 font-jost">
                <p className="font-bold text-4xl mb-10 font-sans">Events</p>
                <p className="text-lg w-full bg-[#FDE100]/20 px-5 pt-5">
                    Add new Item
                </p>

                <div className="flex items-center space-x-5 mb-10 bg-[#FDE100]/20 p-5 rounded">
                    <form
                        onSubmit={handleSubmit}
                        method="post"
                        className="flex items-center gap-5 mb-10 p-5 rounded flex-wrap"
                    >
                        <BsStar
                            onClick={() => { }}
                            className="text-xl cursor-pointer"
                        />
                        <input
                            id="events-title"
                            placeholder="title"
                            type="text"
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60"
                            value={itemTitle}
                            onChange={e => setItemTitle(e.target.value)}
                        />
                        <input
                            id="events-priceAP"
                            placeholder="price AP"
                            type="number"
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60"
                            value={itemPriceAP}
                            onChange={e => setItemPriceAP(e.target.value)}
                        />
                        <input
                            id="events-priceATF"
                            placeholder="price ATF"
                            type="number"
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60"
                            value={itemPriceATF}
                            onChange={e => setItemPriceATF(e.target.value)}
                        />
                        <input
                            id="events-description"
                            placeholder="description"
                            type="text"
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60"
                            value={itemDescription}
                            onChange={e => setItemDescription(e.target.value)}
                        />
                        <input
                            id="events-media"
                            placeholder="media link"
                            type="text"
                            className="rounded-full bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60"
                            value={itemMedia}
                            onChange={e => setItemMedia(e.target.value)}
                        />
                        <label className="rounded-full bg-gray-100 cursor-pointer p-2 px-4 border border-black/50 placeholder:text-black/60 w-40">
                            Add file
                            <input
                                type="file"
                                placeholder="Add file"
                                id="file"
                                name="File"
                                className="rounded-full hidden bg-gray-100 p-2 px-4 border border-black/50 placeholder:text-black/60 w-40"
                            />
                        </label>
                        <button
                            type="submit"
                            className="flex items-center justify-around border border-black rounded-full px-4 p-2 cursor-pointer"
                        >
                            <svg
                                className={`${loading === 'new' ? 'block' : 'hidden'
                                    } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                            />
                            <span
                                className={`${loading === 'new' ? 'hidden' : 'block'
                                    } text-black w-full`}
                            >
                                Confirm
                            </span>
                        </button>
                        {success === 'new' && (
                            <p className={`text-green-500`}>Success</p>
                        )}
                        {error === 'new' && (
                            <p className={`text-red-500}`}>Error</p>
                        )}
                    </form>
                </div>

                <p className="py-2 text-lg">Edit exisiting Items</p>

                <div className="flex space-x-5">
                    <input
                        type="text"
                        placeholder="Search item..."
                        className="rounded-full px-4 py-2 mb-5 border border-black/50 w-full max-w-xl"
                    />
                </div>

                <div className="flex flex-col space-y-5">
                    {products?.length > 0 ? (
                        products
                            ?.filter((product: any) => product)
                            .map((product: any) => (
                                <>
                                    <form onSubmit={handleUpdate} method="post">
                                        <div
                                            id={product.id}
                                            className="flex space-x-5 h-48 items-center pt-5"
                                        >
                                            <div className="flex flex-col space-y-5">
                                                <BsStar
                                                    onClick={() => { }}
                                                    className="text-xl cursor-pointer"
                                                />
                                                <BsTrash
                                                    onClick={handleTrash}
                                                    className="text-xl cursor-pointer"
                                                />
                                            </div>

                                            <div className="flex flex-col space-y-2 italic h-full">
                                                <p>Title</p>
                                                <textarea
                                                    id={`${product.id}_title`}
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLTextAreaElement>
                                                    ) => {
                                                        (
                                                            document.getElementById(
                                                                `${product.id}_title`
                                                            ) as HTMLInputElement
                                                        ).value =
                                                            event.target.value;
                                                    }}
                                                    defaultValue={product.title}
                                                    className="rounded bg-gray-100 p-2 px-4 border border-black/50 h-full"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-2 italic h-full">
                                                <p>Price AP</p>
                                                <input
                                                    id={`${product.id}_priceAP`}
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                        (
                                                            document.getElementById(
                                                                `${product.id}_priceAP`
                                                            ) as HTMLInputElement
                                                        ).value =
                                                            event.target.value;
                                                    }}
                                                    defaultValue={
                                                        product.priceAP
                                                    }
                                                    type="number"
                                                    className="rounded max-h-fit bg-gray-100 p-2 px-4 border border-black/50 w-44"
                                                />
                                                <p>Price ATF</p>
                                                <input
                                                    id={`${product.id}_priceATF`}
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                        (
                                                            document.getElementById(
                                                                `${product.id}_priceATF`
                                                            ) as HTMLInputElement
                                                        ).value =
                                                            event.target.value;
                                                    }}
                                                    defaultValue={
                                                        product.priceATF
                                                    }
                                                    type="number"
                                                    className="rounded max-h-fit bg-gray-100 p-2 px-4 border border-black/50 w-44"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-2 italic h-full">
                                                <p>Description</p>
                                                <textarea
                                                    id={`${product.id}_description`}
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLTextAreaElement>
                                                    ) => {
                                                        (
                                                            document.getElementById(
                                                                `${product.id}_description`
                                                            ) as HTMLInputElement
                                                        ).value =
                                                            event.target.value;
                                                    }}
                                                    defaultValue={
                                                        product.description
                                                    }
                                                    className="rounded bg-gray-100 p-2 px-4 border border-black/50 w-96 h-full"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-2 italic h-full">
                                                <p>Media Link</p>
                                                <textarea
                                                    id={`${product.id}_media`}
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLTextAreaElement>
                                                    ) => {
                                                        (
                                                            document.getElementById(
                                                                `${product.id}_media`
                                                            ) as HTMLInputElement
                                                        ).value =
                                                            event.target.value;
                                                    }}
                                                    defaultValue={product.image}
                                                    className="rounded bg-gray-100 p-2 px-4 border border-black/50 w-96 h-full"
                                                />
                                            </div>
                                            <input
                                                id={`${product.id}_id`}
                                                defaultValue={product.id}
                                                className="hidden"
                                            />
                                            <button
                                                type="submit"
                                                className="flex items-center justify-around border border-black rounded px-4 p-2 cursor-pointer"
                                            >
                                                <svg
                                                    className={`${loading === product.id
                                                        ? 'block'
                                                        : 'hidden'
                                                        } animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full `}
                                                />
                                                <span
                                                    className={`${loading === product.id
                                                        ? 'hidden'
                                                        : 'block'
                                                        } text-black w-full`}
                                                >
                                                    Confirm
                                                </span>
                                            </button>
                                            {success === product.id && (
                                                <p className={`text-green-500`}>
                                                    Success
                                                </p>
                                            )}
                                            {error === product.id && (
                                                <p className={`text-red-500}`}>
                                                    Success
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            ID: {product.id}
                                        </p>
                                        <hr />
                                    </form>
                                </>
                            ))
                    ) : (
                        <div>There are not events {products}</div>
                    )}
                    {
                        visualAlert && <PopUpAlert
                            isSuccess={successAlert}
                            successMessage="Event added successful"
                            deniedMessage="Event added denied"
                            setVisualAlert={setVisualAlert}
                        />
                    }
                </div>
            </main>
        </>
    );
};

export default Events;
