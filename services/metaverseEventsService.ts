import { createProduct, getProducts } from "./productService"

export async function parseMetaverseEvent(nfts: any) {
    let nft = nfts.map((n: any) => {
        let newNft = {
            categoy: "metaverse-events",
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

export async function getMetaverseEvents() {
    const products = await getProducts('events/metaverse').then(data => data.products).catch(err => err)
    if (!Array.isArray(products)) {
        return products
    }
    const nfts = await parseMetaverseEvent(products);
    return nfts
}

export async function createMetaverseEvent(body: any, metaverse: any, token: any) {
    let mtv = metaverse
    if (!mtv) {
        mtv = 'default'    
    }
    return createProduct(body, `events/metaverse`, token)
}

