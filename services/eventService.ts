import { createProduct, getProducts } from "./productService"

export async function parseEvents(events: any) {
    let ev = events.map((e: any) => {
        let newEvent = {
            categoy: "events",
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

export async function getEvents() {
    const products = await getProducts('events').then(data => data.products).catch(err => err)
    if (!Array.isArray(products)) {
        return products
    }
    const events = await parseEvents(products);
    return events
}

export async function createEvent(body: any, token: any) {
    return createProduct(body, 'event', token)
}


export async function updateEvent(body: any, id: any) {
    try {
        const url = `https://atf-test.backendboyz.repl.co/api/event/${id}`
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWYzOGFkOGItNDU0NC00NjIxLWEyMjctMjhmMTFlOTQ4OTUxIiwiaWF0IjoxNjU5NTYyMzY3LCJleHAiOjE2NTk1NjU5Njd9.24zCdnIE6K7-aRE2iZ_Be2JUuG7JnIbnORKnjvmgfE0'
              },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function deleteEvent(id: any) {
    try {
        const url = `https://atf-test.backendboyz.repl.co/api/event/${id}`
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWYzOGFkOGItNDU0NC00NjIxLWEyMjctMjhmMTFlOTQ4OTUxIiwiaWF0IjoxNjU5NTUwNjg4LCJleHAiOjE2NTk1NTQyODh9.M8uHdEIVuGbGoQK5VCljoinnfRwudCDcbBS7C_IE2vc'
              },
        })
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return error
    }
}