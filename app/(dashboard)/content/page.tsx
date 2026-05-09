"use client";

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ContentItem {
  _id: string;
  key: string;
  translations: { en?: string; ar?: string; es?: string; fr?: string };
}

export default function ContentManagerPage() {
  const content = useQuery(api.content.list, {});
  const updateContent = useMutation(api.content.update);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [translations, setTranslations] = useState({ en: "", ar: "", es: "", fr: "" });

  const handleEdit = (item: ContentItem) => {
    setEditingKey(item.key);
    setTranslations({
      en: item.translations.en || "",
      ar: item.translations.ar || "",
      es: item.translations.es || "",
      fr: item.translations.fr || "",
    });
  };

  const handleSave = async () => {
    if (!editingKey) return;
    
    try {
      await updateContent({
        key: editingKey,
        translations,
      });
      setEditingKey(null);
    } catch (error) {
      console.error("Failed to update content", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Content Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage all text content for the application
        </p>
      </div>

      <div className="space-y-4">
        {content?.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle className="font-mono text-sm">{item.key}</CardTitle>
            </CardHeader>
            <CardContent>
              {editingKey === item.key ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium">English</label>
                    <Textarea
                      value={translations.en}
                      onChange={(e) =>
                        setTranslations({ ...translations, en: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Arabic</label>
                    <Textarea
                      value={translations.ar}
                      onChange={(e) =>
                        setTranslations({ ...translations, ar: e.target.value })
                      }
                      rows={2}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Spanish</label>
                    <Textarea
                      value={translations.es}
                      onChange={(e) =>
                        setTranslations({ ...translations, es: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">French</label>
                    <Textarea
                      value={translations.fr}
                      onChange={(e) =>
                        setTranslations({ ...translations, fr: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingKey(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm">{item.translations.en}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}