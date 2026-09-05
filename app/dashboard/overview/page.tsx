"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Plus,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Bot,
} from "lucide-react";
import { Timetable, ScheduleBlock } from "@/lib/schema";
import { PlanService, RecoveryLog } from "@/lib/storage/plan-service";
import { SpilloverResult } from "@/lib/scheduler/tier1";

export default function OverviewPage() {
  const [activePlan, setActivePlan] = useState<Timetable | null>(null);
  const [todayDate, setTodayDate] = useState<string>("");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [spilloverNotice, setSpilloverNotice] = useState<SpilloverResult | null>(null);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [collegeHours, setCollegeHours] = useState({ start: "09:00", end: "16:30" });
  const [commuteMinutes, setCommuteMinutes] = useState(60);
  const [examSubject, setExamSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [syllabusTopics, setSyllabusTopics] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setTodayDate(today);

    const plan = PlanService.getActivePlan();
    if (plan) {
      setActivePlan(plan);

      const dayIdx = plan.schedule.findIndex((d) => d.date === today);
      if (dayIdx !== -1) {
        setSelectedDayIndex(dayIdx);
      }
    }
  }, []);

  const handleStatusChange = (
    blockId: string,
    newStatus: "pending" | "done" | "partial" | "missed"
  ) => {
    try {
      const { plan, spillover } = PlanService.updateBlockStatus(blockId, newStatus);
      setActivePlan(plan);
      if (spillover) {
        setSpilloverNotice(spillover);
      }
    } catch (err: any) {
      console.error("Failed to update status:", err);
    }
  };

  const handleGenerateNewPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setSpilloverNotice(null);

    const topicsArray = syllabusTopics
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((title, idx) => ({
        id: `top_${idx + 1}`,
        subject: examSubject,
        title,
        weightage: 4,
      }));

    const intakePayload = {
      collegeHours: {
        start_time: collegeHours.start,
        end_time: collegeHours.end,
      },
      commuteMinutes: Number(commuteMinutes),
      examDates: [
        {
          subject: examSubject,
          date: examDate,
        },
      ],
      syllabusTopics: topicsArray,
    };

    try {
      const res = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intakePayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        PlanService.saveActivePlan(data.data);
        setActivePlan(data.data);
        setSelectedDayIndex(0);
        setShowGeneratorModal(false);
      } else {
        alert("Plan generation failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err?.message);
    } finally {
      setGenerating(false);
    }
  };

  const currentDay = activePlan?.schedule[selectedDayIndex];

  return (
    <div className="w-full flex-1 flex flex-col space-y-6">
      {/* Route Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-panel-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span>Daily Command Surface</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Today&apos;s Execution Routine
          </h1>
          <p className="text-sm text-muted mt-1">
            Track daily academic progress and observe deterministic Tier-1 spillover.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowGeneratorModal(true)}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium px-4 py-2 rounded-xl text-xs transition-colors shadow-none flex items-center gap-2 border border-[#8b5cf6]/20 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{activePlan ? "Regenerate Plan" : "Generate Study Plan"}</span>
          </button>
        </div>
      </div>

      {/* Tier-1 Deterministic Spillover Banner */}
      {spilloverNotice && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono transition-all ${
            spilloverNotice.success
              ? "bg-accent/10 border-accent/30 text-foreground"
              : "bg-status-missed/10 border-status-missed/30 text-status-missed"
          }`}
        >
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-accent uppercase block">
                {spilloverNotice.success
                  ? "Tier-1 Deterministic Spillover Executed"
                  : "Tier-1 Buffer Exhausted"}
              </span>
              <span className="text-muted leading-relaxed block mt-0.5">
                {spilloverNotice.reason}
              </span>
            </div>
          </div>
          {spilloverNotice.requiresReTriage && (
            <Link
              href="/dashboard/copilot"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-xs hover:bg-accent-hover shrink-0 font-sans"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Escalate to AI Copilot</span>
            </Link>
          )}
        </div>
      )}

      {/* Empty State vs Active Plan State */}
      {!activePlan ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 rounded-2xl glass-panel text-center max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
            <Plus className="w-5 h-5 text-accent" strokeWidth={1.75} />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">No Active Timetable</h2>
          <p className="text-sm text-muted max-w-md mb-6 leading-relaxed">
            Configure your college hours, commute constraints, syllabus modules, and exam runway to generate an adaptive study schedule.
          </p>
          <button
            type="button"
            onClick={() => setShowGeneratorModal(true)}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium px-4 py-2 rounded-xl text-xs transition-colors shadow-none flex items-center gap-2 border border-[#8b5cf6]/20 active:scale-95"
          >
            <span>Configure Constraints & Generate</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Day Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {activePlan.schedule.map((day, idx) => (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap focus:outline-none ${
                  selectedDayIndex === idx
                    ? "bg-panel-solid border border-accent text-accent font-semibold"
                    : "bg-panel border border-panel-border text-muted hover:text-foreground"
                }`}
              >
                <span>{day.day_of_week.slice(0, 3)}</span>{" "}
                <span className="opacity-70">{day.date.slice(5)}</span>
              </button>
            ))}
          </div>

          {/* Today's Blocks List */}
          <div className="space-y-3">
            {currentDay?.blocks.map((block) => {
              const isLocked = block.is_locked;
              const isRecovered = (block as any).recovered_from_id;

              return (
                <div
                  key={block.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${
                    isLocked
                      ? "bg-panel/40 border-panel-border text-muted"
                      : block.status === "done"
                      ? "bg-status-done/5 border-status-done/30"
                      : block.status === "missed"
                      ? "bg-status-missed/5 border-status-missed/30 opacity-70"
                      : block.status === "partial"
                      ? "bg-status-partial/5 border-status-partial/30"
                      : "bg-panel border-panel-border"
                  }`}
                >
                  {/* Left: Time & Block Details */}
                  <div className="flex items-start space-x-4">
                    <div className="w-28 shrink-0 text-xs font-mono pt-1 text-muted">
                      {block.start_time} – {block.end_time}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                            block.type === "college" || block.type === "commute"
                              ? "bg-status-locked/20 text-muted"
                              : block.type === "buffer"
                              ? "bg-accent/15 text-accent"
                              : "bg-accent/20 text-accent"
                          }`}
                        >
                          {block.type}
                        </span>

                        {isLocked && (
                          <span className="flex items-center space-x-1 text-[10px] font-mono text-status-locked">
                            <Lock className="w-3 h-3" />
                            <span>LOCKED</span>
                          </span>
                        )}

                        {isRecovered && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/20 text-accent font-semibold">
                            TIER-1 RECOVERED
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-medium text-foreground font-sans">{block.title}</h3>
                      {block.subject && (
                        <p className="text-xs text-muted font-sans">{block.subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Interactive Execution Controls */}
                  {!isLocked && (
                    <div className="mt-3 sm:mt-0 flex items-center space-x-2 shrink-0">
                      {/* Done */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(block.id, "done")}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          block.status === "done"
                            ? "bg-status-done text-white"
                            : "bg-panel border border-panel-border text-muted hover:border-status-done hover:text-status-done"
                        }`}
                        title="Mark Completed"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>

                      {/* Partial */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(block.id, "partial")}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          block.status === "partial"
                            ? "bg-status-partial text-white"
                            : "bg-panel border border-panel-border text-muted hover:border-status-partial hover:text-status-partial"
                        }`}
                        title="Mark Partially Completed"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Partial</span>
                      </button>

                      {/* Missed */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(block.id, "missed")}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          block.status === "missed"
                            ? "bg-status-missed text-white"
                            : "bg-panel border border-panel-border text-muted hover:border-status-missed hover:text-status-missed"
                        }`}
                        title="Mark Missed (Triggers Tier-1 Spillover)"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Missed</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Plan Generation / Configuration Modal */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl frosted-modal text-foreground shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-panel-border/60 mb-5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  Academic Constraints & Plan Intake
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGeneratorModal(false)}
                className="text-xs text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateNewPlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                    College Start
                  </label>
                  <input
                    type="time"
                    required
                    value={collegeHours.start}
                    onChange={(e) =>
                      setCollegeHours({ ...collegeHours, start: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                    College End
                  </label>
                  <input
                    type="time"
                    required
                    value={collegeHours.end}
                    onChange={(e) =>
                      setCollegeHours({ ...collegeHours, end: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                  Commute / Reset Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={commuteMinutes}
                  onChange={(e) => setCommuteMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engineering Mathematics"
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                  Syllabus Modules / Topics (one per line)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={"e.g.\nLinear Algebra & Matrices\nDifferential Equations\nMultivariable Calculus"}
                  value={syllabusTopics}
                  onChange={(e) => setSyllabusTopics(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGeneratorModal(false)}
                  className="px-4 py-2 rounded-lg bg-panel-solid border border-panel-border text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-5 py-2.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-md"
                >
                  {generating ? "Generating Plan via AI..." : "Generate Canonical Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
