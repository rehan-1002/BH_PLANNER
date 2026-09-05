"use client";

import { useEffect, useState } from "react";
import { Clock, Lock, Calendar, ShieldCheck, Sparkles, Filter } from "lucide-react";
import { Timetable, ScheduleBlock } from "@/lib/schema";
import { PlanService } from "@/lib/storage/plan-service";

export default function SchedulePage() {
  const [activePlan, setActivePlan] = useState<Timetable | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState<ScheduleBlock | null>(null);

  useEffect(() => {
    const initialPlan = PlanService.getActivePlan();
    if (initialPlan) {
      setActivePlan(initialPlan);
    }
    PlanService.loadActivePlan().then((remotePlan) => {
      if (remotePlan) {
        setActivePlan(remotePlan);
      }
    });
  }, []);

  const currentDay = activePlan?.schedule[selectedDayIndex];

  return (
    <div className="w-full flex-1 flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-panel-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span>Time Constraints & Commitments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Weekly Schedule & Fixed Blocks
          </h1>
          <p className="text-sm text-muted mt-1">
            Institutional commitments (college, commute) remain strictly locked against rescheduling.
          </p>
        </div>
      </div>

      {!activePlan ? (
        <div className="p-12 rounded-2xl bg-panel border border-panel-border text-center max-w-lg mx-auto my-12">
          <Clock className="w-10 h-10 text-muted mx-auto mb-3" strokeWidth={1.5} />
          <h2 className="text-base font-semibold text-foreground mb-1">No Active Timetable</h2>
          <p className="text-xs text-muted mb-4">
            Generate an academic plan in the Overview tab or Dev Console to view full weekly commitments.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {activePlan.schedule.map((day, idx) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => {
                    setSelectedDayIndex(idx);
                    setSelectedBlock(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap focus:outline-none ${
                    selectedDayIndex === idx
                      ? "bg-panel-solid border border-accent text-accent font-semibold"
                      : "bg-panel border border-panel-border text-muted hover:text-foreground"
                  }`}
                >
                  <span>{day.day_of_week}</span>{" "}
                  <span className="opacity-60 text-[10px]">{day.date}</span>
                </button>
              ))}
            </div>

            {/* Time Grid Table */}
            <div className="rounded-2xl bg-panel border border-panel-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-panel-border text-muted bg-panel-solid/40">
                      <th className="py-3 px-4">TIME</th>
                      <th className="py-3 px-4">TYPE</th>
                      <th className="py-3 px-4">TITLE / SUBJECT</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">CONSTRAINT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-panel-border/40 text-foreground">
                    {currentDay?.blocks.map((block) => (
                      <tr
                        key={block.id}
                        onClick={() => setSelectedBlock(block)}
                        className={`cursor-pointer transition-colors ${
                          selectedBlock?.id === block.id
                            ? "bg-accent/10"
                            : "hover:bg-canvas/40"
                        }`}
                      >
                        <td className="py-3 px-4 text-muted whitespace-nowrap">
                          {block.start_time} – {block.end_time}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              block.type === "college" || block.type === "commute"
                                ? "bg-status-locked/20 text-muted"
                                : block.type === "buffer"
                                ? "bg-accent/15 text-accent"
                                : "bg-accent/20 text-accent"
                            }`}
                          >
                            {block.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans">
                          <div className="font-medium text-foreground">{block.title}</div>
                          {block.subject && (
                            <div className="text-[11px] text-muted">{block.subject}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`uppercase text-[10px] font-semibold ${
                              block.status === "done"
                                ? "text-status-done"
                                : block.status === "missed"
                                ? "text-status-missed"
                                : block.status === "partial"
                                ? "text-status-partial"
                                : "text-status-pending"
                            }`}
                          >
                            {block.status || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {block.is_locked ? (
                            <span className="inline-flex items-center space-x-1 text-[10px] text-status-locked">
                              <Lock className="w-3 h-3" />
                              <span>LOCKED</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted">FLEXIBLE</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Block Detail Inspector Sidebar */}
          <div className="rounded-2xl bg-panel border border-panel-border p-6 space-y-4">
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
              Schedule Block Inspector
            </h2>

            {selectedBlock ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-canvas/60 border border-panel-border space-y-1">
                  <span className="text-muted block text-[10px]">TITLE:</span>
                  <span className="font-sans font-medium text-foreground text-sm">
                    {selectedBlock.title}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-canvas/60 border border-panel-border">
                    <span className="text-muted block text-[10px]">TIME WINDOW:</span>
                    <span className="text-foreground font-semibold">
                      {selectedBlock.start_time} – {selectedBlock.end_time}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-canvas/60 border border-panel-border">
                    <span className="text-muted block text-[10px]">TYPE:</span>
                    <span className="text-accent uppercase font-semibold">
                      {selectedBlock.type}
                    </span>
                  </div>
                </div>

                {selectedBlock.subject && (
                  <div className="p-3 rounded-xl bg-canvas/60 border border-panel-border space-y-1">
                    <span className="text-muted block text-[10px]">SUBJECT:</span>
                    <span className="font-sans text-foreground">
                      {selectedBlock.subject}
                    </span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-canvas/60 border border-panel-border space-y-1">
                  <span className="text-muted block text-[10px]">LOCKED COMMITMENT:</span>
                  <span className={selectedBlock.is_locked ? "text-status-locked font-semibold" : "text-status-done"}>
                    {selectedBlock.is_locked
                      ? "YES — Fixed institutional time; exempt from local/AI moving"
                      : "NO — Eligible for Tier-1 local spillover & AI re-triage"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted/60 text-xs font-mono">
                Click on any schedule block in the table to inspect parameters and constraint rules.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
