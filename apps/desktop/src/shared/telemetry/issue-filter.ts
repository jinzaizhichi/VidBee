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
  'opera does not support profiles',
  'could not find opera cookies database',
  'fresh cookies (not necessarily logged in) are needed',
  // Sentry issue VIDBEE-77G showed some extractors emit the same guidance
  // without the "fresh" prefix when cookies are required upstream.
  'cookies (not necessarily logged in) are needed',
  // Sentry issues VIDBEE-4LN through VIDBEE-4N2 showed local socket policy
  // failures bubbling out of yt-dlp as WinError 10013 noise.
  'winerror 10013',
  'an attempt was made to access a socket in a way forbidden by its access permissions',
  'http error 403: forbidden',
  // Sentry issues VIDBEE-4AK / VIDBEE-74R showed generic upstream 502 pages
  // from origin hosts should be treated like other transient 5xx failures.
  'http error 502: bad gateway',
  // Sentry issue VIDBEE-DE showed Cloudflare can block generic extractor
  // requests with an anti-bot challenge that requires upstream impersonation.
  'cloudflare anti-bot challenge',
  "sign in to confirm you're not a bot",
  'sign in to confirm you’re not a bot',
  // Sentry issues VIDBEE-5FL / VIDBEE-5EN / VIDBEE-5EM showed
  // age-restricted videos need cookies, not a desktop code fix.
  'sign in to confirm your age',
  "private video. sign in if you've been granted access",
  'unsupported url',
  'this website is no longer supported since it has been determined to be primarily used for piracy',
  'video unavailable',
  'access restricted',
  'offline.',
  'requested format is not available',
  // Sentry issues VIDBEE-41B / VIDBEE-3IH showed Google Drive can reject
  // downloads for users without source access, which is not a desktop bug.
  'only the owner and editors can download this file',
  'did not get any data blocks',
  'no video formats found',
  'no video could be found in this tweet',
  'the channel is not currently live',
  'http error 404: not found',
  'unable to extract encoded url',
  'please report this issue on',
  'got http error 403 when using impersonate target',
  'unable to download video subtitles',
  'unable to download video data: [ssl: certificate_verify_failed]',
  'cannot parse data',
  'requested range not satisfiable',
  'invalid data found when processing input',
  'decryption failed or bad record mac',
  'connection aborted.',
  'forcibly closed by the remote host',
  'unable to rename file',
  "this video has been removed for violating youtube's community guidelines",
  'file name too long',
  // Sentry issues VIDBEE-3PO / VIDBEE-VK showed local disk exhaustion can
  // abort writes after the download already succeeded remotely.
  'no space left on device',
  // Sentry issues VIDBEE-6AM / VIDBEE-6AL / VIDBEE-6AK showed private videos
  // require source account access and cookies, not a desktop code change.
  "private video. sign in if you've been granted access to this video",
  // Sentry issue VIDBEE-6IP showed members-only uploads need the user's
  // channel access and cookies instead of a desktop-side retry or code fix.
  'members-only content',
  // Sentry issues VIDBEE-6A7 / VIDBEE-6A6 showed local file permission
  // denials can block the final rename on Windows.
  'access is denied',
  'more expected. giving up after',
  'service unavailable. giving up after',
  'private video. sign in if you',
  // Sentry issue VIDBEE-D showed DRM-protected sites that yt-dlp explicitly
  // marks unsupported should not create desktop defects.
  'known to use drm protection',
  'it will not be supported',
  // Sentry issue VIDBEE-6A1 showed scheduled premieres are expected source
  // state until the video actually starts.
  'premieres in ',
  // Sentry issues VIDBEE-5FG / VIDBEE-5FF / VIDBEE-5FC showed
  // geo restrictions and audience restrictions are upstream access limits.
  'available in your country',
  "content isn't available to everyone",
  // Sentry issues VIDBEE-5F4 / VIDBEE-5F2 showed live-room offline states
  // are expected source availability failures.
  'room is currently offline',
  'http error 429: too many requests',
  // Sentry issues VIDBEE-63Q / VIDBEE-63P / VIDBEE-63O / VIDBEE-63J /
  // VIDBEE-63I / VIDBEE-63H showed BiliBili can return 412 anti-bot
  // responses that the desktop app cannot recover from locally.
  'http error 412: precondition failed',
  // Sentry issue VIDBEE-2L3 showed removed upstream pages returning 410.
  'http error 410: gone',
  'removed for violating youtube',
  'offline.',
  // Sentry issue VIDBEE-5ET showed malformed user input can reach yt-dlp as a
  // truncated YouTube id, which should not create a product defect issue.
  'incomplete youtube id',
  'looks truncated',
  'this website is no longer supported since it has been determined to be primarily used for piracy',
  'certificate verify failed',
  'legacy-server-connect',
  'cannot download embed-only video without embedding url',
  'encoder not found',
  'ffmpeg not found. please install or provide the path using --ffmpeg-location',
  'ffprobe not found. please install or provide the path using --ffmpeg-location',
  'does not look like a netscape format cookies file',
  'could not resolve host',
  "'utf-8' codec can't decode byte",
  'failed to extract entry',
  'decompression resulted in return code -1',
  'winerror 32',
  'winerror 2',
  'winerror 5',
  'winerror 183',
  // Sentry issue VIDBEE-1EE showed disconnected or invalid Windows drive
  // roots can make yt-dlp fail before writing any file.
  'unable to create directory [winerror 3]',
  // Sentry issues VIDBEE-63N / VIDBEE-63M showed local proxy settings can
  // point at a dead loopback listener, which is outside the app control path.
  'unable to connect to proxy',
  'winerror 10061',
  'read timed out',
  'more expected. giving up after',
  'connect etimedout',
  // Sentry issues VIDBEE-76V / VIDBEE-76U / VIDBEE-76T / VIDBEE-76S /
  // VIDBEE-76R showed curl can surface upstream resolver, timeout, and TLS
  // handshake failures with wording that does not match the older snippets.
  'resolving timed out after',
  'connection timed out after',
  'tls connect error',
  'tlsv1_alert_protocol_version',
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
  // Sentry issue VIDBEE-1J8 showed Linux browser-cookie extraction can fail
  // when the local keyring dependency is missing, which is an environment
  // setup problem rather than a desktop product defect.
  'secretstorage not available',
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
  // Sentry issues VIDBEE-77A / VIDBEE-779 showed some providers reject stale
  // session state with an upstream "reload page" authorization error.
  'authorization failed. try to reload page.',
  'the channel is not currently live',
  'no video could be found in this tweet',
  'could not authenticate you',
  'not made this video available in your country',
  'sign in to confirm your age',
  "this video has been removed for violating youtube's terms of service"
]

const SUBSCRIPTION_OPERATIONAL_PATTERNS = [
  'status code 500',
  'status code 503',
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
  // Sentry issues VIDBEE-61S / VIDBEE-5VB showed DNS lookup failures can
  // surface from subscription checks as bare Node getaddrinfo errors.
  'getaddrinfo enotfound',
  'net::err_proxy_connection_failed',
  'net::err_internet_disconnected',
  'client network socket disconnected before secure tls connection was established',
  'connect etimedout'
]

const AUTO_UPDATER_OPERATIONAL_PATTERNS = [
  'enoent: no such file or directory, rename',
  // Sentry issue VIDBEE-1S showed GitHub release asset requests can return
  // transient 502 Unicorn pages that are outside the desktop app control path.
  'httperror: 502',
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
  'enoent: no such file or directory, rename',
  // Sentry issue VIDBEE-48 can also surface as a bare Node DNS failure before
  // Electron normalizes it to net::ERR_NAME_NOT_RESOLVED.
  'getaddrinfo enotfound'
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

interface TelemetryEventTag {
  key?: string
  value?: unknown
}

interface TelemetryEventExceptionValue {
  type?: string
  value?: string
  stacktrace?: {
    frames?: TelemetryEventStackFrame[]
  }
}

interface TelemetryEventBreadcrumb {
  category?: string
  data?: Record<string, unknown>
}

interface TelemetryEventStackFrame {
  filename?: string
  function?: string
  module?: string
}

interface TelemetryEventEntry {
  type?: string
  data?: {
    values?: TelemetryEventBreadcrumb[]
  }
}

interface TelemetryEventShape {
  exception?: {
    values?: TelemetryEventExceptionValue[]
  }
  message?: string
  tags?: Record<string, unknown> | TelemetryEventTag[]
  entries?: TelemetryEventEntry[]
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
const readSourceTag = (tags: Record<string, unknown> | TelemetryEventTag[] | undefined): string => {
  if (Array.isArray(tags)) {
    const sourceTag = tags.find((tag) => tag.key === 'source')
    return typeof sourceTag?.value === 'string' ? normalizeTelemetryText(sourceTag.value) : ''
  }

  const source = tags?.source
  return typeof source === 'string' ? normalizeTelemetryText(source) : ''
}

/**
 * Infer the updater source from serialized Electron network breadcrumbs.
 *
 * @param event The telemetry event candidate.
 * @returns The inferred source tag when the breadcrumbs match the updater path.
 */
const inferSourceFromBreadcrumbs = (event: TelemetryEventShape): string => {
  // Sentry issues VIDBEE-9 / VIDBEE-17 / VIDBEE-1H / VIDBEE-1O showed
  // updater transport failures can arrive without the explicit source tag.
  for (const entry of event.entries ?? []) {
    if (entry.type !== 'breadcrumbs') {
      continue
    }

    for (const breadcrumb of entry.data?.values ?? []) {
      if (breadcrumb.category !== 'electron.net') {
        continue
      }

      const url = breadcrumb.data?.url
      if (typeof url !== 'string') {
        continue
      }

      const normalizedUrl = normalizeTelemetryText(url)
      if (
        normalizedUrl.includes('github.com/nexmoe/vidbee/releases/') ||
        normalizedUrl.includes('objects.githubusercontent.com/github-production-release-asset-')
      ) {
        return 'auto-updater'
      }
    }
  }

  return ''
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
 * Check whether serialized event messages mention a known updater request URL.
 *
 * @param messages The normalized telemetry messages.
 * @returns True when the updater release URLs appear in the serialized payload.
 */
const hasAutoUpdaterRequestMessage = (messages: string[]): boolean => {
  return messages.some((message) =>
    AUTO_UPDATER_REQUEST_PATTERNS.some((pattern) => message.includes(pattern))
  )
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
 * Collect normalized stack-frame hints from serialized exception payloads.
 *
 * @param event The telemetry event candidate.
 * @returns Flattened normalized frame filename, function, and module text.
 */
const collectExceptionFrameHints = (event: TelemetryEventShape): string[] => {
  const hints = new Set<string>()

  for (const value of event.exception?.values ?? []) {
    for (const frame of value.stacktrace?.frames ?? []) {
      const normalizedFilename = normalizeTelemetryText(frame.filename)
      const normalizedFunction = normalizeTelemetryText(frame.function)
      const normalizedModule = normalizeTelemetryText(frame.module)

      if (normalizedFilename) {
        hints.add(normalizedFilename)
      }
      if (normalizedFunction) {
        hints.add(normalizedFunction)
      }
      if (normalizedModule) {
        hints.add(normalizedModule)
      }
      if (normalizedFilename && normalizedFunction) {
        hints.add(`${normalizedFilename} ${normalizedFunction}`)
      }
    }
  }

  return [...hints]
}

/**
 * Infer the telemetry source from serialized exception stack frames and messages.
 *
 * @param event The telemetry event candidate.
 * @param messages The normalized event messages.
 * @returns The inferred source tag.
 */
const inferSourceFromExceptionFrames = (event: TelemetryEventShape, messages: string[]): string => {
  const frameHints = collectExceptionFrameHints(event)

  // Sentry issues VIDBEE-23C / VIDBEE-6Q1 / VIDBEE-6QB showed serialized
  // yt-dlp errors can lose the explicit source tag even though the stack still
  // points at YTDlpWrap.createError.
  if (
    frameHints.some(
      (hint) =>
        hint.includes('yt-dlp-wrap-plus/dist/index.js') || hint.includes('ytdlpwrap.createerror')
    )
  ) {
    return 'download-engine'
  }

  // Sentry issues VIDBEE-6M0 / VIDBEE-6M1 / VIDBEE-6M2 / VIDBEE-6LV showed
  // RSS parser outages can also arrive without the serialized source tag.
  if (frameHints.some((hint) => hint.includes('rss-parser/lib/parser.js'))) {
    return 'subscription.check'
  }

  // Sentry issues VIDBEE-13C / VIDBEE-17 / VIDBEE-1H / VIDBEE-1S showed
  // updater transport failures can lose both the source tag and breadcrumb
  // URL, but still retain Electron loader frames or GitHub release URLs.
  if (
    frameHints.some(
      (hint) =>
        hint.includes('node:electron/js2c/browser_init') && hint.includes('simpleurlloaderwrapper')
    ) ||
    hasAutoUpdaterRequestMessage(messages)
  ) {
    return 'auto-updater'
  }

  return ''
}

/**
 * Resolve the best telemetry source from tags, breadcrumbs, or serialized exception hints.
 *
 * @param event The telemetry event candidate.
 * @param messages The normalized event messages.
 * @returns The normalized source tag.
 */
const resolveEventSource = (event: TelemetryEventShape, messages: string[]): string => {
  return (
    readSourceTag(event.tags) ||
    inferSourceFromBreadcrumbs(event) ||
    inferSourceFromExceptionFrames(event, messages)
  )
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
  const messages = collectEventMessages(event)
  const source = resolveEventSource(event, messages)
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
