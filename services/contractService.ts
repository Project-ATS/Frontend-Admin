import { InMemorySigner } from '@taquito/signer'
import { MichelsonMap, TezosToolkit } from '@taquito/taquito'
import { char2Bytes } from '@taquito/utils'
import axios from 'axios'

const Tezos = new TezosToolkit('https://ghostnet.smartpy.io')
const setProvider = async () =>
    Tezos.setProvider({
        signer: await InMemorySigner.fromSecretKey(
            process.env.WALLET_PRIVATE_KEY!
        ),
    })
setProvider()
let wallet_public_key = process.env.WALLET_PUBLIC_KEY
let nft_contract_address = process.env.NFT_CONTRACT_ADDRESS
let marketplace_contract_address = process.env.MARKETPLACE_CONTRACT_ADDRESS
let nft_contract = Tezos.contract.at(nft_contract_address!)
let marketplace_contract = Tezos.contract.at(marketplace_contract_address!)

export const nftMint = async ({
    token_id,
    token_symbol,
    token_amount,
    media_link,
    token_price,
    jwt,
    name,
    description,
    buyLevel,
}: any) => {
    try {
        let nftData = await axios.post('/api/pinJSON', {
                json: {
                    artifactUri: media_link,
                    attributes: [
                        {
                            name: 'Scanned',
                            value: 'False',
                        },
                        {
                            name: 'Revealed',
                            value: 'False',
                        },
                        {
                            name: 'Rarity',
                            value: 'Unknown',
                        },
                    ],
                    creators: ['ATF'],
                    decimals: 0,
                    description: description,
                    displayUri: media_link,
                    formats: [
                        {
                            mimeType: 'image/png',
                            uri: media_link,
                        },
                    ],
                    name,
                    rights: '',
                    royalties: {
                        decimals: 2,
                        shares: {
                            tz1hWz1ZgTJRuvGiKVxUgnQA1m9kCxhYfcX1: '10',
                        },
                    },
                    symbol: 'XTZ',
                    thumbnailUri: media_link,
                },
        })
        nftData = nftData.data
        let token_metadata = MichelsonMap.fromLiteral({
            media_link: char2Bytes(media_link as string),
            name: char2Bytes(name as string),
            description: char2Bytes(description as string),
            '': nftData,
        })
        let { methodsObject } = await nft_contract
        let batch = Tezos.contract.batch([])
        let batchSend = await batch
            .withContractCall(
                methodsObject.mint({
                    token_id,
                    token_metadata,
                    amount_: token_amount,
                    owner: wallet_public_key,
                })
            )
            .withContractCall(
                methodsObject.update_operators([
                    {
                        add_operator: {
                            owner: wallet_public_key,
                            operator: marketplace_contract_address,
                            token_id,
                        },
                    },
                ])
            )
            .send()
        await batchSend.confirmation()
        const config = {
            headers: { Authorization: `Bearer ${jwt}` },
        }
        let { next_swap_id } = (await (
            await marketplace_contract
        ).storage()) as any
        const bodyParameters = {
            id_category: 2,
            discount: 0,
            price: token_price,
            detail: {
                name,
                buyLevel: buyLevel ? buyLevel : '',
                priceAP: token_symbol === 'AP' ? token_price : '',
                priceATF: token_symbol === 'ATF' ? token_price  : '',
                description,
                media_link,
                token_id,
                swap_id: next_swap_id,
            },
            miniature: media_link,
        }
        const res = await addToMarketplace({
            token_id,
            token_price: Math.round(token_price*10**5),
            token_symbol,
        })
        await axios.post('/api/nft', bodyParameters, config)
        console.log('NFT created on db', res)

        return true
    } catch (error) {
        return false
    }
}

export const addToMarketplace = async ({
    token_id,
    token_price,
    token_symbol,
}: any) => {
    let { methodsObject } = await marketplace_contract
    return await methodsObject
        .addToMarketplace({
            token_id: token_id as number,
            token_price: token_price as number,
            recipient: { general: '' },
            swap_type: { regular: '' },
            token_origin: nft_contract_address,
            start_time: new Date(Date.now()).toISOString(),
            end_time: new Date(Date.now() * 2).toISOString(),
            token_symbol,
            accepted_tokens: [],
            is_multi_token: false,
        })
        .send()
}
