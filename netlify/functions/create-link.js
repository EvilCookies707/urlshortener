import { MongoClient, ServerApiVersion } from 'mongodb'
import { nanoid } from 'nanoid'

export const handler = async (event, context) => {
    if(event.httpMethod.toLowerCase() !== "post") {
        return {
            statusCode: 501
        }
    }
  
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
      const body = JSON.parse(event.body)

      await links.insertOne(
        {
          id: nanoid(10),
          url: body.url
        }
      )
  
      return {
        statusCode: 201
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