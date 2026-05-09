"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { QuoteFormModal } from "./quote-form-modal";
import { QuoteDeleteDialog } from "./quote-delete-dialog";
import { QuotesTable } from "./quotes-table";
import type { Doc } from "@/convex/_generated/dataModel";

export function QuotesPage() {
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Doc<"quotes"> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quotes Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Quote
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <QuotesTable
        searchTerm={searchTerm}
        statusFilter="all"
        onEdit={(quote) => {
          setSelectedQuote(quote);
          setShowForm(true);
        }}
        onDelete={(quote) => {
          setSelectedQuote(quote);
          setShowDelete(true);
        }}
      />

      <QuoteFormModal
        open={showForm}
        onOpenChange={setShowForm}
        quote={selectedQuote}
      />

      <QuoteDeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        quote={selectedQuote}
        onDeleted={() => setSelectedQuote(null)}
      />
    </div>
  );
}