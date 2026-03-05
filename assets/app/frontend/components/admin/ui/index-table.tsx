import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Pagination {
  page: number
  perPage: number
  total: number
  pages: number
  from: number
  to: number
  hasPrevious: boolean
  hasNext: boolean
}

export type IndexTableSelectionScope = "none" | "page" | "all"

export interface IndexTableColumn<T> {
  id: string
  header: string
  cell: (item: T) => ReactNode
  sortable?: boolean
  className?: string
}

export interface IndexTableSort {
  column: string
  direction: "asc" | "desc"
}

export interface IndexTableBulkAction {
  content: string
  onAction: (ids: (string | number)[], scope: IndexTableSelectionScope) => void
  destructive?: boolean
}

export interface IndexFiltersTab {
  id: string
  label: string
  count?: number
}

// ─── IndexFilters ────────────────────────────────────────────────────────────

interface IndexFiltersProps {
  tabs?: IndexFiltersTab[]
  selectedTab?: string
  onTabChange?: (tabId: string) => void
  queryValue?: string
  onQueryChange?: (value: string) => void
  onQueryClear?: () => void
  queryPlaceholder?: string
  children?: ReactNode
}

export function IndexFilters({
  tabs,
  selectedTab,
  onTabChange,
  queryValue = "",
  onQueryChange,
  onQueryClear,
  queryPlaceholder = "Search...",
  children,
}: IndexFiltersProps) {
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearching) inputRef.current?.focus()
  }, [isSearching])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "f" &&
        !isSearching &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault()
        setIsSearching(true)
      }
      if (e.key === "Escape" && isSearching) {
        setIsSearching(false)
        onQueryClear?.()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isSearching, onQueryClear])

  if (isSearching || queryValue) {
    return (
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Search className="size-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={queryValue}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder={queryPlaceholder}
          className="h-8 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsSearching(false)
            onQueryClear?.()
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="inline-flex h-9 items-center rounded-lg bg-muted p-[3px] text-muted-foreground">
        {tabs?.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={cn(
              "inline-flex items-center rounded-md px-3 py-1 text-sm font-medium transition-all",
              selectedTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setIsSearching(true)}>
          <Search className="size-4" />
        </Button>
        {children}
      </div>
    </div>
  )
}

// ─── IndexTable ──────────────────────────────────────────────────────────────

interface IndexTableProps<T> {
  items: T[]
  columns: IndexTableColumn<T>[]
  itemId: (item: T) => string | number
  sort?: IndexTableSort
  onSort?: (column: string, direction: "asc" | "desc") => void
  bulkActions?: IndexTableBulkAction[]
  pagination?: Pagination
  onPreviousPage?: () => void
  onNextPage?: () => void
  emptyState?: ReactNode
}

export function IndexTable<T>({
  items,
  columns,
  itemId,
  sort,
  onSort,
  bulkActions,
  pagination,
  onPreviousPage,
  onNextPage,
  emptyState,
}: IndexTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set()
  )
  const [selectionScope, setSelectionScope] =
    useState<IndexTableSelectionScope>("none")

  const allPageIds = items.map(itemId)
  const allSelected =
    allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id))
  const someSelected = selectedIds.size > 0

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
      setSelectionScope("none")
    } else {
      setSelectedIds(new Set(allPageIds))
      setSelectionScope("page")
    }
  }

  const toggleOne = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      if (next.size === 0) setSelectionScope("none")
      else setSelectionScope("page")
      return next
    })
  }

  const handleSort = (columnId: string) => {
    if (!onSort) return
    if (sort?.column === columnId) {
      onSort(columnId, sort.direction === "asc" ? "desc" : "asc")
    } else {
      onSort(columnId, "asc")
    }
  }

  if (items.length === 0 && emptyState) {
    return <div className="p-8 text-center">{emptyState}</div>
  }

  return (
    <div>
      {/* Bulk actions bar */}
      {someSelected && bulkActions && (
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
          <span className="text-sm text-muted-foreground">
            {selectedIds.size} selected
          </span>
          {bulkActions.map((action) => (
            <Button
              key={action.content}
              variant={action.destructive ? "destructive" : "outline"}
              size="sm"
              onClick={() =>
                action.onAction(Array.from(selectedIds), selectionScope)
              }
            >
              {action.content}
            </Button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {bulkActions && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                    col.sortable && "cursor-pointer select-none",
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.id)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable &&
                      (sort?.column === col.id ? (
                        sort.direction === "asc" ? (
                          <ArrowUp className="size-3.5" />
                        ) : (
                          <ArrowDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 opacity-40" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const id = itemId(item)
              return (
                <tr
                  key={id}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50",
                    selectedIds.has(id) && "bg-muted/30"
                  )}
                >
                  {bulkActions && (
                    <td className="w-12 px-4 py-3">
                      <Checkbox
                        checked={selectedIds.has(id)}
                        onCheckedChange={() => toggleOne(id)}
                        aria-label={`Select row ${id}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className={cn("px-4 py-3 text-sm", col.className)}
                    >
                      {col.cell(item)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {pagination.from}&ndash;{pagination.to} of {pagination.total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevious}
              onClick={onPreviousPage}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={onNextPage}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
