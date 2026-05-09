import { useEffect } from "react";

interface KeyboardShortcutsProps {
  onSave?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onPublish,
  onPreview,
  onUndo,
  onRedo,
  onSelectAll,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Cmd/Ctrl + S = Save
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && onSave) {
        e.preventDefault();
        onSave();
      }

      // Cmd/Ctrl + Enter = Publish
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && onPublish) {
        e.preventDefault();
        onPublish();
      }

      // Cmd/Ctrl + P = Preview (while not printing)
      if ((e.metaKey || e.ctrlKey) && e.key === "p" && onPreview && !e.shiftKey) {
        e.preventDefault();
        onPreview();
      }

      // Cmd/Ctrl + Z = Undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey && onUndo) {
        e.preventDefault();
        onUndo();
      }

      // Cmd/Ctrl + Shift + Z = Redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey && onRedo) {
        e.preventDefault();
        onRedo();
      }

      // Cmd/Ctrl + A = Select All Sections
      if ((e.metaKey || e.ctrlKey) && e.key === "a" && onSelectAll) {
        e.preventDefault();
        onSelectAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onPublish, onPreview, onUndo, onRedo, onSelectAll]);
}