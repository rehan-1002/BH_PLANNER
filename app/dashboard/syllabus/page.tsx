"use client";

import { useState } from "react";
import { BookOpen, Plus, CheckCircle2, Circle, Star, Upload, FileText, Trash2 } from "lucide-react";

interface SyllabusTopicItem {
  id: string;
  subject: string;
  module: string;
  title: string;
  weightage: number; // 1-5
  completed: boolean;
}

const defaultTopics: SyllabusTopicItem[] = [
  {
    id: "top_01",
    subject: "Engineering Mathematics",
    module: "Module 1",
    title: "Matrices & Eigenvalues",
    weightage: 5,
    completed: true,
  },
  {
    id: "top_02",
    subject: "Engineering Mathematics",
    module: "Module 1",
    title: "Diagonalization & Quadratic Forms",
    weightage: 4,
    completed: false,
  },
  {
    id: "top_03",
    subject: "Engineering Mathematics",
    module: "Module 2",
    title: "First & Second Order Differential Equations",
    weightage: 5,
    completed: false,
  },
  {
    id: "top_04",
    subject: "Engineering Mathematics",
    module: "Module 2",
    title: "Laplace Transforms & Applications",
    weightage: 3,
    completed: false,
  },
];

export default function SyllabusPage() {
  const [topics, setTopics] = useState<SyllabusTopicItem[]>(defaultTopics);
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [subjectInput, setSubjectInput] = useState("Computer Systems & Networks");

  const toggleTopicCompleted = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const handleParseSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = pastedText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const parsed: SyllabusTopicItem[] = lines.map((line, idx) => {
      // Auto-extract module if line starts with Module
      let module = "Core Curriculum";
      let title = line;
      if (line.toLowerCase().startsWith("module") || line.toLowerCase().startsWith("unit")) {
        const parts = line.split(":");
        if (parts.length > 1) {
          module = parts[0].trim();
          title = parts.slice(1).join(":").trim();
        }
      }

      return {
        id: "top_parsed_" + Date.now() + "_" + idx,
        subject: subjectInput,
        module,
        title,
        weightage: 3 + (idx % 3), // baseline derived weight
        completed: false,
      };
    });

    setTopics((prev) => [...prev, ...parsed]);
    setPastedText("");
    setShowIngestModal(false);
  };

  const totalTopics = topics.length;
  const completedCount = topics.filter((t) => t.completed).length;
  const completionPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="w-full flex-1 flex flex-col space-y-6">
      {/* Route Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-panel-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span>Academic Curricula & Weightage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Syllabus Ingestion & Topic Structure
          </h1>
          <p className="text-sm text-muted mt-1">
            Structure curriculum modules, track topic completion, and assign weight priority.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowIngestModal(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Ingest Syllabus Text</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-panel border border-panel-border">
          <span className="text-xs text-muted font-mono block mb-1">TOTAL CURRICULUM TOPICS</span>
          <span className="text-2xl font-bold text-foreground font-mono">{totalTopics}</span>
        </div>
        <div className="p-4 rounded-xl bg-panel border border-panel-border">
          <span className="text-xs text-muted font-mono block mb-1">COMPLETED TOPICS</span>
          <span className="text-2xl font-bold text-status-done font-mono">{completedCount}</span>
        </div>
        <div className="p-4 rounded-xl bg-panel border border-panel-border">
          <span className="text-xs text-muted font-mono block mb-1">SYLLABUS PROGRESS</span>
          <div className="flex items-center space-x-3 mt-1">
            <div className="flex-1 h-2 rounded-full bg-canvas border border-panel-border overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-accent font-semibold">{completionPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Topics List Table */}
      <div className="rounded-2xl bg-panel border border-panel-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-panel-border text-muted bg-panel-solid/40">
                <th className="py-3 px-4 w-12 text-center">DONE</th>
                <th className="py-3 px-4">MODULE / SUBJECT</th>
                <th className="py-3 px-4">TOPIC TITLE</th>
                <th className="py-3 px-4">WEIGHTAGE</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-panel-border/40 text-foreground">
              {topics.map((t) => (
                <tr
                  key={t.id}
                  className={`transition-colors ${
                    t.completed ? "bg-status-done/5 opacity-80" : "hover:bg-canvas/30"
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleTopicCompleted(t.id)}
                      className="focus:outline-none"
                    >
                      {t.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-status-done" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted hover:text-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-panel-solid border border-panel-border text-muted">
                      {t.module}
                    </span>
                    <div className="text-[11px] text-muted mt-0.5 font-sans">{t.subject}</div>
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-foreground">
                    <span className={t.completed ? "line-through text-muted" : ""}>{t.title}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 text-accent">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <Star
                          key={lvl}
                          className={`w-3 h-3 ${
                            lvl <= t.weightage ? "fill-accent text-accent" : "text-muted/30"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] font-mono ml-1.5 text-muted">
                        Level {t.weightage}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteTopic(t.id)}
                      className="p-1 rounded text-muted hover:text-status-missed focus:outline-none"
                      title="Remove Topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingestion Modal */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-panel border border-panel-border shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-panel-border mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">Ingest Syllabus Text</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIngestModal(false)}
                className="text-xs text-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleParseSyllabus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1 font-mono">
                  SUBJECT NAME
                </label>
                <input
                  type="text"
                  required
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas/60 border border-panel-border text-xs text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1 font-mono">
                  CURRICULUM TEXT / MODULES (one topic per line)
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder={`Module 1: Network Layer Protocols\nModule 1: IP Addressing and Subnetting\nModule 2: Transport Layer & TCP Congestion`}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-3 rounded-lg bg-canvas/60 border border-panel-border text-xs text-foreground font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  className="px-4 py-2 rounded-lg bg-panel border border-panel-border text-xs text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent-hover transition-colors"
                >
                  Parse & Ingest Topics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
