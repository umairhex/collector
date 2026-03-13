# Collector

## Core Idea

### Problem

Knowledge workers, developers, and writers accumulate notes, ideas, and reference material across multiple applications — sticky notes, text files, browser bookmarks, messaging apps, and various note-taking tools. Each tool stores data differently, search works inconsistently across them, and none offers a premium, distraction-free writing experience combined with intelligent organization. Existing solutions like Notion or Obsidian are feature-heavy and opaque about data ownership. There is no lightweight, self-hosted, private note vault that combines a polished writing experience with AI-powered editing and instant search — all under the user's complete control.

### Solution

Collector is a minimalist, high-performance personal knowledge base. It provides a single-user vault with a rich text editor (TipTap/ProseMirror), dynamic categories, real-time search, AI-powered text enhancement (via OpenRouter supporting multiple LLM models), and shareable note links. Everything is self-hosted — the user owns their data, controls their AI provider, and runs the system on their own infrastructure. The vault-style setup (credentials created on first visit) ensures the experience is private by design.

### Value

Collector delivers the writing and organization quality of premium note-taking apps while keeping data under complete user control. The AI editing capability (grammar, clarity, rewriting) works across multiple LLM models through OpenRouter, giving users flexibility without vendor lock-in. URL-driven state makes every view bookmarkable and shareable. The optimistic UI with debounced auto-save ensures the writing experience feels instant while maintaining data integrity through conflict detection.

### User Outcome

A user deploys the application, creates their credentials on first visit, and immediately begins capturing notes in a polished rich text editor. Notes are categorized, searchable in real-time, and auto-saved in the background. When a passage needs polishing, the AI Fix button rewrites it for clarity using whichever LLM the user prefers. Individual notes can be shared via public URLs. The experience is fast, private, and entirely self-contained.

---

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB, Mongoose
- **AI/LLM**: OpenRouter (Multi-model)
- **Rich Text Editor**: TipTap
- **UI Components**: Radix UI, Lucide React, Sonner
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Client Storage**: IndexedDB (idb-keyval)
- **Form Validation**: Zod
- **Libraries**: React Hook Form, React Resizable Panels, Use Debounce, Crypto-js

---

## Key Features

### Rich Text Editor

#### Purpose

Provide a premium writing experience that supports structured content without the complexity of a full document editor.

#### Capabilities

- TipTap/ProseMirror-based editor with heading levels, bold, italic, and text formatting
- Image embedding with base64 encoding (no external image hosting required)
- Character count display for content awareness
- Formatting toolbar with intuitive controls
- Clean, distraction-free writing surface

#### User Benefit

Notes support rich formatting for structured thinking and reference material, with a writing experience that feels polished and responsive rather than utilitarian.

---

### AI Text Enhancement

#### Purpose

Enable intelligent editing and rewriting without leaving the note-taking environment.

#### Capabilities

- AI Fix button that sends selected text (or full note content) to an LLM for grammar and clarity enhancement
- OpenRouter integration supporting multiple model providers: Google Gemini, Anthropic Claude, OpenAI GPT-4o-mini, Meta Llama, and Mistral
- User-configurable model selection from settings
- API key stored client-side only (never persisted to the server)

#### User Benefit

Users polish their writing with AI assistance using whichever model they prefer, without switching to a separate tool or exposing their content to a centralized service they do not control.

---

### Instant Search and Organization

#### Purpose

Make every note findable within milliseconds as the collection grows.

#### Capabilities

- Real-time search across note titles and content with instant filtering
- URL-synced search state via nuqs (search query, active note, and category all reflected in URL parameters)
- Dynamic user-created categories with fallback defaults (General, Ideas, Work)
- Category-based filtering for focused browsing
- Bookmarkable and shareable view states through URL parameters

#### User Benefit

Finding any note is instant regardless of collection size, and URL-driven state means specific views can be bookmarked or shared directly.

---

### Shareable Notes and Auto-Save

#### Purpose

Enable selective sharing of individual notes while ensuring no work is ever lost.

#### Capabilities

- Per-note shareable toggle generating public URLs at `/notes/[id]`
- Read-only public view with SEO metadata for shared notes
- Optimistic UI with debounced auto-save (changes sync in background)
- Conflict detection comparing `updatedAt` timestamps before syncing
- Clipboard integration with `Alt+V` shortcut and toast feedback

#### User Benefit

Notes save automatically without manual action, conflicts are detected before data is overwritten, and individual notes can be shared publicly when needed without exposing the entire vault.

---

## System Structure

### User Interface

The main workspace uses a resizable panel layout: a sidebar with category filters and note list on the left, and the rich text editor on the right. The interface follows a dark-mode-first design with glassmorphism effects and radial gradients. A settings page provides credential management and AI model configuration. PWA support enables standalone installation for a native app feel.

### Data Layer

The system stores notes (title, HTML content, category, shareable flag), categories (user-created with unique names), and settings (username, password hash, session token, AI model preference). MongoDB serves as the server-side database. TanStack Query with IndexedDB persistence (via idb-keyval) provides client-side caching for offline-first behavior.

### Access Model

Authentication is custom and vault-style — no OAuth or third-party auth. On first visit with zero users, the system redirects to a setup page for initial credential creation. Login uses username and password verified with bcrypt, generating a SHA-256 session token stored as an httpOnly secure cookie with 30-day expiry. Every API route validates the session cookie against the database. Credential updates regenerate the session token for security rotation.

### Persistence

Server-side data persists in MongoDB, accessible from any device after authentication. Client-side TanStack Query persistence to IndexedDB provides fast loading and potential offline access. Service worker registration supports PWA capabilities. The OpenRouter API key is stored only in localStorage (client-side), never sent to the server database.

---

## User Workflow

### Entry

On first launch, the system detects zero users and redirects to the setup page where the user creates their credentials. Subsequent visits present a login screen. After authentication, the vault workspace loads with any existing notes and categories.

### Creation

Users create notes assigned to categories through the editor. New categories are created on the fly. The rich text editor supports formatted content including headings, images, and styled text. Auto-save ensures content persists without manual action.

### Organization

Notes are organized into user-created categories. The sidebar provides category-based filtering for focused browsing. Search matches across titles and content in real-time. URL parameters preserve the current view state.

### Retrieval

Real-time search finds notes instantly. Category filters narrow the view. URL-driven state means specific searches and note selections are bookmarkable. The resizable panel layout allows simultaneous browsing and editing.

### Reuse

Selected text can be polished with AI before incorporation into other work. Shareable notes generate public URLs for reference sharing. Clipboard integration with keyboard shortcuts enables quick content extraction. The PWA installation provides quick-launch access from the device home screen.

---

## Documentation / Support Layer

### Purpose

Help users set up their private vault and understand the writing and organization workflow.

### Contents

- Setup flow guidance for first-time credential creation
- Editor features and formatting capabilities
- AI model configuration and OpenRouter API key setup
- Category management and search usage
- Note sharing and public URL generation
- PWA installation instructions

### User Benefit

Users configure and adopt the full feature set quickly, with particular guidance on AI setup (OpenRouter key, model selection) which requires external configuration.

---

## Product Positioning

### Category

Personal knowledge management — self-hosted note-taking vault with AI enhancement.

### Scope

Focuses on capturing, organizing, searching, and polishing personal notes with AI assistance. Intentionally avoids becoming a team collaboration tool, project manager, or document publishing platform. The product is a single-user private vault that excels at fast, AI-enhanced note management.

### Primary Users

Individual developers, writers, and knowledge workers who want a self-hosted, private note-taking tool with a premium aesthetic, AI-powered editing, and complete data ownership — essentially a personal Notion or Obsidian alternative deployed on their own infrastructure.

### Core Value Proposition

A self-hosted personal knowledge vault combining a polished rich text editor with model-agnostic AI enhancement, real-time search, and URL-driven state — where the user owns every byte of data and controls every aspect of the system.
