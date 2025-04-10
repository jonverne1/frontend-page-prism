const BASE_URL = 'https://screenshotof.com'

/**
 * Fetches a screenshot of a website.
 * @param {string} websiteUri - The URI of the website to screenshot.
 * @param {string|null} date - Optional. The date of the screenshot (2024-01 - 2024-10).
 * @param {Object} options - Optional. Additional query parameters for the request.
 * @returns {Promise<string>} A Promise that resolves to the object URL of the screenshot blob.
 * @throws {Error} If there's an HTTP error or other issues during the fetch.
 */
export const getScreenshot = async (websiteUri, date = null, options = {}) => {
  const queryParams = new URLSearchParams(options)
  let url = `${BASE_URL}/${websiteUri}`
  if (date) {
    url += `/${date}`
  }
  try {
    const response = await fetch(`${url}?${queryParams}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error getting screenshot:', error)
    throw error
  }
}

/**
 * Returns a real screenshot-like image blob URL for https://example.com
 * Uses https://image.thum.io to simulate a screenshot.
 */
export const mockGetScreenshot = async () => {
  // Optional: simulate latency
  await new Promise((res) => setTimeout(res, 300))

  const screenshotUrl = 'https://image.thum.io/get/width/1280/crop/720/noanimate/https://example.com'

  const response = await fetch(screenshotUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch screenshot of https://example.com')
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

/**
 * Fetches metadata for a website screenshot.
 * @param {string} websiteUri - The URI of the website.
 * @param {string|null} date - Optional. The the metadata was captured (2024-01 - 2024-10).
 * @returns {Promise<import("../models/schema").WebsiteMetadata>} A Promise that resolves to the metadata object.
 * @throws {Error} If there's an HTTP error or other issues during the fetch.
 */
export const getMetadata = async (websiteUri, date = null) => {
  try {
    let url = `${BASE_URL}/${websiteUri}`
    if (date) {
      url += `/${date}`
    }
    const response = await fetch(`${url}?f=json`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching metadata:', error)
    throw error
  }
}

/**
 * Returns mock website metadata for https://example.com
 */
export const mockGetMetadata = async () => {
  await new Promise((res) => setTimeout(res, 300)) // Simulated latency

  return {
    url: 'https://example.com',
    title: 'Example Domain',
    description:
      'This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.',
    favicon: 'https://example.com/favicon.ico',
    author: null,
    date: null,
    image: 'https://image.thum.io/get/width/1200/crop/630/noanimate/https://example.com',
    logo: null,
    publisher: 'IANA',
    ogTitle: 'Example Domain',
    ogDescription:
      'Used in illustrative examples. Maintained by the Internet Assigned Numbers Authority (IANA).',
    ogImage: [
      {
        url: 'https://image.thum.io/get/width/1200/crop/630/noanimate/https://example.com',
        type: 'image/jpeg',
      },
    ],
    ogLocale: 'en_US',
    ogUrl: 'https://example.com',
    charset: 'UTF-8',
    urlRequested: 'https://example.com',
    urlResolved: 'https://example.com',
  }
}