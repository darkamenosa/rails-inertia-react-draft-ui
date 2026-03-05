import { useState } from "react"
import { Head } from "@inertiajs/react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  IndexFilters,
  IndexTable,
  type IndexTableColumn,
} from "@/components/admin/ui/index-table"
import { StatusBadge } from "@/components/admin/ui/status-badge"
import AdminLayout from "@/layouts/admin-layout"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

interface Props {
  users: User[]
}

const tabs = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
]

const columns: IndexTableColumn<User>[] = [
  {
    id: "name",
    header: "User",
    sortable: true,
    cell: (user) => (
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-muted-foreground">{user.email}</div>
      </div>
    ),
  },
  {
    id: "role",
    header: "Role",
    cell: (user) => <span className="text-sm capitalize">{user.role}</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: (user) => <StatusBadge status={user.status} />,
  },
  {
    id: "created_at",
    header: "Joined",
    sortable: true,
    cell: (user) => user.createdAt,
  },
]

export default function AdminUsersIndex({ users }: Props) {
  const [selectedTab, setSelectedTab] = useState("all")
  const [query, setQuery] = useState("")

  return (
    <AdminLayout>
      <Head title="Users" />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <Button size="sm">
            <Plus className="size-4" />
            Add user
          </Button>
        </div>
        <div className="rounded-lg border border-border bg-card">
          <IndexFilters
            tabs={tabs}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            queryValue={query}
            onQueryChange={setQuery}
            onQueryClear={() => setQuery("")}
            queryPlaceholder="Search users..."
          />
          <IndexTable
            items={users}
            columns={columns}
            itemId={(user) => user.id}
            bulkActions={[
              {
                content: "Delete",
                destructive: true,
                onAction: (ids) => console.warn("Delete", ids),
              },
            ]}
            emptyState={
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No users found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Users will appear here once authentication is set up.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </AdminLayout>
  )
}
