"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Flag, Clock, Plus, Trash2, ArrowRight, BookOpen, Lock, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Timetable } from "@/lib/schema";
import { PlanService } from "@/lib/storage/plan-service";

interface Milestone {
  id: string;
  subject: string;
  title: string;
  examDate: string;
  weight: "High" | "Critical" | "Standard";
}

const STORAGE_KEY_MILESTONES = "bh_calendar_milestones";

function calculateDaysRemaining(targetDateStr: string): number {
  const target = new Date(targetDateStr + "T00:00:00");
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function CalendarPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [activePlan, setActivePlan] = useState<Timetable | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [weight, setWeight] = useState<"High" | "Critical" | "Standard">("High");

  useEffect(() => {
    // 1. Load active plan from storage
    const plan = PlanService.getActivePlan();
    if (plan) {
      setActivePlan(plan);
    }

    // 2. Load stored milestones
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MILESTONES);
      if (stored) {
        setMilestones(JSON.parse(stored));
      }
    } catch {
    } finally {
      setIsLoaded(true);
    }

    // Cloud rehydration from Supabase
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from("exam_milestones")
            .select("*")
            .eq("user_id", user.id)
            .order("exam_date", { ascending: true })
            .then(({ data, error }) => {
              if (data && data.length > 0) {
                const mapped: Milestone[] = data.map((m) => ({
                  id: m.id,
                  subject: m.subject,
                  title: m.title,
                  examDate: m.exam_date,
                  weight: "High",
                }));
                setMilestones(mapped);
                localStorage.setItem(STORAGE_KEY_MILESTONES, JSON.stringify(mapped));
              }
            });
        }
      });
    } catch (e) {
      console.warn("Supabase calendar sync error:", e);
    }
  }, []);

  const saveMilestones = (newMilestones: Milestone[]) => {
    setMilestones(newMilestones);
    try {
      localStorage.setItem(STORAGE_KEY_MILESTONES, JSON.stringify(newMilestones));
    } catch (e) {
      console.error("Failed to save milestones to storage", e);
    }
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const newM: Milestone = {
      id: "m_" + Date.now(),
      subject,
      title,
      examDate,
      weight,
    };
    const updated = [...milestones, newM].sort((a, b) => a.examDate.localeCompare(b.examDate));
    saveMilestones(updated);
    setSubject("");
    setTitle("");
    setExamDate("");
    setShowAddModal(false);

    // Save to Supabase
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from("exam_milestones")
            .insert({
              id: newM.id,
              user_id: user.id,
              subject: newM.subject,
              title: newM.title,
              exam_date: newM.examDate,
            })
            .then(({ error }) => {
              if (error) console.warn("Supabase milestone insert error:", error.message);
            });
        }
      });
    } catch (e) {
      console.warn("Failed to persist milestone to Supabase:", e);
    }
  };

  const handleDeleteMilestone = (id: string) => {
    const updated = milestones.filter((m) => m.id !== id);
    saveMilestones(updated);

    // Delete from Supabase
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from("exam_milestones")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id)
            .then();
        }
      });
    } catch (e) {
      console.warn("Failed to delete milestone from Supabase:", e);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-8">
      {/* Route Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-panel-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span>Academic Runway & Calendar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Academic Runway & Calendar
          </h1>
          <p className="text-sm text-muted mt-1">
            Live multi-week countdown runway and 7-day planned study roadmap.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Exam Milestone</span>
          </button>
        </div>
      </div>

      {/* 1. Exam Countdown Runway */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono text-muted uppercase tracking-wider flex items-center space-x-2">
            <Flag className="w-3.5 h-3.5 text-accent" />
            <span>Upcoming Exam Deadlines ({milestones.length})</span>
          </h2>
        </div>

        {isLoaded && milestones.length === 0 ? (
          <div className="p-8 rounded-2xl bg-panel border border-panel-border text-center max-w-xl mx-auto">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-3">
              <CalendarDays className="w-5 h-5 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">No Exam Deadlines Recorded</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mb-4 leading-relaxed">
              Add your exam dates or generate a study plan in the Overview tab to calculate your real-time countdown runway.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exam Milestone</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map((m) => {
              const daysLeft = calculateDaysRemaining(m.examDate);
              const isUrgent = daysLeft <= 7;

              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-panel border border-panel-border flex items-center justify-between gap-3 transition-all hover:border-accent/50"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        m.weight === "Critical"
                          ? "bg-status-missed/10 text-status-missed border border-status-missed/20"
                          : "bg-accent/10 text-accent border border-accent/20"
                      }`}
                    >
                      <Flag className="w-4 h-4" strokeWidth={1.75} />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono text-muted uppercase">
                          {m.subject}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-panel-solid border border-panel-border text-muted uppercase">
                          {m.weight}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground font-sans line-clamp-1">
                        {m.title}
                      </h4>
                      <div className="text-[11px] font-mono text-muted flex items-center space-x-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{m.examDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <div
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold tracking-tight border ${
                        isUrgent
                          ? "bg-status-missed/15 text-status-missed border-status-missed/30"
                          : "bg-accent/15 text-accent border-accent/30"
                      }`}
                    >
                      {daysLeft > 0 ? `${daysLeft}D RUNWAY` : "DUE / PASSED"}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-status-missed transition-colors"
                      title="Remove Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Planned 7-Day Academic Study Roadmap */}
      <div className="space-y-4 pt-4 border-t border-panel-border/60">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xs font-mono text-muted uppercase tracking-wider flex items-center space-x-2">
              <CalendarDays className="w-3.5 h-3.5 text-accent" />
              <span>7-Day Planned Study Roadmap</span>
            </h2>
            <p className="text-xs text-muted">
              Synchronized timetable schedule with institutional locks and focused study sessions.
            </p>
          </div>

          {activePlan && (
            <Link
              href="/dashboard/overview"
              className="text-xs font-mono text-accent hover:underline flex items-center space-x-1"
            >
              <span>Manage in Overview</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {!activePlan ? (
          <div className="p-8 rounded-2xl bg-panel border border-panel-border text-center max-w-xl mx-auto">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-accent" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">No Planned Roadmap Yet</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mb-4 leading-relaxed">
              Generate an adaptive timetable in Overview to automatically populate your 7-day calendar roadmap here.
            </p>
            <Link
              href="/dashboard/overview"
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Study Plan</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activePlan.schedule.map((day) => {
              const isExamDay = milestones.some((m) => m.examDate === day.date);
              const matchingMilestone = milestones.find((m) => m.examDate === day.date);

              return (
                <div
                  key={day.date}
                  className={`p-4 rounded-2xl bg-panel border transition-all ${
                    isExamDay
                      ? "border-status-missed/40 bg-status-missed/[0.03]"
                      : "border-panel-border hover:border-accent/40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-panel-border/60 gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-accent uppercase px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                        {day.day_of_week}
                      </span>
                      <span className="font-mono text-xs text-foreground font-semibold">
                        {day.date}
                      </span>
                      {isExamDay && (
                        <span className="px-2 py-0.5 rounded-md bg-status-missed/15 text-status-missed border border-status-missed/30 text-[10px] font-mono font-semibold flex items-center space-x-1">
                          <Flag className="w-3 h-3" />
                          <span>EXAM DAY: {matchingMilestone?.subject}</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-muted">
                      {day.blocks.filter((b) => b.type === "study").length} Study Sessions ·{" "}
                      {day.blocks.some((b) => b.is_locked) ? "College Scheduled" : "Independent Day"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {day.blocks.map((b) => (
                      <div
                        key={b.id}
                        className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                          b.is_locked
                            ? "bg-panel-solid/50 border-panel-border text-muted/90"
                            : b.type === "buffer"
                            ? "bg-accent/[0.04] border-accent/20 text-accent"
                            : "bg-canvas/50 border-panel-border text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-muted">
                          <span className="flex items-center space-x-1">
                            {b.is_locked ? (
                              <Lock className="w-2.5 h-2.5 text-muted" />
                            ) : (
                              <BookOpen className="w-2.5 h-2.5 text-accent" />
                            )}
                            <span className="uppercase">{b.start_time} - {b.end_time}</span>
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded uppercase text-[9px] font-semibold ${
                              b.is_locked
                                ? "bg-panel border border-panel-border text-muted"
                                : b.type === "buffer"
                                ? "bg-accent/15 text-accent"
                                : "bg-status-done/15 text-status-done"
                            }`}
                          >
                            {b.type}
                          </span>
                        </div>

                        <p className="font-sans font-medium text-xs text-foreground line-clamp-1">
                          {b.title}
                        </p>

                        {b.subject && (
                          <p className="text-[10px] text-muted line-clamp-1 font-mono">
                            {b.subject}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl frosted-modal text-foreground shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-panel-border/60 mb-4">
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground tracking-tight">Add Exam Milestone</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                  SUBJECT
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                  MILESTONE TITLE
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Examination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                    EXAM DATE
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 mb-1 font-mono">
                    PRIORITY WEIGHT
                  </label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#140f22] dark:bg-[#140f22] border border-panel-border text-xs text-foreground font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  >
                    <option value="Standard">Standard</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-panel-solid border border-panel-border text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors shadow-md"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
