import type { SubscriptionResolvedFeed } from '../../shared/types'

/**
 * Ensure custom subscription URLs always include an explicit protocol.
 *
 * @param value The raw URL entered by the user.
 * @returns The normalized URL with a protocol when needed.
 */
const ensureUrlHasProtocol = (value: string): string => {
  if (!value) {
    return value
  }
  if (!/^https?:\/\//i.test(value)) {
    return `https://${value}`
  }
  return value
}

/**
 * Build a YouTube feed URL with a safely encoded query value.
 *
 * @param key The YouTube feed query key.
 * @param value The raw identifier extracted from user input.
 * @returns The normalized feed URL.
 */
const createYouTubeFeedUrl = (key: 'channel_id' | 'user', value: string): string => {
  const feedUrl = new URL('https://www.youtube.com/feeds/videos.xml')
  feedUrl.searchParams.set(key, value)
  return feedUrl.toString()
}

/**
 * Resolve a user-entered subscription URL into a normalized source/feed pair.
 *
 * @param rawUrl The raw user input.
 * @returns The normalized subscription feed descriptor.
 */
export const resolveFeedFromInput = (rawUrl: string): SubscriptionResolvedFeed => {
  const normalized = ensureUrlHasProtocol(rawUrl.trim())
  const youTubeChannelMatch = normalized.match(/youtube\.com\/channel\/([A-Za-z0-9_-]+)/i)
  if (youTubeChannelMatch) {
    return {
      sourceUrl: normalized,
      feedUrl: createYouTubeFeedUrl('channel_id', youTubeChannelMatch[1]),
      platform: 'youtube'
    }
  }

  if (/youtube\.com\/feeds\/videos\.xml/i.test(normalized)) {
    return {
      sourceUrl: normalized,
      feedUrl: normalized,
      platform: 'youtube'
    }
  }

  const youTubeUserMatch = normalized.match(/youtube\.com\/(?:user|c)\/([^/?]+)/i)
  if (youTubeUserMatch) {
    return {
      sourceUrl: normalized,
      // Sentry issues VIDBEE-39A / VIDBEE-39B showed unescaped user input can
      // break rss-parser before the request is sent.
      feedUrl: createYouTubeFeedUrl('user', youTubeUserMatch[1]),
      platform: 'youtube'
    }
  }

  const youTubeHandleMatch = normalized.match(/youtube\.com\/(@[^/?]+)/i)
  if (youTubeHandleMatch) {
    const handle = youTubeHandleMatch[1].replace('@', '')
    return {
      sourceUrl: normalized,
      feedUrl: createYouTubeFeedUrl('user', handle),
      platform: 'youtube'
    }
  }

  const biliSpaceMatch = normalized.match(/bilibili\.com\/(?:space|user)\/(\d+)/i)
  if (biliSpaceMatch) {
    return {
      sourceUrl: normalized,
      feedUrl: `https://rsshub.app/bilibili/user/video/${biliSpaceMatch[1]}`,
      platform: 'bilibili'
    }
  }

  if (/rsshub\.app\/bilibili/i.test(normalized)) {
    return {
      sourceUrl: normalized,
      feedUrl: normalized,
      platform: 'bilibili'
    }
  }

  return {
    sourceUrl: normalized,
    feedUrl: normalized,
    platform: 'custom'
  }
}
