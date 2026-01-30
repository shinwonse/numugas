# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NUMUGAS (담장NUMUGAS) is a Korean baseball team statistics and player information web application built with Next.js 16 App Router. It displays team stats, player stats (batting/pitching), schedules, and YouTube content.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase
- **Data Fetching**: TanStack Query (client), Supabase client (server)
- **Animations**: Framer Motion

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API routes (crawl-*, pitcher-career, batter-career, etc.)
│   ├── players/           # Player list and detail pages
│   ├── stats/             # Stats pages with dynamic [type]/[season] routes
│   └── lineup/            # Lineup preview page
├── components/
│   ├── ui/                # shadcn/ui components (import via @/components/ui/*)
│   └── animated/          # Framer Motion animated components
├── hooks/                 # Custom React hooks (use-batting-stats, use-team, etc.)
├── lib/
│   ├── api/              # Server-side data fetching functions
│   ├── supabase.ts       # Supabase client
│   └── cn.ts             # Tailwind class merging utility
└── types/                 # TypeScript type definitions
```

### Data Flow
- **Server Components**: Use `src/lib/api/*` functions that directly query Supabase
- **Client Components**: Use hooks from `src/hooks/*` that call API routes
- **API Routes**: Located in `src/app/api/*`, handle data crawling and Supabase operations

### Key Patterns
- Server Components are default; mark client components with `'use client'`
- Path alias `@/*` maps to `./src/*`
- shadcn/ui components use the default style with CSS variables
- Custom fonts: Montserrat (sans), Orbitron (display), Aggravo (custom)

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```
