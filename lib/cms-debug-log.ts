/** Debug-mode NDJSON logging for CMS save/read tracing (session bd1b6f). */
export function cmsDebugLog(payload: {
  location: string
  message: string
  hypothesisId: string
  data: Record<string, unknown>
  runId?: string
}): void {
  // #region agent log
  fetch('http://127.0.0.1:7752/ingest/b4ab8bb9-11d8-4e66-8857-e15e424076f3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': 'bd1b6f',
    },
    body: JSON.stringify({
      sessionId: 'bd1b6f',
      location: payload.location,
      message: payload.message,
      data: payload.data,
      hypothesisId: payload.hypothesisId,
      runId: payload.runId ?? 'pre-fix',
      timestamp: Date.now(),
    }),
  }).catch(() => {})
  // #endregion
}
