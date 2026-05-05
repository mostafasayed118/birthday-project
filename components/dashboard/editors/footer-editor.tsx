"use client";

import type { FooterContent, SocialLink, SectionContent } from "@/lib/types";
import {
  TextField,
  SwitchField,
  EditorDivider,
  AddItemButton,
  RemoveItemButton,
  EmptyState,
} from "./fields";

interface FooterEditorProps {
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}

export function FooterEditor({ content, onUpdate }: FooterEditorProps) {
  const c = content as FooterContent;

  function update(updates: Partial<FooterContent>) {
    onUpdate({ ...c, ...updates });
  }

  function updateLink(index: number, updates: Partial<SocialLink>) {
    const socialLinks = [...c.socialLinks];
    socialLinks[index] = { ...socialLinks[index], ...updates };
    update({ socialLinks });
  }

  function addLink() {
    const newLink: SocialLink = {
      id: crypto.randomUUID(),
      platform: "Website",
      url: "",
      label: "",
    };
    update({ socialLinks: [...c.socialLinks, newLink] });
  }

  function removeLink(index: number) {
    update({ socialLinks: c.socialLinks.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <TextField
        label="Footer Text"
        value={c.text || ""}
        onChange={(v) => update({ text: v })}
        placeholder="e.g., Made with love"
      />

      <SwitchField
        label="Show Attribution"
        checked={c.showAttribution}
        onCheckedChange={(v) => update({ showAttribution: v })}
        description="Show 'Built with Romantic Microsite' credit"
      />

      <EditorDivider />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">
            Social Links ({c.socialLinks.length})
          </h4>
        </div>

        {c.socialLinks.length === 0 ? (
          <EmptyState
            message="No social links yet."
            actionLabel="Add Link"
            onAction={addLink}
          />
        ) : (
          <div className="space-y-3">
            {c.socialLinks.map((link, index) => (
              <div
                key={link.id}
                className="rounded-md border border-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Link {index + 1}
                  </span>
                  <RemoveItemButton onClick={() => removeLink(index)} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    label="Platform"
                    value={link.platform}
                    onChange={(v) => updateLink(index, { platform: v })}
                    placeholder="e.g., Instagram"
                  />

                  <TextField
                    label="Label"
                    value={link.label || ""}
                    onChange={(v) => updateLink(index, { label: v })}
                    placeholder="Optional label"
                  />
                </div>

                <TextField
                  label="URL"
                  value={link.url}
                  onChange={(v) => updateLink(index, { url: v })}
                  placeholder="https://..."
                />
              </div>
            ))}

            <AddItemButton label="Add Link" onClick={addLink} />
          </div>
        )}
      </div>
    </div>
  );
}
