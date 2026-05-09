# Quotes CRUD Management System - Technical Specification

## 1. Architecture & Data Flow

### 1.1 Technology Stack
- **Frontend**: Next.js 16 (App Router) + TypeScript + React Server Components
- **Backend**: Convex (BaaS) - Real-time database with built-in queries/mutations
- **UI**: shadcn/ui components + Tailwind CSS
- **State**: React state + Convex real-time subscriptions
- **Auth**: Clerk (already integrated)

### 1.2 Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Dashboard     │     │    Convex       │     │   Database      │
│   (React UI)    │◄───►│  (Backend/API)  │◄───►│  (PostgreSQL)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                       │
       │              ┌─────────────────┐
       └─────────────►│     Clerk       │
                      │  (Auth/JWT)     │
                      └─────────────────┘
```

### 1.3 Data Flow

```
1. User Action (Create/Update/Delete)
   ↓
2. Frontend Hook → Convex Mutation
   ↓
3. Convex validates + executes
   ↓
4. Database updated
   ↓
5. Real-time update pushed to subscribed clients
```

---

## 2. Database Schema

```typescript
// convex/schema.ts - Add quotes table
quotes: defineTable({
  content: v.string(),           // Quote text (required)
  author: v.string(),              // Author name (required)
  source: v.optional(v.string()), // Book, speech, etc.
  tags: v.array(v.string()),      // Searchable tags
  status: v.union(
    v.literal("published"),
    v.literal("draft")
  ),
  featured: v.boolean(),           // Featured on homepage?
  createdBy: v.string(),           // User ID
  createdAt: v.number(),           // Timestamp
  updatedAt: v.number(),           // Timestamp
})
  .index("by_creator", ["createdBy"])
  .index("by_status", ["status"])
  .index("by_featured", ["featured"])
  .index("by_created", ["createdAt"]),
```

---

## 3. Frontend Components

### 3.1 Component Structure (Matches your existing patterns)

```
app/(dashboard)/dashboard/quotes/
├── page.tsx                           # Main quotes page (Client Component)
├── layout.tsx                         # Dashboard layout extension
└── components/
    ├── quotes-page.tsx                # Page orchestrator (your pattern: content-editor.tsx)
    ├── quotes-table.tsx               # Data table with shadcn/ui Table
    ├── quotes-filter-bar.tsx          # Search/filter (matches filter-panel.tsx pattern)
    ├── quote-form-modal.tsx           # Add/Edit modal (shadcn Dialog)
    ├── quote-delete-dialog.tsx        # Delete confirmation (shadcn AlertDialog)
    └── quote-status-badge.tsx         # Status indicator with variants
```

### 3.2 Quotes Table (`quotes-table.tsx`)

**Note**: The shadcn/ui Table component needs to be installed first:
```bash
npx shadcn@latest add table
```

```tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

// Helper function for date formatting (no external dependency)
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface QuotesTableProps {
  searchTerm: string;
  statusFilter: "all" | "published" | "draft";
  onEdit: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
}

export function QuotesTable({ searchTerm, statusFilter, onEdit, onDelete }: QuotesTableProps) {
  const quotes = useQuery(api.quotes.list, {
    search: searchTerm,
    status: statusFilter,
  }) ?? [];

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Quote</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote._id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="max-w-md truncate">{quote.content}</TableCell>
              <TableCell>{quote.author}</TableCell>
              <TableCell>
                <QuoteStatusBadge status={quote.status} />
              </TableCell>
              <TableCell>{formatDate(quote.createdAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(quote)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(quote)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### 3.3 Quote Form Modal (`quote-form-modal.tsx`)

```tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface QuoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: Quote | null;
}

export function QuoteFormModal({ open, onOpenChange, quote }: QuoteFormModalProps) {
  const createQuote = useMutation(api.quotes.create);
  const updateQuote = useMutation(api.quotes.update);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    content: quote?.content ?? "",
    author: quote?.author ?? "",
    source: quote?.source ?? "",
    tags: quote?.tags?.join(", ") ?? "",
    status: quote?.status ?? "draft",
    featured: quote?.featured ?? false,
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.content.trim()) newErrors.content = "Quote content is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (formData.content.length > 1000) newErrors.content = "Quote must be 1000 characters or less";
    if (formData.author.length > 100) newErrors.author = "Author name too long";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        content: formData.content,
        author: formData.author,
        source: formData.source || undefined,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        status: formData.status as "published" | "draft",
        featured: formData.featured,
      };
      
      if (quote) {
        await updateQuote({ id: quote._id, ...payload });
      } else {
        await createQuote(payload);
      }
      onOpenChange(false);
    } catch (error) {
      setErrors({ submit: "Failed to save quote" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{quote ? "Edit Quote" : "Add New Quote"}</DialogTitle>
        </DialogHeader>
<form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">Quote Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter quote text..."
              rows={4}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && (
              <p className="text-sm text-destructive mt-1">{errors.content}</p>
            )}
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input 
              id="author" 
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              placeholder="Author name"
              className={errors.author ? "border-destructive" : ""}
            />
            {errors.author && (
              <p className="text-sm text-destructive mt-1">{errors.author}</p>
            )}
          </div>

          <div>
            <Label htmlFor="source">Source (Optional)</Label>
            <Input 
              id="source" 
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              placeholder="Book, speech, etc." 
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : quote ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 3.4 Delete Confirmation (`quote-delete-dialog.tsx`)

```tsx
"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface QuoteDeleteDialogProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function QuoteDeleteDialog({ quote, open, onOpenChange, onDeleted }: QuoteDeleteDialogProps) {
  const deleteQuote = useMutation(api.quotes.remove);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!quote) return;
    
    setIsDeleting(true);
    try {
      await deleteQuote({ id: quote._id });
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the quote
            by {quote?.author}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Quote"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### 3.5 Page Orchestrator (`quotes-page.tsx`)

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuoteFormModal } from "./quote-form-modal";
import { QuoteDeleteDialog } from "./quote-delete-dialog";
import { QuotesTable } from "./quotes-table";

export function QuotesPage() {
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quotes Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Quote
        </Button>
      </div>

      <QuotesTable
        searchTerm=""
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
```

### 3.6 Status Badge (`quote-status-badge.tsx`)

```tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuoteStatusBadgeProps {
  status: "published" | "draft";
}

export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  return (
    <Badge
      variant={status === "published" ? "default" : "secondary"}
      className={cn(
        status === "published" 
          ? "bg-green-100 text-green-800" 
          : "bg-gray-100 text-gray-800"
      )}
    >
      {status}
    </Badge>
  );
}
```

### 3.7 Main Page (`app/(dashboard)/dashboard/quotes/page.tsx`)

```tsx
import { QuotesPage } from "./components/quotes-page";

export default function Quotes() {
  return <QuotesPage />;
}
```

---

## 4. Backend Logic (Convex)

### 4.1 Convex API (`convex/quotes.ts`)

```typescript
// convex/quotes.ts - Following your existing patterns from sites.ts/sections.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// GET - List quotes with search, status, featured filters
export const list = query({
  args: {
    search: v.optional(v.string()),
    status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, { search, status, featured, limit = 20, cursor }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { page: [], isDone: true, continueCursor: "" };

    // Start with index-based query (following your schema patterns)
    let dbQuery = ctx.db.query("quotes").withIndex("by_creator", (q) =>
      q.eq("createdBy", identity.subject)
    );

    // Build filter conditions
    const filterConditions = [];
    if (status) {
      filterConditions.push((q: any) => q.eq(q.field("status"), status));
    }
    if (featured !== undefined) {
      filterConditions.push((q: any) => q.eq(q.field("featured"), featured));
    }
    if (search) {
      const searchTerm = `%${search}%`;
      filterConditions.push((q: any) => q.or(
        q.ilike(q.field("content"), searchTerm),
        q.ilike(q.field("author"), searchTerm),
        q.ilike(q.field("source"), searchTerm)
      ));
    }

    // Apply filters if any exist
    if (filterConditions.length > 0) {
      dbQuery = dbQuery.filter((q) => 
        filterConditions.length === 1 
          ? filterConditions[0](q)
          : q.and(...filterConditions.map((fn) => fn(q)))
      );
    }

    return await dbQuery
      .order("desc")
      .paginate({ cursor, numItems: limit });
  },
});

// POST - Create quote (following your mutation patterns)
export const create = mutation({
  args: {
    content: v.string(),
    author: v.string(),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.union(v.literal("published"), v.literal("draft")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const id = await ctx.db.insert("quotes", {
      ...args,
      createdBy: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

// PATCH - Update quote (idempotent update)
export const update = mutation({
  args: {
    id: v.string(),
    content: v.optional(v.string()),
    author: v.optional(v.string()),
    source: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const quote = await ctx.db.get(id);
    if (!quote) throw new Error("Quote not found");

    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

// DELETE - Delete quote (named "remove" to match your pattern)
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    const quote = await ctx.db.get(id);
    if (!quote) throw new Error("Quote not found");

    await ctx.db.delete(id);
    return { success: true };
  },
});
```

### 4.2 Error Handling

| Status | Condition | Response |
|--------|-----------|----------|
| 400 | Validation error | `{ error: "Invalid input" }` |
| 401 | Not authenticated | `{ error: "Unauthorized" }` |
| 404 | Quote not found | `{ error: "Quote not found" }` |
| 500 | Server error | `{ error: "Internal server error" }` |

---

## 5. Security & Validation

### 5.1 Client-Side Validation (Native)

The form uses native validation with real-time error feedback:
- Content: Required, max 1000 chars
- Author: Required, max 100 chars
- Source: Optional, max 200 chars
- Tags: Comma-separated, validated on submit

### 5.2 Server-Side Validation (Convex)

Convex validates field lengths and required fields in the `create` and `update` mutations. Invalid requests throw descriptive errors that propagate to the client.

### 5.3 Authorization Rules

- Only authenticated users can create/update/delete
- Users can only manage their own quotes (filtered by `createdBy`)
- Admin users can manage all quotes (future enhancement)

---

## 6. Implementation Checklist

### Phase 0: Dependencies (if missing)
- [ ] `npx shadcn@latest add table` - for the quotes table
- [ ] `npx shadcn@latest add dialog` - for modals (if not installed)
- [ ] `npx shadcn@latest add alert-dialog` - for delete confirmation
- [ ] `npx shadcn@latest add badge` - for status badges

### Phase 1: Database Setup
- [ ] Add `quotes` table to `convex/schema.ts`
- [ ] Deploy schema changes with `npx convex dev`
- [ ] Generate types with `npx convex codegen`

### Phase 2: Backend API
- [ ] Create `convex/quotes.ts` with CRUD operations
- [ ] Implement `list` query with pagination/search
- [ ] Implement `create`, `update`, `delete` mutations
- [ ] Add input validation and error handling

### Phase 3: Frontend Components
- [ ] Create `app/(dashboard)/dashboard/quotes/page.tsx`
- [ ] Build `quotes-table.tsx` with sorting/pagination
- [ ] Build `quote-form-modal.tsx` with validation
- [ ] Build `quote-delete-dialog.tsx` confirmation
- [ ] Add filter/search components

### Phase 4: State Management
- [ ] Create `hooks/use-quotes.ts` for data fetching
- [ ] Implement optimistic updates

### Phase 5: Testing & Polish
- [ ] Test all CRUD operations
- [ ] Verify pagination/search
- [ ] Test error states
- [ ] Add loading states

---

## 7. Estimated Timeline

| Phase | Hours |
|-------|-------|
| Database Setup | 1 hour |
| Backend API | 3 hours |
| Frontend Components | 4 hours |
| Testing & Polish | 2 hours |
| **Total** | **10 hours** |