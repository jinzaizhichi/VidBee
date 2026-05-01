// Sentry issue VIDBEE-68 (and the long tail VIDBEE-E / DE / 1G / 6I / 2 /
// 6FN / 2A) showed every yt-dlp child-process failure being raised through
// `YTDlpWrap.createError` and forwarded to Sentry without any classification.
// That made grouping unstable and buried real bugs under upstream / user-side
// noise. This module assigns a coarse category to a download error so the
// telemetry layer can decide whether to upload it and how to group it.

export type DownloadErrorCategory =
  | 'postprocessing'
  | 'http-error'
  | 'unsupported-url'
  | 'access-denied'
  | 'unavailable'
  | 'rate-limit'
  | 'network'
  | 'auth-required'
  | 'drm-protected'
  | 'no-format'
  | 'cookies-required'
  | 'environment'
  | 'cancelled'
  | 'unknown'

export interface DownloadErrorClassification {
  category: DownloadErrorCategory
  isOperational: boolean
}

interface CategoryRule {
  category: DownloadErrorCategory
  isOperational: boolean
  patterns: readonly string[]
}

const CATEGORY_RULES: readonly CategoryRule[] = [
  {
    category: 'cancelled',
    isOperational: true,
    patterns: ['aborterror', 'the operation was aborted', 'request aborted']
  },
  {
    category: 'auth-required',
    isOperational: true,
    patterns: [
      "sign in to confirm you're not a bot",
      'sign in to confirm you’re not a bot',
      'sign in to confirm your age',
      "private video. sign in if you've been granted access",
      'private video. sign in if you',
      'members-only content',
      'could not authenticate you',
      'authorization failed. try to reload page.'
    ]
  },
  {
    category: 'cookies-required',
    isOperational: true,
    patterns: [
      'fresh cookies (not necessarily logged in) are needed',
      'cookies (not necessarily logged in) are needed',
      'could not copy chrome cookie database',
      'could not find chrome cookies database',
      'could not find chromium cookies database',
      'could not find firefox cookies database',
      'could not find opera cookies database',
      'opera does not support profiles',
      'custom safari cookies database not found',
      'failed to decrypt with dpapi',
      'cookies file must be netscape formatted',
      'does not look like a netscape format cookies file',
      'secretstorage not available'
    ]
  },
  {
    category: 'rate-limit',
    isOperational: true,
    patterns: ['http error 429', 'too many requests', 'http error 412: precondition failed']
  },
  {
    category: 'drm-protected',
    isOperational: true,
    patterns: [
      'drm protected',
      'requested site is known to use drm protection',
      'known to use drm protection'
    ]
  },
  {
    category: 'no-format',
    isOperational: true,
    patterns: [
      'requested format is not available',
      'no video formats found',
      'no video could be found in this tweet'
    ]
  },
  {
    category: 'unavailable',
    isOperational: true,
    patterns: [
      'video unavailable',
      'access restricted',
      "this video has been removed for violating youtube's community guidelines",
      "this video has been removed for violating youtube's terms of service",
      'removed for violating youtube',
      'the channel is not currently live',
      'http error 404: not found',
      'http error 410: gone',
      'http error 502: bad gateway',
      'http error 503',
      'service unavailable. giving up after',
      'room is currently offline',
      'available in your country',
      "content isn't available to everyone",
      'premieres in ',
      'only the owner and editors can download this file',
      'offline.'
    ]
  },
  {
    category: 'access-denied',
    isOperational: true,
    patterns: [
      'http error 403: forbidden',
      'got http error 403 when using impersonate target',
      'access is denied',
      'cloudflare anti-bot challenge',
      'this website is no longer supported since it has been determined to be primarily used for piracy'
    ]
  },
  {
    category: 'unsupported-url',
    isOperational: true,
    patterns: [
      'unsupported url',
      'incomplete youtube id',
      'looks truncated',
      'cannot download embed-only video without embedding url'
    ]
  },
  {
    category: 'network',
    isOperational: true,
    patterns: [
      'connection aborted.',
      'forcibly closed by the remote host',
      'failed to resolve',
      'could not resolve host',
      'unable to connect to proxy',
      'unable to download video data',
      'unable to download video subtitles',
      'unable to extract',
      'unable to obtain',
      'read timed out',
      'connect etimedout',
      'resolving timed out after',
      'connection timed out after',
      'tls connect error',
      'tlsv1_alert_protocol_version',
      'sslv3_alert_handshake_failure',
      'eof occurred in violation of protocol',
      'certificate verify failed',
      'decryption failed or bad record mac',
      'requested range not satisfiable',
      'invalid data found when processing input',
      'cannot parse data',
      'did not get any data blocks',
      'more expected. giving up after',
      'net::err_connection_reset',
      'net::err_timed_out',
      'winerror 10013',
      'winerror 10061',
      'an attempt was made to access a socket in a way forbidden by its access permissions'
    ]
  },
  {
    category: 'environment',
    isOperational: true,
    patterns: [
      'no space left on device',
      'cannot create a file when that file already exists',
      'unable to rename file',
      'file name too long',
      'unable to create directory [winerror 3]',
      'winerror 32',
      'winerror 2',
      'winerror 5',
      'winerror 183',
      "'utf-8' codec can't decode byte",
      'decompression resulted in return code -1',
      'ffmpeg not found. please install or provide the path using --ffmpeg-location',
      'ffprobe not found. please install or provide the path using --ffmpeg-location',
      'encoder not found'
    ]
  },
  {
    category: 'postprocessing',
    isOperational: true,
    // Sentry issue VIDBEE-68 grouping noise: `Postprocessing:` failures bubble
    // up directly from yt-dlp's stderr. ffmpeg/ffprobe-side failures are
    // upstream tooling or source-data problems, not VidBee defects, so we
    // collapse them into a single operational category.
    patterns: [
      'postprocessing:',
      'embedding metadata',
      'embedding subtitles',
      'embedding thumbnails',
      'supported filetypes for thumbnail embedding are'
    ]
  },
  {
    category: 'http-error',
    isOperational: true,
    patterns: ['http error ']
  }
] as const

const normalize = (value: string | undefined | null): string => (value ?? '').trim().toLowerCase()

const collectMessages = (error: unknown): string[] => {
  const messages = new Set<string>()
  const add = (value: unknown): void => {
    if (typeof value !== 'string') {
      return
    }
    const normalized = normalize(value)
    if (normalized) {
      messages.add(normalized)
    }
  }

  if (typeof error === 'string') {
    add(error)
  } else if (error instanceof Error) {
    add(error.name)
    add(error.message)
    add(error.stack)
  }

  return [...messages]
}

const matchesAnyPattern = (messages: string[], patterns: readonly string[]): boolean =>
  patterns.some((pattern) => messages.some((message) => message.includes(pattern)))

/**
 * Classify a download error so telemetry can tag it and decide whether to
 * upload it. Operational errors (upstream / environment / user-state) get
 * skipped so VidBee-side defects rise above the noise.
 */
export const classifyDownloadError = (error: unknown): DownloadErrorClassification => {
  const messages = collectMessages(error)
  if (messages.length === 0) {
    return { category: 'unknown', isOperational: false }
  }

  for (const rule of CATEGORY_RULES) {
    if (matchesAnyPattern(messages, rule.patterns)) {
      return { category: rule.category, isOperational: rule.isOperational }
    }
  }

  return { category: 'unknown', isOperational: false }
}
