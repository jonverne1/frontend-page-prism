const BASE_URL = 'http://localhost:11434/api/generate'

export const askQuestion = async (prompt: string) => {
  let body = {
    model: 'tinyllama',
    prompt: prompt,
    stream: false,
  }

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const respJson = await response.json()
    console.log(respJson)
    return respJson.response
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
