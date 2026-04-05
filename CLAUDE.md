# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brannon Canvas is a static single-page business website for a local upholstery, awning, and canvas work company in Stockton, CA. No build system, no package manager, no backend — just HTML, CSS, and vanilla JavaScript served directly.

## Development

```bash
# Quick local server (Python)
python3 -m http.server 8080

# Or with Node
npx serve .
```

## Architecture

**Single page:** All content lives in `index.html`. The old multi-page files (`home.html`, `commercial.html`, `contact.html`, `carpet.html`, `patios.html`, `marine.html`, `auto.html`) are unused and can be ignored.

**Sections (in order):** Hero → Services → About → Gallery → Contact → Footer. Nav links are anchor links (`#services`, `#about`, `#gallery`, `#contact`).

**CSS:** Single stylesheet at `css/style.css`. Design tokens at the top:
- Dark/nav: `#2c2f36`, Darker: `#1e2128`
- Accent (amber): `#c07d3a`
- Background: `#faf8f5`, Alt background: `#f0ece4`
- Do not reintroduce the old blue (`#2D437F`) or gold (`#d4af37`) — those were intentionally replaced.

**JS:** Single file `js/main.js` with a `Carousel` class (handles both the hero and gallery carousels), and functions for nav scroll behavior, mobile menu, scroll fade-in animations, smooth scroll, and year. All initialized on `DOMContentLoaded`.

**Nav behavior:** Transparent over the hero, transitions to solid dark slate (`rgba(30,33,40,0.97)`) with backdrop blur when `.scrolled` class is added at 80px scroll depth.

**Scroll animations:** Elements with `.fade-up` start invisible and animate in via `IntersectionObserver`. Delay is set per-element with `--delay` CSS custom property.

**Carousel:** The `Carousel` class supports auto-rotation, dot indicators, prev/next buttons, touch swipe, pause on hover, and pause on hidden tab. Hero uses it without prev/next buttons; gallery section uses it with both.

**Images:** Organized under `images/` by section (`custom/`, `home/`, `commercial/`, `marine/`, `cu/`). Files follow a `1.jpg`–`6.jpg` naming convention per section; thumbnail variants are prefixed `t_`.
