"use client"

import { forwardRef, useState } from "react"
import { format } from "date-fns"
import type { TaskType, ProfileType } from "@/types"
import { MONTHS } from "@/types"

interface ReportPreviewProps {
  profile: ProfileType | null
  tasks: TaskType[]
  month: number
  year: number
  objectives: string
  summary: string
  learningOutcomes: string[]
  toolsTechnologies: string[]
}

export const ReportPreview = forwardRef<HTMLDivElement, ReportPreviewProps>(

  function ReportPreviewInner(
    {
      profile,
      tasks,
      month,
      year,
      objectives,
      summary,
      learningOutcomes,
      toolsTechnologies,
    },
    ref
  ) {
    const [projectTitle, setProjectTitle] = useState("")

    const monthName = MONTHS[month - 1]

    // 🔥 Split tasks into pages (19 per page)
    const TASKS_PER_PAGE = 18
    const taskPages: TaskType[][] = []

    for (let i = 0; i < tasks.length; i += TASKS_PER_PAGE) {
      taskPages.push(tasks.slice(i, i + TASKS_PER_PAGE))
    }

    return (
      <div ref={ref} className="bg-[#ffffff] text-[#111111]">

        {/* ===================== PAGE 1 ===================== */}
        <div
          className="mx-auto w-[210mm] border border-[#cccccc] p-10"
          style={{ minHeight: "295mm", fontFamily: "Times New Roman, serif" }}
        >
          <div className="mb-8 text-center">
            <h1 className="mb-1 text-xl font-bold uppercase tracking-wide">
              Progress Report & Daily Task Sheet
            </h1>
            <div className="mx-auto my-3 h-0.5 w-48 bg-[#111111]" />
            <h2 className="text-lg font-semibold uppercase">
              Internship Progress Report
            </h2>
          </div>

          <div className="mb-8 flex flex-col gap-3 text-sm">
            {[
              ["Student Name:", profile?.studentName],
              ["Company Name:", profile?.companyName],
              ["Designation:", profile?.designation],
              ["Project Title:", profile?.projectTitle],
              ["Month:", `${monthName} ${year}`],
            ].map(([label, value], i) => (
              <div className="flex" key={i}>
                <span className="w-40 font-semibold">{label}</span>
                <span className="flex-1 border-b border-[#cccccc]">
                  {value || "N/A"}
                </span>
              </div>
            ))}
          </div>

          <Section title="Objectives" content={objectives} />
          <Section title="Work & Learning Summary" content={summary} />

          <ListSection
            title="Tools & Technologies Used"
            items={toolsTechnologies}
          />

          <ListSection
            title="Learning Outcomes"
            items={learningOutcomes}
          />

          <div className="mt-16 flex justify-end">
            <div className="text-center">
              <div className="mb-2 h-px w-48 bg-[#111111]" />
              <p className="text-sm font-semibold">Sign of Organization</p>
            </div>
          </div>
        </div>

        {/* ===================== TASK PAGES ===================== */}
        {taskPages.map((pageTasks, pageIndex) => (
          <div
            key={pageIndex}
            className="mx-auto mt-4 w-[210mm] border border-[#cccccc] p-10"
            style={{ minHeight: "295mm", fontFamily: "Times New Roman, serif" }}
          >
            <div className="mb-6 text-center">
              <h1 className="text-xl font-bold uppercase tracking-wide">
                Daily Task Sheet - {monthName} {year}
              </h1>
              <div className="mx-auto my-3 h-0.5 w-48 bg-[#111111]" />
            </div>

            <table className="w-full border-collapse border border-[#333333] text-sm">
              <thead>
                <tr className="bg-[#f0f0f0]">
                  <th className="border px-3 py-2 text-left">Date</th>
                  {/* <th className="border px-3 py-2 text-left">Time</th> */}
                  <th className="border px-3 py-2 text-left">Task Description</th>
                  <th className="border px-3 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {pageTasks.map((task, i) => (
                  <tr key={task._id || i}>
                    <td className="border px-3 py-2 whitespace-nowrap">
                      {format(new Date(task.date), "dd MMMM yyyy")}
                    </td>
                    {/* <td className="border px-3 py-2 whitespace-nowrap">
                      {task.startTime || "-"} - {task.endTime || "-"}
                    </td> */}
                    <td className="border px-3 py-2">
                      {task.type === "Holiday" ? (
                        <span className="italic text-[#cc0000]">Holiday</span>
                      ) : task.type === "Weekend" ? (
                        <span className="italic text-[#666666]">Weekend</span>
                      ) : (
                        task.description
                      )}
                    </td>
                    <td className="border px-3 py-2">
                      {task.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      </div>
    )
  }
)

function Section({ title, content }: any) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-base font-bold">{title}</h3>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#333333]">
        {content || `No ${title.toLowerCase()} specified.`}
      </p>
    </div>
  )
}

function ListSection({ title, items }: any) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-base font-bold">{title}</h3>
      {items?.filter((i: string) => i.trim()).length ? (
        <ul className="ml-4 list-disc text-sm text-[#333333]">
          {items.filter((i: string) => i.trim()).map((item: string, i: number) => (
            <li key={i} className="mb-1">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#999999]">None specified.</p>
      )}
    </div>
  )
}
