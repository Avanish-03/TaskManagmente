"use client"

import { useState, useRef } from "react"
import useSWR from "swr"
import { Download, Loader2, Eye } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { ReportPreview } from "@/components/report-preview"
import { DynamicList } from "@/components/dynamic-list"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TaskType, ProfileType } from "@/types"
import { MONTHS } from "@/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ReportPageContent() {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [objectives, setObjectives] = useState("")
  const [summary, setSummary] = useState("")
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""])
  const [toolsTechnologies, setToolsTechnologies] = useState<string[]>([""])
  const [showPreview, setShowPreview] = useState(false)
  const [exporting, setExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const { data: rawTasks } = useSWR<TaskType[]>(
    `/api/tasks?month=${month}&year=${year}`,
    fetcher
  )
  const tasks = Array.isArray(rawTasks) ? rawTasks : []

  const { data: profile } = useSWR<ProfileType>("/api/profile", fetcher)

  const years = Array.from({ length: 5 }, (_, i) => year - 2 + i)

  async function handleExportPDF() {
    if (!previewRef.current) {
      toast.error("Please show the preview first")
      return
    }

    setExporting(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).default

      const element = previewRef.current
      const pages = element.querySelectorAll<HTMLElement>(":scope > div")

      const pdf = new jsPDF("p", "mm", "a4")

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        })

        const imgData = canvas.toDataURL("image/png")
        const pdfWidth = 210
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      }

      pdf.save(
        `ICT_1046_Yadav_Avanish_Ramashankar_${MONTHS[month - 1]}_${year}.pdf`
      )
      toast.success("PDF downloaded successfully")
    } catch (error) {
      console.error("PDF export error:", error)
      toast.error("Failed to generate PDF")
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Monthly Report"
        description="Generate your monthly internship progress report"
      />
      <div className="flex flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-foreground">Report Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex items-end gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Month</Label>
                  <Select
                    value={month.toString()}
                    onValueChange={(v) => setMonth(parseInt(v))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m, i) => (
                        <SelectItem key={m} value={(i + 1).toString()}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-foreground">Year</Label>
                  <Select
                    value={year.toString()}
                    onValueChange={(v) => setYear(parseInt(v))}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Objectives</Label>
                <Textarea
                  placeholder="Describe your objectives for this month..."
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Work & Learning Summary</Label>
                <Textarea
                  placeholder="Summarize your work and learning for this month..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                />
              </div>

              <DynamicList
                label="Learning Outcomes"
                items={learningOutcomes}
                onChange={setLearningOutcomes}
                placeholder="Enter a learning outcome..."
              />

              <DynamicList
                label="Tools & Technologies"
                items={toolsTechnologies}
                onChange={setToolsTechnologies}
                placeholder="Enter a tool or technology..."
              />

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
                <Button onClick={handleExportPDF} disabled={exporting || !showPreview}>
                  {exporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {exporting ? "Generating..." : "Download Monthly Report PDF"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">Report Preview</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              <ReportPreview
                ref={previewRef}
                profile={profile || null}
                tasks={tasks}
                month={month}
                year={year}
                objectives={objectives}
                summary={summary}
                learningOutcomes={learningOutcomes}
                toolsTechnologies={toolsTechnologies}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
