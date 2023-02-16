import { createProduct, getProducts } from "./productService"

export async function parseApparel(events: any) {
    let ev = events.map((e: any) => {
        let newEvent = {
            categoy: "apparels",
            id: e.id_product,
            title: e?.Detail?.detail?.name,
            priceAP: e?.Detail?.detail?.priceAP ? e?.Detail?.detail?.priceAP : 0,
            priceATF: e?.Detail?.detail?.priceAP ? e?.Detail?.detail?.priceATF : 0,
            description: e?.Detail?.detail?.description,
            image: e?.Detail?.miniature,
        }        
        return newEvent
    })
    return ev
} 

export async function getApparels() {
    const products = await getProducts('apparels').then(data => data.products).catch(err => err)
    if (!Array.isArray(products)) {
        return products
    }
    const events = await parseApparel(products);
    return events
}

export async function createApparel(body: any, token: any) {
    return createProduct(body, 'apparel', token)
}

