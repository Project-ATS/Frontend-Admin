/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    typescript: { ignoreBuildErrors: true },
    images: {
        domains: ['gateway.pinata.cloud', 'ipfs.io'],
    },
    env: {
        WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
        WALLET_PUBLIC_KEY: process.env.WALLET_PUBLIC_KEY,
        NFT_CONTRACT_ADDRESS: process.env.NFT_CONTRACT_ADDRESS,
        MARKETPLACE_CONTRACT_ADDRESS: process.env.MARKETPLACE_CONTRACT_ADDRESS,
        ATF_TOKEN_CONTRACT_ADDRESS: process.env.ATF_TOKEN_CONTRACT_ADDRESS,
        ACCESS_KEY_ID_AWS: process.env.ACCESS_KEY_ID_AWS,
        SECRET_ACCESS_KEY_AWS: process.env.SECRET_ACCESS_KEY_AWS
    },
    async redirects() {
        return [
            {
                source: '/docs/mghdao_engl_whitepaper.pdf',
                destination: '/docs/mgh_whitepaper_v3.pdf',
                permanent: true,
            },
            {
                source: '/wp-content/uploads/2021/06/mghdao_engl_whitepaper_20210626_print-1.pdf',
                destination: '/docs/mgh_whitepaper_v3.pdf',
                permanent: true,
            },
            {
                source: '/valuation',
                destination: 'https://app.metagamehub.io/valuation',
                permanent: true,
            },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/api/loginGetNonce',
                destination:
                    'https://uat.alltokenfootball.com/api/loginGetNonce',
            },
            {
                source: '/api/loginWallet',
                destination:
                    'https://uat.alltokenfootball.com/api/loginWallet',
            },
            {
                source: '/api/nft',
                destination: 'https://uat.alltokenfootball.com/api/nft',
            },
            {
                source: '/api/nft',
                destination: 'https://uat.alltokenfootball.com/api/nfts',
            },
            {
                source: '/api/pinJSON',
                destination:
                    'https://uat.alltokenfootball.com/api/pinJSON',
            },
            {
                source: '/api/event',
                destination: 'https://uat.alltokenfootball.com/api/event',
            },
            {
                source: '/api/events',
                destination: 'https://uat.alltokenfootball.com/api/events',
            },
            {
                source: '/api/apparel',
                destination: 'https://uat.alltokenfootball.com/api/apparel',
            },
            {
                source: '/api/apparels',
                destination: 'https://uat.alltokenfootball.com/api/apparels',
            },
            {
                source: '/api/avatar',
                destination: 'https://uat.alltokenfootball.com/api/avatar',
            },
            {
                source: '/api/avatars',
                destination: 'https://uat.alltokenfootball.com/api/avatars',
            },
        ]
    },
}
