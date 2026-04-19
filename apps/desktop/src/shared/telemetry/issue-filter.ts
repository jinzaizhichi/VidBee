const GLOBAL_OPERATIONAL_PATTERNS = [
  'ffmpeg not initialized. call initialize() first.',
  'manual download feedback submitted'
]

const DOWNLOAD_OPERATIONAL_PATTERNS = [
  'could not copy chrome cookie database',
  'could not find chrome cookies database',
  'could not find chromium cookies database',
  'failed to decrypt with dpapi',
  'could not find firefox cookies database',
  'could not find opera cookies database',
  'opera does not support profiles',
  'custom safari cookies database not found',
  'fresh cookies (not necessarily logged in) are needed',
  "sign in to confirm you're not a bot",
  'sign in to confirm you’re not a bot',
  "private video. sign in if you've been granted access",
  'access restricted',
  'unsupported url',
  'this website is no longer supported since it has been determined to be primarily used for piracy',
  'video unavailable',
  'offline.',
  'requested format is not available',
  'no video formats found',
  'http error 403: forbidden',
  'http error 429: too many requests',
  'unable to download video subtitles',
  'http error 404: not found',
  'unable to download video data: [ssl: certificate_verify_failed]',
  'unable to extract encoded url',
  'please report this issue on',
  'cannot parse data',
  'cannot download embed-only video without embedding url',
  'requested range not satisfiable',
  'invalid data found when processing input',
  'unable to rename file',
  "this video has been removed for violating youtube's community guidelines",
  'postprocessing: ffmpeg not found. please install or provide the path using --ffmpeg-location',
  'postprocessing: ffprobe not found. please install or provide the path using --ffmpeg-location',
  'service unavailable. giving up after',
  'winerror 32',
  'winerror 2',
  'winerror 5',
  'winerror 183',
  'read timed out',
  'more expected. giving up after',
  'connect etimedout',
  'connection aborted.',
  'forcibly closed by the remote host',
  'failed to resolve',
  'decryption failed or bad record mac',
  'eof occurred in violation of protocol',
  'sslv3_alert_handshake_failure',
  '--legacy-server-connect',
  'net::err_connection_reset',
  'net::err_timed_out',
  'postprocessing: error opening output files: encoder not found',
  'postprocessing: conversion failed!',
  'supported filetypes for thumbnail embedding are',
  'this format is drm protected',
  'requested site is known to use drm protection',
  'cloudflare anti-bot challenge',
  'got http error 403 when using impersonate target',
  'cookies file must be netscape formatted',
  'does not look like a netscape format cookies file',
  'file name too long',
  'no space left on device',
  'access is denied',
  'cannot create a file when that file already exists',
  'the channel is not currently live',
  'no video could be found in this tweet',
  'could not authenticate you',
  'not made this video available in your country',
  'sign in to confirm your age',
  "this video has been removed for violating youtube's terms of service"
]

const SUBSCRIPTION_OPERATIONAL_PATTERNS = [
  'status code 404',
  'status code 500',
  'status code 502',
  'status code 503',
  'request timed out after 60000ms',
  'request path contains unescaped characters',
  'aggregateerror',
  'attribute without value',
  'non-whitespace before first tag.',
  'unexpected close tag',
  'feed not recognized as rss 1 or 2.',
  'invalid character in entity name',
  'invalid character in tag name',
  'net::err_connection_reset',
  'net::err_timed_out',
  'net::err_name_not_resolved',
  'net::err_proxy_connection_failed',
  'net::err_internet_disconnected',
  'client network socket disconnected before secure tls connection was established',
  'connect etimedout'
]

const AUTO_UPDATER_OPERATIONAL_PATTERNS = [
  'net::err_connection_reset',
  'net::err_connection_closed',
  'net::err_connection_timed_out',
  'net::err_timed_out',
  'net::err_internet_disconnected',
  'net::err_proxy_connection_failed',
  'net::err_connection_refused',
  'net::err_network_io_suspended',
  'net::err_name_not_resolved',
  'net::err_http2_protocol_error',
  'net::err_network_changed',
  'net::err_connection_aborted',
  'net::err_ssl_protocol_error',
  'net::err_address_unreachable',
  'net::err_socket_not_connected',
  'net::err_cert_authority_invalid',
  'net::err_tunnel_connection_failed',
  'net::err_network_access_denied',
  'enoent: no such file or directory, rename'
] as const

const AUTO_UPDATER_REQUEST_PATTERNS = [
  'github.com/nexmoe/vidbee/releases/latest/download/latest',
  'github.com/nexmoe/vidbee/releases/download/',
  'release-assets.githubusercontent.com/github-production-release-asset/'
] as const

// Sentry issues VIDBEE-1G / VIDBEE-68 / VIDBEE-FA / VIDBEE-S5 /
// VIDBEE-1QB / VIDBEE-1QE / VIDBEE-1SE / VIDBEE-VK showed the desktop app was
// forwarding yt-dlp environment and user-input failures that do not represent
// actionable VidBee defects.

// Sentry issues VIDBEE-28K / VIDBEE-28I / VIDBEE-E / VIDBEE-DE / VIDBEE-11
// showed extractor access denials and missing subtitles are usually remote
// site-policy failures, not regressions in the desktop app download flow.

// Sentry issues VIDBEE-2CC / VIDBEE-2CB / VIDBEE-EB / VIDBEE-JN showed more
// yt-dlp operational noise still escaping from the wrapped stderr payload:
// upstream parser-report prompts, Opera cookie lookup failures, transient TLS
// record corruption, and remote-host resets should not create product bugs.

// Sentry issues VIDBEE-1FR / VIDBEE-2FO / VIDBEE-2FL / VIDBEE-2F5 /
// VIDBEE-2F3 / VIDBEE-2F2 / VIDBEE-2F1 showed more remote access-policy and
// transport failures: extractor access restrictions, short-read retry
// exhaustion, private-video auth requirements, rate limits, and temporary
// offline states should be treated as operational download noise.

// Sentry issues VIDBEE-2A / VIDBEE-2C4 / VIDBEE-2BE / VIDBEE-2FD /
// VIDBEE-10G / VIDBEE-2FA showed more non-actionable download conditions:
// piracy-blocked sites, remote TLS certificate or cipher failures, embed-only
// URLs that need the original page, missing ffmpeg tooling, and file lock
// rename collisions should not be tracked as desktop defects.

// Sentry issues VIDBEE-31 / VIDBEE-1LV / VIDBEE-1N2 / VIDBEE-1N7 /
// VIDBEE-1N6 / VIDBEE-1N4 / VIDBEE-1N3 are upstream RSS transport failures and
// should be treated the same way as the existing subscription 4xx noise.

// Sentry issues VIDBEE-28B / VIDBEE-25A / VIDBEE-23B still surface generic
// provider-side 500 responses that should be handled like the existing 502/503
// subscription outages.

interface TelemetryContextShape {
  tags?: Record<string, boolean | number | string | undefined>
}

interface TelemetryEventExceptionValue {
  type?: string
  value?: string
}

interface TelemetryEventShape {
  entries?: Array<{
    data?: {
      values?: Array<{
        category?: string
        data?: Record<string, unknown>
      }>
    }
    type?: string
  }>
  exception?: {
    values?: TelemetryEventExceptionValue[]
  }
  message?: string
  tags?: Record<string, unknown>
}

/**
 * Normalize telemetry text so pattern matching is stable across platforms.
 *
 * @param value The raw telemetry text.
 * @returns The normalized lowercase text.
 */
const normalizeTelemetryText = (value: string | undefined | null): string => {
  return value?.trim().toLowerCase() ?? ''
}

/**
 * Read the telemetry source tag from Sentry scope or event tags.
 *
 * @param tags The telemetry tags bag.
 * @returns The normalized source tag.
 */
const readSourceTag = (tags: Record<string, unknown> | undefined): string => {
  const source = tags?.source
  return typeof source === 'string' ? normalizeTelemetryText(source) : ''
}

/**
 * Check whether any normalized message contains one of the known patterns.
 *
 * @param messages The normalized telemetry messages.
 * @param patterns The operational error patterns to match.
 * @returns True when a known pattern is present.
 */
const matchesAnyPattern = (messages: string[], patterns: readonly string[]): boolean => {
  return patterns.some((pattern) => messages.some((message) => message.includes(pattern)))
}

/**
 * Collect breadcrumb entries from a finalized telemetry event.
 *
 * @param event The telemetry event candidate.
 * @returns The flattened breadcrumb values.
 */
const collectBreadcrumbs = (
  event: TelemetryEventShape
): Array<{ category?: string; data?: Record<string, unknown> }> => {
  return (
    event.entries
      ?.filter((entry) => entry.type === 'breadcrumbs')
      .flatMap((entry) => entry.data?.values ?? []) ?? []
  )
}

/**
 * Check whether an event includes a known auto-updater request breadcrumb.
 *
 * @param event The telemetry event candidate.
 * @returns True when the event came from the updater request path.
 */
const hasAutoUpdaterRequestBreadcrumb = (event: TelemetryEventShape): boolean => {
  return collectBreadcrumbs(event).some((breadcrumb) => {
    if (breadcrumb.category !== 'electron.net') {
      return false
    }

    const url = breadcrumb.data?.url
    if (typeof url !== 'string') {
      return false
    }

    const normalizedUrl = normalizeTelemetryText(url)
    return AUTO_UPDATER_REQUEST_PATTERNS.some((pattern) => normalizedUrl.includes(pattern))
  })
}

/**
 * Build a list of normalized messages from an error object and optional plain message.
 *
 * @param error The error candidate captured by telemetry.
 * @param fallbackMessage An additional plain-text message to inspect.
 * @returns Normalized non-empty message fragments.
 */
const collectErrorMessages = (error: unknown, fallbackMessage?: string): string[] => {
  const messages = new Set<string>()

  if (typeof fallbackMessage === 'string') {
    const normalizedFallback = normalizeTelemetryText(fallbackMessage)
    if (normalizedFallback) {
      messages.add(normalizedFallback)
    }
  }

  if (error instanceof Error) {
    const normalizedName = normalizeTelemetryText(error.name)
    const normalizedMessage = normalizeTelemetryText(error.message)
    const normalizedStack = normalizeTelemetryText(error.stack)

    if (normalizedName) {
      messages.add(normalizedName)
    }
    if (normalizedMessage) {
      messages.add(normalizedMessage)
    }
    if (normalizedStack) {
      messages.add(normalizedStack)
    }
  } else if (typeof error === 'string') {
    const normalizedError = normalizeTelemetryText(error)
    if (normalizedError) {
      messages.add(normalizedError)
    }
  }

  return [...messages]
}

/**
 * Build a list of normalized messages from a telemetry event payload.
 *
 * @param event The telemetry event candidate.
 * @returns Normalized non-empty event message fragments.
 */
const collectEventMessages = (event: TelemetryEventShape): string[] => {
  const messages = new Set<string>()
  const normalizedMessage = normalizeTelemetryText(event.message)

  if (normalizedMessage) {
    messages.add(normalizedMessage)
  }

  for (const value of event.exception?.values ?? []) {
    const normalizedType = normalizeTelemetryText(value.type)
    const normalizedValue = normalizeTelemetryText(value.value)

    if (normalizedType) {
      messages.add(normalizedType)
    }
    if (normalizedValue) {
      messages.add(normalizedValue)
    }
    if (normalizedType && normalizedValue) {
      messages.add(`${normalizedType}: ${normalizedValue}`)
    }
  }

  return [...messages]
}

/**
 * Determine whether a telemetry payload is an expected operational issue.
 *
 * @param messages The normalized telemetry message fragments.
 * @param source The normalized telemetry source tag.
 * @returns True when the payload should be dropped from Sentry issue reporting.
 */
const isOperationalTelemetry = (messages: string[], source: string): boolean => {
  if (matchesAnyPattern(messages, GLOBAL_OPERATIONAL_PATTERNS)) {
    return true
  }

  if (source.startsWith('download') || source === 'one-click-download') {
    return matchesAnyPattern(messages, DOWNLOAD_OPERATIONAL_PATTERNS)
  }

  if (source.startsWith('subscription')) {
    return matchesAnyPattern(messages, SUBSCRIPTION_OPERATIONAL_PATTERNS)
  }

  if (source.startsWith('auto-updater')) {
    return matchesAnyPattern(messages, AUTO_UPDATER_OPERATIONAL_PATTERNS)
  }

  return false
}

/**
 * Decide whether an exception should be skipped before sending it to Sentry.
 *
 * @param error The captured error candidate.
 * @param context The telemetry context carrying tags.
 * @param message The optional plain-text message being captured.
 * @returns True when the issue is expected and should not create a Sentry issue.
 */
export const shouldSkipTelemetryError = (
  error: unknown,
  context?: TelemetryContextShape,
  message?: string
): boolean => {
  const source = readSourceTag(context?.tags)
  const messages = collectErrorMessages(error, message)
  return isOperationalTelemetry(messages, source)
}

/**
 * Decide whether a finalized Sentry event should be dropped before transport.
 *
 * @param event The Sentry event payload.
 * @returns True when the event is expected operational noise.
 */
export const shouldDropTelemetryEvent = (event: TelemetryEventShape): boolean => {
  const source = readSourceTag(event.tags)
  const messages = collectEventMessages(event)
  if (isOperationalTelemetry(messages, source)) {
    return true
  }

  // Sentry issues VIDBEE-7 and VIDBEE-9 showed ElectronNet can auto-capture
  // updater transport errors before our explicit `source` tag is attached.
  return (
    matchesAnyPattern(messages, AUTO_UPDATER_OPERATIONAL_PATTERNS) &&
    hasAutoUpdaterRequestBreadcrumb(event)
  )
}
