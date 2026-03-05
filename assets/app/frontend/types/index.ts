// Flash data from Rails flash messages
export type FlashData = {
  notice?: string
  alert?: string
  success?: string
  warning?: string
  info?: string
}

// Current authenticated user (shared via Inertia)
export type CurrentUser = {
  id?: number
  name?: string
  email?: string
  roles?: string[]
}

// Shared props available on every Inertia page
export type SharedProps = {
  flash?: FlashData
  currentUser?: CurrentUser
}

// Pagination data from Pagy (via pagination_props helper)
export type PaginationData = {
  page: number
  perPage: number
  total: number
  pages: number
  from: number
  to: number
  hasPrevious: boolean
  hasNext: boolean
}
