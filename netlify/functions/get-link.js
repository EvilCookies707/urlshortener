import { MongoClient, ServerApiVersion } from 'mongodb'

export const handler = async (event, context) => {
  const pathBlocks = event.path.split('/')
  const id = pathBlocks[pathBlocks.length - 1]

  if (!id) return { statusCode: 400 }

  const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_TOKEN}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority`
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })

  await client.connect()

  try {
    const db = client.db('link-shortener')
    const links = db.collection('links')
    const query = { id }

    const link = await links.findOne(query)

    return {
      statusCode: 200,
      body: JSON.stringify(link),
      headers: {
        "Content-Type": 'application/json'
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to process link creation, please try again.', details: err}),
      headers: {
        "Content-Type": 'application/json'
      }
    }
  } finally {
    await client.close()
  }
}