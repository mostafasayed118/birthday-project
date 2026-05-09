import type {
  SectionType,
  SectionContent,
  SectionSettings,
  SectionProps,
} from "./types";

export interface SectionRegistryEntry {
  type: SectionType;
  label: string;
  description: string;
  icon: string;
  defaultContent: SectionContent;
  defaultSettings: SectionSettings;
  publicRenderer: React.ComponentType<SectionProps>;
  editorComponent: React.ComponentType<{
    content: SectionContent;
    onUpdate: (content: SectionContent) => void;
  }>;
}

const registry = new Map<SectionType, SectionRegistryEntry>();
let initialized = false;

export function registerSection(entry: SectionRegistryEntry) {
  registry.set(entry.type, entry);
}

export function initializeRegistry() {
  if (initialized) return;
  // Dynamic import to avoid circular deps at module level
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SECTION_ENTRIES = require("./section-entries").SECTION_ENTRIES;
  for (const entry of SECTION_ENTRIES) {
    registry.set(entry.type, entry);
  }
  initialized = true;
}

export function getSectionRegistryEntry(type: SectionType): SectionRegistryEntry | undefined {
  return registry.get(type);
}

export function getAllSectionTypes(): SectionType[] {
  return Array.from(registry.keys());
}

export function getAllSectionEntries(): SectionRegistryEntry[] {
  return Array.from(registry.values());
}

export function createDefaultSection(type: SectionType) {
  const entry = registry.get(type);
  if (!entry) throw new Error(`Unknown section type: ${type}`);
  return {
    id: crypto.randomUUID(),
    type,
    visible: true,
    order: 0,
    content: entry.defaultContent,
    settings: entry.defaultSettings,
  };
}

export function createDefaultSections(types: SectionType[]) {
  return types.map((type, index) => ({
    ...createDefaultSection(type),
    order: index,
  }));
}

export function getPublicRenderer(type: SectionType): React.ComponentType<SectionProps> | null {
  return registry.get(type)?.publicRenderer ?? null;
}

export function getEditorComponent(type: SectionType): React.ComponentType<{
  content: SectionContent;
  onUpdate: (content: SectionContent) => void;
}> | null {
  return registry.get(type)?.editorComponent ?? null;
}

export function getSectionLabel(type: SectionType): string {
  return registry.get(type)?.label ?? type;
}

export function getSectionIcon(type: SectionType): string {
  return registry.get(type)?.icon ?? "HelpCircle";
}
