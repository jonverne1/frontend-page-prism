import type { WebsiteMetadata } from '../models/schema'

const BASE_URL = 'https://api.microlink.io/'

const normalizeUrl = (websiteUri: string): string => {
  // Ensure URL has a protocol
  const rawUrl = websiteUri.startsWith('http') ? websiteUri : `https://${websiteUri}`

  try {
    const parsedUrl = new URL(rawUrl)

    // Strip "www." from the hostname
    parsedUrl.hostname = parsedUrl.hostname.replace(/^www\./, '')

    return parsedUrl.toString()
  } catch (error) {
    console.warn('Invalid URL passed to normalizeUrl:', websiteUri)
    return rawUrl // Fallback in case URL parsing fails
  }
}

const fetchMicrolink = async (url: string): Promise<any> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Microlink API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  return json.data
}

/**
 * Fetches both metadata and screenshot from a website using the Microlink API.
 * @param websiteUri - The URI of the website (e.g., "example.com" or "https://example.com")
 * @returns A Promise resolving to both structured metadata and a screenshot blob URL
 */
export const getWebsitePreview = async (
  websiteUri: string
): Promise<{ metadata: WebsiteMetadata; screenshotUrl: string }> => {
  const normalizedUrl = normalizeUrl(websiteUri)
  const apiUrl = `${BASE_URL}?url=${encodeURIComponent(normalizedUrl)}&screenshot=true`

  try {
    const data = await fetchMicrolink(apiUrl)

    const metadata: WebsiteMetadata = {
      url: data.url,
      title: data.title ?? null,
      description: data.description ?? null,
      favicon: data.logo?.url ?? null,
      author: data.author ?? null,
      date: data.date ?? null,
      image: data.image?.url ?? null,
      logo: data.logo?.url ?? null,
      publisher: data.publisher ?? null,
      ogTitle: data.title ?? null,
      ogDescription: data.description ?? null,
      ogImage: data.image
        ? [
            {
              url: data.image.url,
              type: data.image.type ?? 'image/jpeg',
            },
          ]
        : [],
      ogLocale: 'en_US',
      ogUrl: data.url,
      charset: 'UTF-8',
      urlRequested: normalizedUrl,
      urlResolved: data.url,
    }

    const screenshotDirectUrl = data?.screenshot?.url
    if (!screenshotDirectUrl) {
      throw new Error('Screenshot not available from Microlink.')
    }

    const imageResponse = await fetch(screenshotDirectUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch screenshot image: ${imageResponse.statusText}`)
    }

    const blob = await imageResponse.blob()
    const screenshotBlobUrl = URL.createObjectURL(blob)

    return { metadata, screenshotUrl: screenshotBlobUrl }
  } catch (error) {
    console.error('Error fetching website preview from Microlink:', error)
    throw error
  }
}