# Project Brief — Romantic Microsite Platform

## Purpose

This document serves as the top-level project overview and the primary entry point for any AI coding session or new team member joining the project.

## Executive Summary

A **configurable romantic microsite CMS platform** that allows users to create, customize, and publish beautiful one-page romantic websites (anniversaries, proposals, love stories, Valentine's Day, etc.). The platform consists of:

1. **Public-Facing Page** — A dynamically rendered, theme-driven single-page site served via a unique slug/URL.
2. **Admin Dashboard** — A full-featured editing interface for controlling all content, design, layout, sections, and publishing state.

This is NOT a one-off birthday page. It is a **reusable platform** where every microsite is a database-driven, dynamically composed page.

## Core Product Vision

> Build a platform where anyone can create a stunning romantic microsite in minutes — with full control over content, design, sections, and layout — and publish it to a shareable public URL.

## Key Design Principles

- **Database-driven rendering**: Every text, image, color, font, section, and layout decision is stored in Convex and rendered dynamically.
- **Section-based composition**: Pages are assembled from composable, reorderable, toggleable sections.
- **Theme as data**: Design tokens (colors, fonts, spacing, border radii, etc.) are stored as data, not hardcoded.
- **Draft-first workflow**: Changes are saved as drafts and explicitly published to go live.
- **Real-time preview**: Dashboard shows a live preview of the public page as the user edits.
- **Platform-grade, not project-grade**: Built to support many microsites, not just one.

## Project Scope

### In Scope (MVP)

- Single-page romantic microsite with configurable sections
- Admin dashboard with authentication
- Section management (add, remove, reorder, toggle visibility)
- Content editing (text, images, colors per section)
- Theme editing (colors, fonts, spacing tokens)
- Draft/publish workflow
- Public page rendering from Convex data
- Real-time preview in dashboard

### Out of Scope (Future)

- Multi-user collaboration on same site
- Custom domain mapping
- Payment/subscription system
- Email/notification system
- Analytics dashboard
- Template marketplace
- CMS for non-romantic microsites (though architecture should allow it)
- Internationalization / multi-language

## Target Users

- Individuals creating romantic gestures (proposals, anniversaries, Valentine's)
- Small event planners who build romantic pages for clients
- Developers who want a white-label romantic page builder

## Success Criteria

- Public page loads fast (< 2s) and looks stunning on all devices
- Dashboard allows full content and design control without code
- Draft/publish workflow prevents accidental live changes
- Section system is extensible without modifying core rendering logic
- Theme system supports rapid visual customization
