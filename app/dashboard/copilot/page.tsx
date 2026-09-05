"use client";

import { useState, useEffect } from "react";
import { Bot, Send, Sparkles, Check, X, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";
import { Timetable } from "@/lib/schema";
import { PlanService } from "@/lib/storage/plan-service";

interface Message {
  sender: "user" | "copilot";
  text: string;
  proposedPlan?: Timetable;
  applied?: boolean;
}

export default function CopilotPage() {
  const [activePlan, setActivePlan] = useState<Timetable | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "copilot",
      text: "Hello! I am your BH Planner Academic Copilot. Tell me how your schedule needs to adapt (e.g. 'Shift Friday study to Sunday afternoon' or 'Double math prep before Tuesday's test'). I will modify flexible blocks while strictly preserving your locked college hours.",
    },
  ]);

  useEffect(() => {
    const plan = PlanService.getActivePlan();
    if (plan) {
      setActivePlan(plan);
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    if (!activePlan) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: inputMessage },
        {
          sender: "copilot",
          text: "You don't have an active plan yet. Please generate an academic plan in the Overview tab first so I have constraints to work with!",
        },
      ]);
      setInputMessage("");
      return;
    }

    const userText = inputMessage;
    setInputMessage("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/planner/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentTimetable: activePlan,
          userMessage: userText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "copilot",
            text: data.explanation,
            proposedPlan: data.updatedTimetable,
            applied: false,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "copilot",
            text: "Failed to mutate schedule: " + (data.error || "Unknown error"),
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "copilot",
          text: "Network error contacting Copilot: " + err?.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyMutation = (proposedPlan: Timetable, msgIndex: number) => {
    PlanService.saveActivePlan(proposedPlan);
    setActivePlan(proposedPlan);
    setMessages((prev) =>
      prev.map((m, idx) => (idx === msgIndex ? { ...m, applied: true } : m))
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-panel-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span>Conversational Restructuring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Academic Copilot
          </h1>
          <p className="text-sm text-muted mt-1">
            Propose conversational timetable mutations with strict locked-block protection.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-2xl bg-panel border border-panel-border overflow-hidden min-h-[500px]">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "copilot" && (
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-3 ${
                  msg.sender === "user"
                    ? "bg-accent text-white font-sans rounded-tr-none"
                    : "bg-panel-solid/60 border border-panel-border text-foreground font-sans rounded-tl-none"
                }`}
              >
                <p>{msg.text}</p>

                {/* Proposed Mutation Card if Copilot generated a change */}
                {msg.proposedPlan && (
                  <div className="p-3 rounded-xl bg-canvas/60 border border-panel-border space-y-2.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-muted border-b border-panel-border/60 pb-2">
                      <span className="text-accent font-semibold flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Proposed Timetable Mutation</span>
                      </span>
                      <span>{msg.proposedPlan.schedule.length} Days</span>
                    </div>

                    <div className="text-muted">
                      Locked college blocks strictly preserved. Flexible study sessions updated per prompt.
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      {msg.applied ? (
                        <div className="flex items-center space-x-1 text-status-done font-semibold">
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied to Active Schedule</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApplyMutation(msg.proposedPlan!, idx)}
                          className="px-3 py-1.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
                        >
                          Apply Schedule Mutation
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3 text-xs text-muted font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-accent" />
              <span>Analyzing schedule constraints & synthesizing mutation...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-panel-border bg-panel-solid/50 flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            placeholder="Type schedule adjustment (e.g. 'Push Saturday study block to 20:00')..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-canvas/60 border border-panel-border text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 rounded-lg bg-accent text-white disabled:opacity-50 transition-colors hover:bg-accent-hover"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
