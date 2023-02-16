import type { NextApiRequest, NextApiResponse } from 'next'

// Fetch Single Asset from Open Sea.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const productId = req.query.productId
  try {
    const response = await fetch(
      `https://atf-test.backendboyz.repl.co/api/product/${productId}`,
      {
        headers: {
          'accept': 'application/json',
        },
      }
    )
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json(err)
  }
}
