import { CliError, isCliError } from "@wirecat/cli-core"

// Google errors can contain bearer headers and document content in their request/response objects.
export const googleError = (error: unknown): CliError => {
  if (isCliError(error)) return error
  const value = error as {
    name?: string
    status?: number
    code?: string | number
    response?: { status?: number; data?: { error?: string | { errors?: { reason?: string }[] } } }
  }
  if (value?.name === "AbortError" || value?.code === "ERR_CANCELED")
    return new CliError("cancelled", "Google operation was cancelled")
  const status = value?.status ?? value?.response?.status
  const payload = value?.response?.data?.error
  const reason = typeof payload === "string" ? payload : payload?.errors?.[0]?.reason
  if (reason === "invalid_grant" || reason === "invalid_token")
    return new CliError("authentication_error", "Google sign-in is no longer valid — run drive session start again")
  if (reason === "invalid_client")
    return new CliError("configuration_error", "Google rejected the OAuth application; check its Desktop client setup")
  if (reason === "rateLimitExceeded" || reason === "userRateLimitExceeded")
    return new CliError("rate_limited", "Google rate limit reached; retry the command", {
      retryable: true,
      ...(status ? { status } : {}),
    })
  if (reason === "exportSizeLimitExceeded")
    return new CliError("validation_error", "Google's native export size limit was exceeded")
  if (status === 401)
    return new CliError("authentication_error", "Google sign-in expired — run drive session start again")
  if (status === 403)
    return new CliError("permission_error", "Google denied this read; check access and OAuth permissions", { status })
  if (status === 404)
    return new CliError("not_found", "Google source is unavailable or no longer accessible", { status })
  if (status === 429)
    return new CliError("rate_limited", "Google rate limit reached; retry the command", { retryable: true, status })
  if (status !== undefined) return new CliError("provider_error", `Google request failed (HTTP ${status})`, { status })
  return new CliError("provider_unavailable", "Google request failed; no request or credential details were logged", {
    retryable: true,
  })
}
