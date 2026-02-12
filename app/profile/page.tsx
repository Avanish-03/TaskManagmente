"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

const ProfilePageContent = dynamic(
  () => import("@/components/pages/profile-page"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)

export default function ProfilePage() {
  return <ProfilePageContent />
}
