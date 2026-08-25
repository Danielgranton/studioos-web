# StudioOS Web Architecture

This repo uses a route-first Next.js app with feature-owned modules.

## Routing

- `app/` contains route entrypoints, layouts, and page composition only.
- Route files should stay thin and import from feature modules.
- Empty route scaffolds should not be kept unless they already back real pages.

## Features

- `features/home/` owns the landing page sections and their local data, cards, hooks, and indexes.
- `features/search/` owns search UI, hooks, cache, services, and types behind a single public entrypoint.

## Layout

- `components/layout/navbar/` owns the global navigation chrome.
- Shared navbar data lives next to the navbar, not scattered across multiple files.

## Shared Infrastructure

- `lib/api/` holds the shared HTTP client.
- `constants/theme/` holds reusable design tokens.

## Conventions

- Prefer feature entrypoints over deep imports.
- Keep shared utilities shared and feature logic local.
- Use consistent naming for folders, files, and exports.
