const { onRequest } = require('firebase-functions/v2/https')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
const logger = require('firebase-functions/logger')

admin.initializeApp()

exports.countBooks = onRequest(
  { region: 'australia-southeast2', maxInstances: 2, invoker: 'public' },
  (request, response) => {
    return cors(request, response, async () => {
      if (request.method !== 'GET') {
        response.set('Allow', 'GET').status(405).json({ error: 'Method not allowed' })
        return
      }

      try {
        const snapshot = await admin.firestore().collection('books').count().get()
        response.set('Cache-Control', 'no-store').json({ count: snapshot.data().count })
      } catch (error) {
        logger.error('Unable to count books', error)
        response.status(500).json({ error: 'Unable to get the book count.' })
      }
    })
  },
)

exports.getAllBooks = onRequest(
  { region: 'australia-southeast2', maxInstances: 2, invoker: 'public' },
  (request, response) => {
    return cors(request, response, async () => {
      if (request.method !== 'GET') {
        response.set('Allow', 'GET').status(405).json({ error: 'Method not allowed' })
        return
      }

      try {
        const snapshot = await admin.firestore().collection('books').get()
        const books = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }))
        response.set('Cache-Control', 'no-store').json(books)
      } catch (error) {
        logger.error('Unable to get all books', error)
        response.status(500).json({ error: 'Unable to get all books.' })
      }
    })
  },
)

// Convert every text value, including text inside arrays and nested objects.
function capitaliseText(value) {
  if (typeof value === 'string') return value.toUpperCase()
  if (Array.isArray(value)) return value.map(capitaliseText)
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, capitaliseText(item)]),
    )
  }
  return value // Preserve numbers, timestamps and other Firestore types.
}

const { onDocumentCreated } = require('firebase-functions/v2/firestore')

exports.capitaliseBook = onDocumentCreated(
  { document: 'books/{bookId}', region: 'australia-southeast2', maxInstances: 2 },
  async (event) => {
    if (!event.data) return
    // Use the latest record so retries do not overwrite subsequent edits.
    await admin.firestore().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(event.data.ref)
      if (!snapshot.exists) return
      transaction.set(snapshot.ref, capitaliseText(snapshot.data()))
    })
  },
)
