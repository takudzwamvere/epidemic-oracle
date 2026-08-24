"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, Loader2, LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export type ActivityType = "critical" | "warning" | "info" | "success" | "processing";

export interface Activity {
  id: number | string;
  type: ActivityType;
  message: string;
  time: string;
  badge?: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  title?: string;
  className?: string;
}

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: "critical",
    message: "Outbreak threshold exceeded: Harare district",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "warning",
    message: "Elevated case count: Bulawayo province",
    time: "15 min ago",
  },
  {
    id: 3,
    type: "info",
    message: "Weekly data synchronization complete",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "success",
    message: "Intervention plan generated for Manicaland",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "processing",
    message: "Analyzing new batch uploads...",
    time: "Now",
  },
];

/**
 * Activity feed component ported from epidemic-prediction.
 * Renders a scrollable list of typed events with color-coded icons.
 * Pass `activities` prop to override the default placeholder items.
 */
export function ActivityFeed({
  activities = DEFAULT_ACTIVITIES,
  title = "Activity Feed",
  className,
}: ActivityFeedProps) {
  return (
    <Card className={cn("flex flex-col rounded-none", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-3 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="shrink-0 mt-1">
              {item.type === "critical"   && <AlertTriangle className="w-5 h-5 text-red-600" />}
              {item.type === "warning"    && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {item.type === "info"       && <Info className="w-5 h-5 text-blue-600" />}
              {item.type === "success"    && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {item.type === "processing" && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-sm text-slate-800 leading-tight font-medium">
                {item.message}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{item.time}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
