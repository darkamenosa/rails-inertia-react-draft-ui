import { useEffect, useRef } from "react"
import { router, usePage } from "@inertiajs/react"
import type { FlashData, SharedProps } from "@/types"
import { toast } from "sonner"

function showFlashToasts(flash: FlashData | undefined) {
  if (!flash) return

  if (flash.alert) toast(flash.alert)
  if (flash.notice) toast(flash.notice)
  if (flash.success) toast(flash.success)
  if (flash.warning) toast(flash.warning)
  if (flash.info) toast(flash.info)
}

function flashKey(flash: FlashData | undefined, url?: string) {
  if (!flash) return ""
  return [
    url ?? "",
    flash.alert ?? "",
    flash.notice ?? "",
    flash.success ?? "",
    flash.warning ?? "",
    flash.info ?? "",
  ].join("|")
}

export function useFlash() {
  const { props, url, component } = usePage<SharedProps>()
  const hasShownInitialFlash = useRef(false)
  const lastFlashRef = useRef<{ key: string; at: number } | null>(null)

  const showFlashOnce = (flash: FlashData | undefined, pageUrl?: string) => {
    if (!flash) return
    const key = flashKey(flash, pageUrl)
    if (!key) return

    const now = Date.now()
    const last = lastFlashRef.current
    if (last && last.key === key && now - last.at < 1000) return

    lastFlashRef.current = { key, at: now }
    showFlashToasts(flash)
  }

  // Show flash on initial page load (only once)
  useEffect(() => {
    if (hasShownInitialFlash.current) return
    hasShownInitialFlash.current = true

    showFlashOnce(props.flash, url)
  }, [props.flash, url, component])

  // Listen for Inertia navigation success
  useEffect(() => {
    const removeListener = router.on("success", (event) => {
      const page = event.detail.page
      showFlashOnce(page.props.flash as FlashData | undefined, page.url)
    })

    return () => removeListener()
  }, [])
}
