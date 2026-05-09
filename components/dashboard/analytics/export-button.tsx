"use client";

import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  data: Record<string, unknown>[] | object[];
  filename?: string;
  className?: string;
}

export function ExportButton({ data, filename = "data", className }: ExportButtonProps) {
  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0] || {}).join(",");
    const rows = data.map(row => Object.values(row).join(",")).join("\n");
    const csvContent = `${headers}\n${rows}`;
    downloadFile(csvContent, `${filename}.csv`, "text/csv");
  };

  const exportJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, "application/json");
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button variant="outline" size="sm" onClick={exportCSV} title="Export CSV">
        <FileText className="h-3.5 w-3.5" />
        <span className="sr-only">Export CSV</span>
      </Button>
      <Button variant="outline" size="sm" onClick={exportJSON} title="Export JSON">
        <Download className="h-3.5 w-3.5" />
        <span className="sr-only">Export JSON</span>
      </Button>
    </div>
  );
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
