import { NextApiRequest, NextApiResponse } from 'next'

import { MongoClient, Db } from 'mongodb'
import { FetchProps } from './fetch'
import nc from 'next-connect'

let cachedDb: Db = null!

export const database = {
  async connect() {
    const secret = process.env.mongo_uri || ''

    if (cachedDb) return cachedDb

    const databaseClient = await MongoClient.connect(secret)

    cachedDb = databaseClient.db('face-auth')
    return cachedDb
  },
  async get(identy: { id: string }) {
    const query = { 'userProfile.userId': identy.id }
    const user = await cachedDb?.collection('subscribers')?.findOne(query)
    return user ?? null
  },
}

const handler = nc<NextApiRequest, NextApiResponse>().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    await database.connect()

    const body: FetchProps = await JSON.parse(req.body)
    const { action } = body
    const exec = database[action]

    if (exec) {
      const response = await exec(body)
      res.json(response)
      return
    }
  }
)

export default handler
