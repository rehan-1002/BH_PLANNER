"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Flag, Clock, Plus, Trash2, ArrowRight } from "lucide-react";

interface Milestone {
  id: string;
  subject: string;
  title: string;
  examDate: string; // YYYY-MM-DD
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [weight, setWeight] = useState<"High" | "Critical" | "Standard">("High");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MILESTONES);
      if (stored) {
        setMilestones(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
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
  };

  const handleDeleteMilestone = (id: string) => {
    const updated = milestones.filter((m) => m.id !== id);
    saveMilestones(updated);
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-6">
      {/* Route Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-panel-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span>Exam Milestones & Runway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Academic Runway & Calendar
          </h1>
          <p className="text-sm text-muted mt-1">
            Multi-week countdown runway derived from stored exam dates.
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

      {/* Runway Timeline Surface or Clean Empty State */}
      {isLoaded && milestones.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 rounded-2xl bg-panel border border-panel-border text-center max-w-xl mx-auto my-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
            <CalendarDays className="w-6 h-6 text-accent" strokeWidth={1.5} />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-1.5">No Milestones Scheduled</h2>
          <p className="text-xs text-muted max-w-sm mb-5 leading-relaxed">
            Add your exam dates and assignment deadlines to compute a real-time countdown runway.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Exam Milestone</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((m) => {
            const daysLeft = calculateDaysRemaining(m.examDate);
            const isUrgent = daysLeft <= 14;

            return (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-panel border border-panel-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-accent/50"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      m.weight === "Critical"
                        ? "bg-status-missed/10 text-status-missed border border-status-missed/20"
                        : "bg-accent/10 text-accent border border-accent/20"
                    }`}
                  >
                    <Flag className="w-5 h-5" strokeWidth={1.5} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-muted uppercase">
                        {m.subject}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-panel-solid border border-panel-border text-muted uppercase">
                        {m.weight} Weight
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground font-sans">
                      {m.title}
                    </h3>
                    <div className="text-xs font-mono text-muted flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Target Date: {m.examDate}</span>
                    </div>
                  </div>
                </div>

                {/* Countdown Badge & Delete */}
                <div className="flex items-center space-x-4 sm:self-center self-end">
                  <div
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide border ${
                      isUrgent
                        ? "bg-status-missed/15 text-status-missed border-status-missed/30"
                        : "bg-accent/15 text-accent border-accent/30"
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} DAYS RUNWAY` : "DUE TODAY / PASSED"}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="p-2 rounded-lg text-muted hover:text-status-missed transition-colors"
                    title="Remove Milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-panel border border-panel-border shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-panel-border mb-4">
              <div className="flex items-center space-x-2">
                <CalendarDays className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">Add Exam Milestone</h3>
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
                <label className="block text-xs font-medium text-muted mb-1 font-mono">
                  SUBJECT
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering Mathematics"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas/60 border border-panel-border text-xs text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1 font-mono">
                  MILESTONE TITLE
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Examination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas/60 border border-panel-border text-xs text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1 font-mono">
                    EXAM DATE
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-canvas/60 border border-panel-border text-xs text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1 font-mono">
                    PRIORITY WEIGHT
                  </label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-canvas/60 border border-panel-border text-xs text-foreground font-mono"
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
                  className="px-4 py-2 rounded-lg bg-panel border border-panel-border text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors"
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
