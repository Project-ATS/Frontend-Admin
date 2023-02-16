import { SigningType } from '@airgap/beacon-sdk'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'
import axios from 'axios'
const { char2Bytes } = require('@taquito/utils')

interface loginResult {
    statusCode: number
    msg: string
    token: string
    refreshToken: string
}
export const Tezos = new TezosToolkit('https://ghostnet.smartpy.io')

let wallet_instance: any = null

export const getWalletInstance = () => {
    if (!wallet_instance)
        wallet_instance = new BeaconWallet({
            name: 'ATF Beacon',
        })
    return wallet_instance
}

const notifyMobile = (result: loginResult) => {
    const aWindow: any = window as any
    //IOS case
    if (aWindow.webkit?.messageHandlers?.web3LoginHandler) {
        aWindow.webkit?.messageHandlers?.web3LoginHandler.postMessage(result)
    }
    //Android case
    console.log(aWindow.androidWeb3, 'Left out')
    if (aWindow.androidWeb3) {
        console.log(aWindow.androidWeb3, 'Joined')
        aWindow.androidWeb3.onLoginResult(JSON.stringify(result))
    }
}

export const getNonce = async (address: any) => {
    return (await axios.post('/api/loginGetNonce', { address })).data
}

export const login = async (address: any, publicKey: any, wallet: any) => {
    const nonce = await getNonce((await wallet.client.getActiveAccount()).address)
    console.log(nonce, "Nonce")
    const bytes = char2Bytes(nonce + '')
    const payloadBytes = '05' + '0100' + char2Bytes(bytes.length + '') + bytes
    const callData = (
        await axios.post('/api/loginWallet', {
            signature: (
                await wallet.client.requestSignPayload({
                    signingType: SigningType.MICHELINE,
                    payload: payloadBytes,
                })
            ).signature,
            address,
            publicKey
        })
    ).data
    try {
        notifyMobile(callData)
        return callData
    } catch (err) {
        console.log(err)
    }
}

export const checkJWT = async (jwt: any) => {
    return axios.get('/api/validate-token', {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    })
}

export const isWeb3 = async (user: any) => {
    const aWindow: any = window as any
    //IOS case
    let ios = aWindow.webkit?.messageHandlers?.web3LoginHandler
    if (ios && ios?.wallet_instance) {
        if ((await checkJWT(ios?.JWT))?.data?.user_id) return true
        return true
    }
    //Android case
    let android = aWindow.androidWeb3
    if (android && android?.wallet_instance) {
        if ((await checkJWT(aWindow.androidWeb3?.JWT))?.data?.user_id)
            return true
    }
    if (user.wallet_instance) return true

    return false
}