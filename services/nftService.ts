import { createProduct, getProducts } from "./productService"

export async function parseNFT(nfts: any) {
    let nft = nfts.map((n: any) => {
        let newNft = {
            categoy: "appareals",
            id: n.id_product,
            title: n?.Detail?.detail?.name,
            priceAP: n?.Detail?.detail?.priceAP ? n?.Detail?.detail?.priceAP : 0,
            priceATF: n?.Detail?.detail?.priceAP ? n?.Detail?.detail?.priceATF : 0,
            description: n?.Detail?.detail?.description,
            image: n?.Detail?.miniature,
        }        
        return newNft
    })
    return nft
} 

export async function getNFTs() {
    const products = await getProducts('nfts').then(data => data).catch(err => err)
    if (!Array.isArray(products)) {
        return products
    }
    const nfts = await parseNFT(products);
    return nfts
}

export async function createNFT(body: any) {
    createProduct(body, 'nft')
}

