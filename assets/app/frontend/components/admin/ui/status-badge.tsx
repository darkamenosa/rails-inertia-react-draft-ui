import { cn } from "@/lib/utils"

type StatusVariant = "success" | "warning" | "neutral" | "info" | "purple"

const variantStyles: Record<StatusVariant, { dot: string; badge: string }> = {
  success: {
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  warning: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  neutral: {
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  info: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  purple: {
    dot: "bg-purple-500",
    badge:
      "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  },
}

const statusVariantMap: Record<string, StatusVariant> = {
  active: "success",
  published: "success",
  fulfilled: "success",
  paid: "success",
  success: "success",
  completed: "success",
  draft: "warning",
  pending: "warning",
  warning: "warning",
  processing: "warning",
  smart: "purple",
  automated: "purple",
  manual: "info",
  info: "info",
  running: "info",
  archived: "neutral",
  unlisted: "neutral",
  inactive: "neutral",
  cancelled: "neutral",
  failed: "neutral",
}

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  showDot?: boolean
  children?: React.ReactNode
}

export function StatusBadge({
  status,
  variant,
  showDot = true,
  children,
}: StatusBadgeProps) {
  const resolvedVariant =
    variant ?? statusVariantMap[status.toLowerCase()] ?? "neutral"
  const styles = variantStyles[resolvedVariant]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.badge
      )}
    >
      {showDot && <span className={cn("size-1.5 rounded-full", styles.dot)} />}
      {children ??
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  )
}
