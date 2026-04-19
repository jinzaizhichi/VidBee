interface DownloadErrorGuidanceRule {
  message: string
  patterns: string[]
}

const DOWNLOAD_ERROR_GUIDANCE_RULES: DownloadErrorGuidanceRule[] = [
  {
    // GitHub issues #273 and #334 show users often need a direct next step
    // instead of the raw yt-dlp stderr for cookie-gated downloads.
    message:
      'This download needs signed-in cookies. Add browser cookies in Settings, or export a Netscape cookies file and select it there.',
    patterns: [
      'secretstorage not available',
      'sign in to confirm your age',
      "sign in to confirm you're not a bot",
      'sign in to confirm you’re not a bot'
    ]
  },
  {
    // GitHub issues #107, #210, #349, and #353 are all the same Windows
    // browser-cookie failure class and need the same recovery guidance.
    message:
      'VidBee could not read browser cookies on this machine. Close the browser first, or switch to Firefox cookies or an exported Netscape cookies file.',
    patterns: [
      'could not copy chrome cookie database',
      'could not find chrome cookies database',
      'could not find chromium cookies database',
      'failed to decrypt with dpapi'
    ]
  },
  {
    // GitHub issue #348 showed users can pick a cookies file that yt-dlp
    // cannot decode, so the UI should point them back to a valid export.
    message:
      'The selected cookies file is not a valid UTF-8 Netscape cookies export. Re-export the cookies file, then choose the new file in Settings.',
    patterns: [
      "utf-8' codec can't decode byte",
      'cookies file must be netscape formatted',
      'does not look like a netscape format cookies file'
    ]
  },
  {
    // GitHub issue #294 is usually a stale extractor/format selection mismatch.
    message:
      'This source no longer exposes the requested format. Refresh the video info and choose another available format.',
    patterns: ['requested format is not available']
  },
  {
    // GitHub issues #129 and #347 are the same post-processing failure class.
    message:
      'Post-processing failed for this download. Retry with metadata and thumbnail embedding turned off, or choose a different format/container.',
    patterns: ['invalid data found when processing input']
  },
  {
    // GitHub issue #352 is DRM protected and should be explained directly.
    message:
      'This source is DRM protected, so VidBee cannot download it with the current yt-dlp workflow.',
    patterns: ['this video is drm protected', 'requested site is known to use drm protection']
  }
]

/**
 * Normalize a raw download error string for stable pattern matching.
 *
 * @param rawError The raw yt-dlp or app error message.
 * @returns The normalized lowercase error text.
 */
const normalizeDownloadError = (rawError: string | undefined | null): string => {
  return rawError?.trim().toLowerCase() ?? ''
}

/**
 * Convert repeated raw download failures into short user guidance.
 *
 * @param rawError The raw download error captured from yt-dlp or the app.
 * @returns A concise recovery hint when the error matches a known issue class.
 */
export const getDownloadErrorGuidance = (rawError: string | undefined | null): string | null => {
  const normalizedError = normalizeDownloadError(rawError)
  if (!normalizedError) {
    return null
  }

  for (const rule of DOWNLOAD_ERROR_GUIDANCE_RULES) {
    if (rule.patterns.some((pattern) => normalizedError.includes(pattern))) {
      return rule.message
    }
  }

  return null
}
