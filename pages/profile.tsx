import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { TezosToolkit } from '@taquito/taquito'
import {
    connectWallet,
    disconnectWallet,
    _walletConfig,
} from '../state/walletActions'
import dynamic from 'next/dynamic'
const ConnectWallet = dynamic(() => import('../components/ConnectWallet'), {
    ssr: false,
}) as any
const Profile: NextPage = () => {
    return (
        <>
            <Head>
                <title>ATF Profile</title>
            </Head>
            
            <ConnectWallet />
        </>
    )
}

export default Profile
