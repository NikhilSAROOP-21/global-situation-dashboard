import express from 'express'
import cors from 'cors'

const app = express()

const PORT = 5050
const LOCAL_MODEL = 'llama3.1'

const OLLAMA_URL =
  'http://127.0.0.1:11434/api/chat'

const R3_ROUTE_URL =
  'http://127.0.0.1:6060/api/route'

app.use(cors())
app.use(express.json({ limit: '5mb' }))

const blockedKeys = new Set([
  'geometry',
  'geometries',
  'material',
  'materials',
  'matrix',
  'matrixWorld',
  'children',
  'parent'
])

// Remove large Three.js rendering objects from the dashboard snapshot.
function cleanDashboardData(value, depth = 0) {
  if (depth > 6) {
    return undefined
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, 40)
      .map((item) =>
        cleanDashboardData(item, depth + 1)
      )
      .filter((item) =>
        item !== undefined
      )
  }

  if (
    value !== null
    && typeof value === 'object'
  ) {
    const cleanedObject = {}

    for (
      const [key, item]
      of Object.entries(value)
    ) {
      if (
        key.startsWith('_')
        || blockedKeys.has(key)
      ) {
        continue
      }

      const cleanedItem =
        cleanDashboardData(
          item,
          depth + 1
        )

      if (cleanedItem !== undefined) {
        cleanedObject[key] = cleanedItem
      }
    }

    return cleanedObject
  }

  if (typeof value === 'string') {
    return value.slice(0, 1000)
  }

  if (
    typeof value === 'number'
    || typeof value === 'boolean'
    || value === null
  ) {
    return value
  }

  return undefined
}


// Configure deterministic and probabilistic generation.
function getGenerationOptions(mode) {
  if (mode === 'probabilistic') {
    return {
      temperature: 0.8,
      top_k: 40,
      top_p: 0.9,
      seed: Math.floor(
        Math.random() * 2147483647
      ),
      num_predict: 350
    }
  }

  // Model A and Model C use deterministic generation.
  return {
    temperature: 0,
    top_k: 1,
    top_p: 1,
    seed: 42,
    num_predict: 350
  }
}


// Send the question to the local Tencent R3-Skill service.
async function selectR3Skill(question) {
  const response = await fetch(
    R3_ROUTE_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json'
      },
      body: JSON.stringify({
        question,
        topK: 3
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error
      || 'Tencent R3-Skill request failed'
    )
  }

  return data
}


// Check that the Node backend is running.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message:
      'Local AI server is running',
    model: LOCAL_MODEL,
    availableModes: [
      'deterministic',
      'probabilistic',
      'r3'
    ]
  })
})


app.post(
  '/api/assistant',
  async (req, res) => {
    try {
      const {
        question,
        dashboard,
        mode = 'deterministic'
      } = req.body

      if (
        typeof question !== 'string'
        || question.trim() === ''
        || !dashboard
      ) {
        return res.status(400).json({
          error:
            'Missing question or dashboard data'
        })
      }

      const validModes = [
        'deterministic',
        'probabilistic',
        'r3'
      ]

      if (!validModes.includes(mode)) {
        return res.status(400).json({
          error: 'Invalid model mode'
        })
      }

      const cleanedDashboard =
        cleanDashboardData(dashboard)

      const generationOptions =
        getGenerationOptions(mode)

      let r3Routing = null
      let specialistGuidance = ''

      // Model C first uses Tencent R3-Skill
      // to select the appropriate analyst skill.
      if (mode === 'r3') {
        try {
          r3Routing = await selectR3Skill(
            question.trim()
          )
        } catch (error) {
          return res.status(503).json({
            error:
              'Model C service is unavailable. '
              + 'Start r3_service.py '
              + 'on port 6060.',
            details: error.message
          })
        }

        specialistGuidance = `
Tencent R3-Skill selected this specialist:

${r3Routing.selectedSkill.text}

Use this specialist role to focus the analysis.

Do not claim that R3 generated the final wording. R3 selected the specialist skill, and the local language model produced the answer.
        `.trim()
      }

      const systemPrompt = `
You are a local intelligence dashboard analyst.

Answer the user's question directly using only the supplied dashboard snapshot.

Do not describe the JSON structure.
Do not discuss programming objects, Three.js objects or rendering data.
Do not invent information.

If the answer is not available in the snapshot, clearly say so.

Keep the answer concise and use an analyst-style tone.

When discussing risk, include the risk level, risk score and important contributing events when available.

${specialistGuidance}
      `.trim()

      const ollamaResponse = await fetch(
        OLLAMA_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            model: LOCAL_MODEL,
            stream: false,
            options:
              generationOptions,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: `
Question:

${question.trim()}

Dashboard snapshot:

${JSON.stringify(cleanedDashboard)}
                `.trim()
              }
            ]
          })
        }
      )

      const data =
        await ollamaResponse.json()

      if (!ollamaResponse.ok) {
        throw new Error(
          data.error
          || 'Ollama request failed'
        )
      }

      res.json({
        answer:
          data.message?.content
          || 'No response from local AI.',
        mode,
        model: LOCAL_MODEL,
        generationOptions,

        