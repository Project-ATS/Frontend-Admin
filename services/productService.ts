export async function createProduct(body: any, category: any, token: any) {
    try {
        // TODO: delete this token 
        // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWYzOGFkOGItNDU0NC00NjIxLWEyMjctMjhmMTFlOTQ4OTUxIiwiaWF0IjoxNjU5NTc3NTE0LCJleHAiOjE2NTk1ODExMTR9.6kbxEHBxSVh13BDMdxn5sGk5DPK2jmXR1XeE3zOx7ao' 
        const url = `https://atf-test.backendboyz.repl.co/api/${category}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        console.log("> Response:",data)
        return data
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function getProducts(category: any) {
    try {
        const response = await fetch(
            `https://atf-test.backendboyz.repl.co/api/${category}`,
        )
        const data = await response.json();
        console.log(data)
        return data
    } catch (error) {
        return error        
    }
}
