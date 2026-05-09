"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

interface QuoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: Doc<"quotes"> | null;
}

type FormData = {
  content: string;
  author: string;
  source: string;
  tags: string;
  status: "published" | "draft";
  featured: boolean;
};

export function QuoteFormModal({ open, onOpenChange, quote }: QuoteFormModalProps) {
  const createQuote = useMutation(api.quotes.create);
  const updateQuote = useMutation(api.quotes.update);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    content: quote?.content ?? "",
    author: quote?.author ?? "",
    source: quote?.source ?? "",
    tags: quote?.tags?.join(", ") ?? "",
    status: (quote?.status ?? "draft") as "published" | "draft",
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
        status: formData.status,
        featured: formData.featured,
      };
      
      if (quote) {
        await updateQuote({ id: quote._id, ...payload });
      } else {
        await createQuote(payload);
      }
      onOpenChange(false);
    } catch {
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