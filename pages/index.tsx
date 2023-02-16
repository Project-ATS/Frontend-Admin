import { useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useAppSelector } from '../state/hooks';
import { isWeb3 } from '../services/walletService'

const ConnectWallet = dynamic(() => import('../components/ConnectWallet'), {
    ssr: false,
}) as any

const Home: NextPage = () => {
    const { user } = useAppSelector((state) => state.account.walletConfig)
    const [_isWeb3, _setIsWeb3] = useState(false)

    useEffect(() => {
        const web3Check = async () => {
            _setIsWeb3(await isWeb3(user))
        }
        web3Check()
    }, [user])

    return (
        <>
            <Head>
                <title>ATF Shop</title>
            </Head>

            <main className="flex w-screen h-[80vh] items-center justify-center space-x-5 p-5">
                {
                    _isWeb3 ? (
                        <>
                            <Link href="/apparel">
                                <a className='rounded border border-black p-10 max-w-1/4'>Apparel</a>
                            </Link>
                            <Link href="/nfts">
                                <a className='rounded border border-black p-10 max-w-1/4'>NFTs</a>
                            </Link>
                            <Link href="/events">
                                <a className='rounded border border-black p-10 max-w-1/4'>Events</a>
                            </Link>
                            <Link href="/metaverse-events">
                                <a className='rounded border border-black p-10 max-w-1/4'>Metaverse Events</a>
                            </Link>
                            <Link href="/pictures">
                                <a className='rounded border border-black p-10 max-w-1/4'>Pictures</a>
                            </Link>
                        </>
                    ) : (
                        <ConnectWallet />
                    )
                }
            </main>
        </>
    )
}


export default Home
