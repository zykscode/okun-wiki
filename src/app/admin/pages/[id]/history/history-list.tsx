"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import ReactDiffViewer from "react-diff-viewer-continued";

interface Version {
  id: string;
  content: string;
  version: number;
  editSummary: string | null;
  createdAt: string;
  createdBy: string;
}

interface HistoryListProps {
  pageId: string;
  initialVersions: Version[];
  currentContent: string;
}

export function HistoryList({
  pageId: _pageId,
  initialVersions,
  currentContent,
}: HistoryListProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  // Add the "current" version as an option to compare
  const currentVersion: Version = {
    id: "current",
    content: currentContent,
    version:
      initialVersions.length > 0 ? Math.max(...initialVersions.map((v) => v.version)) + 1 : 1,
    editSummary: "Current Version",
    createdAt: new Date().toISOString(),
    createdBy: "System",
  };

  const allVersions = [currentVersion, ...initialVersions];

  const handleSelect = (id: string) => {
    if (selectedVersions.includes(id)) {
      setSelectedVersions(selectedVersions.filter((v) => v !== id));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, id]);
    }
  };

  const v1 = allVersions.find((v) => v.id === selectedVersions[0]);
  const v2 = allVersions.find((v) => v.id === selectedVersions[1]);

  // Sort by version number to ensure correct comparison direction
  const [oldV, newV] = v1 && v2 ? (v1.version < v2.version ? [v1, v2] : [v2, v1]) : [null, null];

  if (comparing && oldV && newV) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Comparing v{oldV.version} vs v{newV.version}
          </h2>
          <Button
            onClick={() => {
              setComparing(false);
              setSelectedVersions([]);
            }}
          >
            Back to List
          </Button>
        </div>
        <div className="border border-wiki-border rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
          <ReactDiffViewer
            oldValue={oldV.content}
            newValue={newV.content}
            splitView={true}
            useDarkTheme={
              typeof window !== "undefined" && document.documentElement.classList.contains("dark")
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-wiki-muted">
          Select two versions to compare. ({selectedVersions.length}/2 selected)
        </p>
        <Button disabled={selectedVersions.length !== 2} onClick={() => setComparing(true)}>
          Compare Versions
        </Button>
      </div>

      <div className="border border-wiki-border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-wiki-hover text-wiki-muted uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3 font-medium">Select</th>
              <th className="px-4 py-3 font-medium">Ver</th>
              <th className="px-4 py-3 font-medium">Summary</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">User ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wiki-border">
            {allVersions.map((v) => (
              <tr
                key={v.id}
                className={`hover:bg-wiki-hover transition-colors cursor-pointer ${selectedVersions.includes(v.id) ? "bg-primary-500/5" : ""}`}
                onClick={() => handleSelect(v.id)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(v.id)}
                    onChange={() => {}} // Handled by row click
                    className="rounded border-wiki-border"
                  />
                </td>
                <td className="px-4 py-3 font-mono">v{v.version}</td>
                <td className="px-4 py-3">
                  {v.id === "current" && <Badge className="mr-2">Current</Badge>}
                  {v.editSummary || "No summary"}
                </td>
                <td className="px-4 py-3 text-wiki-muted">{formatDate(v.createdAt)}</td>
                <td className="px-4 py-3 text-wiki-muted truncate max-w-[120px]">{v.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
