# Copilot Instructions for Bookspot

## Project overview

Bookspot is a campus venue booking platform built with Next.js, React, TypeScript, Tailwind CSS, MongoDB, Mongoose, Redis, and ImageKit. The app allows students to browse venues, request bookings, and track booking status, while administrators manage venues, users, and booking approvals.

This project is a full-stack app where pages and API routes live together in the `app/` directory. Treat it as a production-style monolith with server-side logic and client UI in the same codebase.

## Core product goals

- Students should be able to discover available venues and book them easily.
- Administrators should be able to manage venue data and review booking requests.
- Booking logic must be reliable, validated, and protected against invalid requests.
- Venue listings should be fast through Redis caching when appropriate.
- Security and authorization must be enforced on every protected action.

## Tech stack and conventions

- Framework: Next.js 16
- UI: React 19
- Language: TypeScript
- Styling: Tailwind CSS
- Database: MongoDB + Mongoose
- Cache: Redis
- Auth: JWT via cookies
- Images: ImageKit
- Icons: lucide-react

Follow the current project structure and existing conventions rather than introducing unrelated patterns.

## Brand color system

Use this palette consistently across all UI work for Bookspot:

- Primary / backgrounds / cards: `#F8F8F8` (Ghost White)
- Secondary / buttons / CTAs: `#1A365D` (Deep Navy Blue)
- Accent / highlights / badges: `#D4AF37` (Soft Muted Gold)
- Neutral dark / text: `#1E293B` (Slate Black)

Design guidance:

- Use Ghost White as the base background for pages, cards, and spacious content sections.
- Use Deep Navy Blue for primary buttons, navigation emphasis, and important action states.
- Use Soft Muted Gold sparingly for highlights, badges, premium accents, and small visual emphasis points.
- Use Slate Black for headings, body text, and high-contrast UI elements.
- Keep contrast readable and premium; avoid loud neon colors or random accent palettes that do not match the brand.
- When creating new components, match the styling tone: clean, minimal, trustworthy, and professional.
- Prefer soft backgrounds and strong dark text, rather than heavy gradients or overly saturated colors.

This palette should guide component styling, cards, badges, buttons, section dividers, and any design mockups generated for the project.

## Project structure

- `app/` contains routes, page components, and API handlers.
- `app/api/` contains server-side route handlers for all backend endpoints.
- `app/middleware/` contains auth guard middleware such as `isloggedin.ts` and `isadmin.ts`.
- `components/` contains reusable UI components.
- `components/ui/` contains shadcn-style reusable presentational pieces.
- `lib/` contains shared utilities and integrations like MongoDB, Redis, ImageKit, and helper logic.
- `modal/` contains Mongoose models and schemas.
- `types/` contains shared TypeScript type definitions.
- `public/` contains static assets and image files.

Keep business logic close to the relevant route or model, and do not scatter database logic across components.

## Coding standards

### TypeScript

- Prefer TypeScript for all new code.
- Use correct types instead of `any` when possible.
- Keep interfaces explicit for models, request payloads, and route responses.
- When a value can be unknown, narrow it before use.

### Next.js patterns

- Use App Router conventions from this project.
- Keep route handlers in `app/api/.../route.ts`.
- Use `NextResponse.json()` for API responses.
- Handle errors consistently with status codes and human-readable messages.
- Prefer server-side validation before DB writes.

### API route behavior

- Validate request payloads carefully before writing to MongoDB.
- Check authentication/authorization before handling protected actions.
- Return `401` for token/session problems and `403` for unauthorized access.
- Return `400` for malformed or invalid input.
- Keep responses predictable and consistent.

### Auth and authorization

- Token validation is a first-class concern.
- Use existing login and middleware patterns instead of creating custom auth flows without checking project conventions.
- For admin-only endpoints, explicitly verify role access before allowing actions.
- Never trust client-side values for permission checks.

### Database and cache

- Reuse the MongoDB connection helper from `lib/monodb.ts`.
- Avoid repeated ad-hoc connection logic across routes.
- Keep Redis usage focused on fast reads or short-lived cache scenarios.
- Do not use Redis to decide booking validity; validation must happen against real database state.
- If a route fetches venue data, ensure the cache behavior remains consistent with the project’s current design.

### Model conventions

- Place Mongoose schemas in `modal/` files.
- Use timestamps when appropriate.
- Keep validation rules aligned with the actual business rules.
- Venue capacity, booking attendance, and resource validation should match the real app domain.

## Booking and business rules

When implementing or modifying booking logic, preserve these rules:

- A booking request must validate the user is authenticated.
- The venue must exist.
- The date cannot be in the past.
- Attendance must not exceed venue capacity.
- Requested equipment must be supported and available at that venue.
- Bookings should check for overlapping bookings before approving or saving.
- Booking status should remain consistent with existing domain values such as `pending`, `approved`, `rejected`, `cancelled`, and `completed`.

Do not weaken validation or bypass checks in favor of convenience.

## Frontend conventions

- Build UI in React with clear, reusable components.
- Prefer Tailwind utility classes for styling.
- Keep components focused and readable.
- Reuse existing design patterns from the project instead of introducing new visual systems unless necessary.
- Keep route pages and feature logic understandable to a student/admin product team.

## Data and naming conventions

- Use clear names that match the domain: `venue`, `booking`, `user`, `resources`, `capacity`, `status`.
- Prefer existing naming patterns already used in the project.
- Keep file names and folder names consistent with the current codebase.
- Preserve case conventions already used in the project.

## Security and quality checklist

Before finalizing an implementation, check:

- Are all user inputs validated?
- Is auth required where it should be?
- Is admin-only logic protected?
- Are database writes guarded by proper checks?
- Are error messages appropriate and not leaking sensitive internals?
- Does the change maintain the current architecture and avoid unnecessary abstraction?
- Are there any obvious lint or type issues?

## Preferred implementation approach

- Prefer minimal, focused changes over broad rewrites.
- Reuse existing helpers and middleware instead of creating duplicate logic.
- Match the style and conventions already in this repo.
- Keep business logic explicit and easy to review.
- When adding new API behavior, also consider the frontend that consumes it.

## Validation commands

For local verification of code changes, use the project scripts as the baseline:

```bash
npm run lint
npm run build
```

If a task involves a specific endpoint or feature, validate it with the relevant route behavior and confirm the result is consistent with the app’s existing patterns.

## What to avoid

- Do not hardcode admin bypasses or skip auth checks.
- Do not trust client data for critical decisions.
- Do not create custom database patterns if a model or helper already exists.
- Do not introduce heavy framework patterns or architectural changes without a clear reason.
- Do not add unrelated dependencies or complexity for minor tasks.
- Do not break existing route naming or API contracts unless the change is intentional and clearly scoped.

## Working style for Copilot

When generating code for this repo:

- Keep the solution aligned with the current codebase, not generic JavaScript examples.
- Prefer small, realistic changes that fit the existing architecture.
- Use existing modules, naming, and patterns already present in the project.
- Suggest fixes that are easy for a student team to maintain and understand.
- If the task is ambiguous, prefer the simplest correct implementation consistent with the product requirements.

This project is a real campus booking app, so reliability, validation, and access control matter more than clever shortcuts.
