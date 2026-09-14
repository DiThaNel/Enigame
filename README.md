# Enigame — Mobile Urban Adventure & Mystery Exploration

> **An interactive outdoor exploration and mystery-solving mobile application engineered with Next.js 16, React 19, and TypeScript. Featuring real-world GPS checkpoint radar, camera QR scanning HUD, community expeditions, and gamified explorer progression.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4%20(Turbopack)-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20Strict-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing%20(100%25)-6e9f18?style=flat&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Built strictly matching the **Enigame Figma Design System**, featuring a mobile-first responsive app shell with desktop simulator framing, reactive Zustand state management, camera QR scanner HUD, and comprehensive automated test suites.

---

## Table of Contents

1. [Key Features](#key-features)
2. [Figma Design System & Color Tokens](#figma-design-system--color-tokens)
3. [Core Architecture & Tech Stack](#core-architecture--tech-stack)
4. [Mobile Navigation Map](#mobile-navigation-map)
5. [Automated Testing Suite](#automated-testing-suite)
6. [Engineering Roadmap](#engineering-roadmap)
7. [Comprehensive Documentation](#comprehensive-documentation)

---

## Key Features

### 0. Complete Figma Onboarding & Auth Journey
- **01 - Splash Screen:** Lavender backdrop (`#8E97FD`), dashed journey loops, brand title `ENIGAME`, slogan `Adventure is in us`, and copyright footer `© Copyright Enigmavity 2020. All rights reserved`. Interactive tap to begin with instant skip control.
- **02 - Select Language:** Multi-language gateway with Portugal (`Bandera Portugal.png`) and USA circular flag badges, interactive hover effects, and automatic locale setting.
- **03 - Create Account / Login:** Exact Figma frame 03 with Facebook (`#6979F8`), Google OAuth pills, email login fields (`Gabriel`, `Gabriel@gmail.com`, masked password with eye toggle), policy agreement checkbox, and `Get Started` CTA.
- **04 to 04.3 - User Guide Flow:** 4-stage visual guide using Figma illustration cutouts (`Userguide.png` to `Userguide4.png`), 4-bar progress indicator, and the iconic `Let the Adventure Begin >` action button leading into the main dashboard.


### 1. Home Discovery Dashboard
* **Dynamic Search & Quick Action Grid**: Instant search across routes, historical monuments, and districts with 4 elevated shortcut pills (`Map`, `Routes`, `QR Code`, `Users`).
* **Category Filters**: Filter between *Experiences*, *Adventure*, and *Tour* itineraries.
* **Featured Routes Carousel**: Scenic monument cards with elevation badges, difficulty tags (`Easy`, `Medium`, `Hard`), duration metrics, and reward points.
* **Special Event Rallies**: Banner alerts for active limited-time community escape challenges.

### 2. Interactive Meet-up Hub (3 Sub-Tabs)
* **Explorers Tab**: District radar showing online adventurers, explorer levels, distance in meters, and earned badges. Clicking an adventurer opens an enriched profile drawer.
* **Traveling (Expeditions) Tab**: Community-scheduled group routes with date/time tags (`Tomorrow, 16:30`), max adventurer capacities (`4/8 joined`), host info, and a `+ Host an Expedition` creator modal.
* **Map Radar Tab**: Vector SVG radar map with real-time checkpoint markers, golden castle flags, mystery riddle pins, nearby explorer proximity avatars with pulsing radar rings (`120m`, `350m`), and a floating bottom sheet HUD with route progress and quick-action team up toggles.

### 3. Real-World QR Scanner & Riddle Engine
* **Full-Screen Viewfinder HUD**: Ambient camera backdrop with glowing lavender corner reticles (`#7C82ED`) and an animated horizontal laser scanning sweep.
* **Exploration Controls**: Target checkpoint indicator, flashlight/torch toggle, manual code entry fallback (`ENIGAME-BRAG-02`), and hint requests.
* **Interactive Riddle Modal**: Solvable riddle challenges tied to monuments, festive canvas confetti celebrations, XP rewards, and automatic progress persistence.

### 4. Personal Profile & Visual Edit Studio
* **Gamified Profile Showcase**: High-resolution adventurer avatar, Level badge frame, customizable motto/bio, base city with GPS pin, demographic pills, and tabs for Instagram photos, journey biography, and completed trips.
* **Edit Profile Studio**: Modal to customize explorer nickname, avatar selection with level frames, adventure bio with quote badges, home base city selector, and equipped rank titles.

### 5. Points Wallet & Local Rewards Store
* **Points Balance & Wallet**: Live wallet balance tracking points earned through route completions and QR scans.
* **Store & Coupon Marketplace**: Redeem points for local historical monument free entries, artisan café vouchers, exclusive avatar frames, and riddle hint packs.
* **Live Leaderboards & Activity Feed**: Local ranking of top adventurers and complete transaction ledger.

---

## Figma Design System & Color Tokens

| Token | Hex / Value | Application |
| :--- | :--- | :--- |
| `--primary` | `#7C82ED` | Primary CTAs, active tab indicators, scanner laser |
| `--primary-dark` | `#6C5CE7` | Gradient endpoints, hover states, level badges |
| `--primary-light` | `#EEF0FF` | Icon container backdrops, subtle tag pills |
| `--accent-gold` | `#FFB800` | Reward points, checkpoint flags, leaderboard rank #1 |
| `--surface` | `#FFFFFF` | Card surfaces, bottom sheets, modal dialogs |
| `--background` | `#F4F6FB` | Mobile application canvas background |
| `--text-primary` | `#1E1F3D` | Headlines, usernames, modal titles |
| `--text-muted` | `#7A7C99` | Subtitles, distances, timestamps |

---

## Core Architecture & Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **UI Engine**: [React 19](https://react.dev/) + [TypeScript 5 Strict](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Design Tokens
* **State Management**: [Zustand 5](https://zustand-demo.pmnd.rs/) with reactive optimistic mutations
* **Icons**: [Lucide React](https://lucide.dev/)
* **Animations & Effects**: CSS Keyframe Scanners, Radar Pulse Rings, and [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
* **Testing**: [Vitest 5](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

---

## Automated Testing Suite

To execute the automated unit and component navigation tests:

```bash
npm test
```

Watch mode during development:

```bash
npm run test:watch
```

---
