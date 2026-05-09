"use client";

import { Globe } from "lucide-react";
import { useState } from "react";

const LANGUAGES = {
  en: { label: "English", native: "English" },
  ar: { label: "Arabic", native: "العربية" },
} as const;

export function LocaleSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<"en" | "ar">(
    typeof window !== "undefined"
      ? (localStorage.getItem("preferred-locale") as "en" | "ar") || "en"
      : "en"
  );

  const handleLocaleChange = (locale: "en" | "ar") => {
    setCurrentLocale(locale);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-locale", locale);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex rounded-md border border-border overflow-hidden">
        {(["en", "ar"] as const).map((locale) => (
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`px-2 py-1 text-xs font-medium transition-colors ${
              currentLocale === locale
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            {LANGUAGES[locale].label}
          </button>
        ))}
      </div>
    </div>
  );
}