import type { NextApiRequest, NextApiResponse } from 'next'

// Fetch Assets from OpenSea. So Far Open Sea returns up to 50 results per request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      `https://atf-test.backendboyz.repl.co/api/products`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.OPENSEA!,
        },
      }
    )
    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json(err)
  }
}
