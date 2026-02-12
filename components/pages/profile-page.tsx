"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { User, Building2, Briefcase, FolderOpen, Save, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ProfileType } from "@/types"

export default function ProfilePageContent() {
  const [profile, setProfile] = useState<ProfileType>({
    studentName: "",
    companyName: "",
    designation: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile")
      const data = await res.json()
      if (data) {
        setProfile({
          studentName: data.studentName || "",
          companyName: data.companyName || "",
          designation: data.designation || "",
        })
      }
    } catch {
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (
      !profile.studentName ||
      !profile.companyName ||
      !profile.designation 
    ) {
      toast.error("Please fill in all fields")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        toast.success("Profile saved successfully")
      } else {
        toast.error("Failed to save profile")
      }
    } catch {
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    {
      key: "studentName" as const,
      label: "Student Name",
      placeholder: "Enter your full name",
      icon: User,
    },
    {
      key: "companyName" as const,
      label: "Company Name",
      placeholder: "Enter company name",
      icon: Building2,
    },
    {
      key: "designation" as const,
      label: "Designation",
      placeholder: "Enter your designation",
      icon: Briefcase,
    },
    
  ]

  return (
    <>
      <PageHeader
        title="Profile"
        description="Keep your internship profile up to date. These details are used across your reports and dashboards."
      />
      <div className="flex flex-1 justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          {/* Left: Editable profile form */}
          <Card className="border-border/60 bg-card/95 shadow-sm backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <User className="h-5 w-5 text-primary" />
                Internship profile
              </CardTitle>
              <CardDescription>
                Tell us a bit about yourself and your internship so we can
                personalise your task reports and summaries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {fields.slice(0, 2).map((field) => (
                      <div key={field.key} className="flex flex-col gap-1.5">
                        <Label
                          htmlFor={field.key}
                          className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                        >
                          <field.icon className="h-4 w-4 text-muted-foreground" />
                          {field.label}
                        </Label>
                        <Input
                          id={field.key}
                          placeholder={field.placeholder}
                          value={profile[field.key]}
                          onChange={(e) =>
                            setProfile({ ...profile, [field.key]: e.target.value })
                          }
                          className="h-9 border-border/70 bg-background text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {fields.slice(2).map((field) => (
                      <div key={field.key} className="flex flex-col gap-1.5">
                        <Label
                          htmlFor={field.key}
                          className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                        >
                          <field.icon className="h-4 w-4 text-muted-foreground" />
                          {field.label}
                        </Label>
                        <Input
                          id={field.key}
                          placeholder={field.placeholder}
                          value={profile[field.key]}
                          onChange={(e) =>
                            setProfile({ ...profile, [field.key]: e.target.value })
                          }
                          className="h-9 border-border/70 bg-background text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">
                      How this information is used
                    </p>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>Your name and company appear on generated PDF reports.</li>
                      <li>
                        Designation and project title are used in headers and
                        dashboards.
                      </li>
                      <li>You can update these details at any time.</li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Make sure everything is accurate before saving. Changes are
                      applied immediately.
                    </p>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full sm:w-auto"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Compact overview / business card */}
          <Card className="border-border/60 bg-gradient-to-b from-background to-muted/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">
                Profile snapshot
              </CardTitle>
              <CardDescription className="text-xs">
                A quick overview of how your details will appear in reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-background/80 p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {profile.studentName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("") || "IN"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {profile.studentName || "Your name"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {profile.designation || "Intern / Trainee"}
                    {profile.companyName ? ` · ${profile.companyName}` : ""}
                  </span>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3 text-xs">
                <div className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Company</p>
                    <p className="text-muted-foreground">
                      {profile.companyName || "Not specified yet"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Designation</p>
                    <p className="text-muted-foreground">
                      {profile.designation || "Not specified yet"}
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-2">
                  <FolderOpen className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Project</p>
                    <p className="text-muted-foreground">
                      {profile.projectTitle || "Not specified yet"}
                    </p>
                  </div>
                </div> */}
              </div>

              <div className="rounded-lg border border-dashed border-border/50 bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
                Tip: keep your profile aligned with your official internship
                documents (offer letter, project brief, etc.) so your reports look
                professional when you share them with your mentor or college.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
