import { DemoError } from '@/demo/backend'
import type { ApiErrorBody } from '@/lib/api/types'

export class ApiError extends Error {
  code: string
  details?: unknown

  constructor(error: ApiErrorBody) {
    super(error.message)
    this.name = 'ApiError'
    this.code = error.code
    this.details = error.details
  }
}

export function setRefreshHandler(handler: () => Promise<string | null>) {
  void handler
}

const DEMO_LATENCY = 140

export async function demoRequest<T>(resolve: () => T | Promise<T>, latency = DEMO_LATENCY): Promise<T> {
  await new Promise(done => setTimeout(done, latency))
  try {
    return await resolve()
  } catch (error) {
    if (error instanceof DemoError) throw new ApiError({ code: error.code, message: error.message })
    throw new ApiError({
      code: 'DEMO_ERROR',
      message: error instanceof Error ? error.message : 'Operacja nie powiodła się',
    })
  }
}
