import { Head } from "@inertiajs/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"

export default function AppSettings() {
  return (
    <AppLayout>
      <Head title="Settings" />
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Settings will be available once authentication is configured.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
