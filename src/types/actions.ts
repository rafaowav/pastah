import { ActionResponse } from "./index"

export type ActionState<T = any> = ActionResponse<T> | null

export interface ActionContext {
  userId: string
  userEmail: string
}

export function isActionResponse<T>(
  response: unknown
): response is ActionResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    ("success" in response || "errors" in response)
  )
}

export function isSuccessResponse<T>(
  response: ActionResponse<T>
): response is { success: true; data: T } {
  return "success" in response && response.success === true
}

export function isErrorWithFields(
  response: ActionResponse
): response is { errors: Record<string, string[]> } {
  return "errors" in response
}
