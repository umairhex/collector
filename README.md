# Collector

A high-performance, minimalist personal knowledge base.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## Features

- **Instant Search**: Real-time filtering across titles and content.
- **Dynamic Categories**: Automatically derives categories from your notes or create new ones instantly.
- **Optimistic UI**: No loading spinners for saving; changes are synced in the background with debounced persistence.
- **Smart Clipboard**: Integrated cross-platform copy/paste with toast feedback.
- **Premium UX**: Dark-mode first design with glassmorphism, radial gradients, and fluid micro-animations.
- **Responsive Layout**: Fully optimized for mobile and desktop using a modular sidebar system.

## Tech Stack

![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=react-query&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-9-880000?style=flat-square&logo=mongoose&logoColor=white)
![nuqs](https://img.shields.io/badge/nuqs-2-black?style=flat-square)
![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-white?style=flat-square&logo=radix-ui&logoColor=black)
![Lucide](https://img.shields.io/badge/Lucide-Icons-pink?style=flat-square)

## Getting Started

1.  **Clone & Install**:

    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env` file:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    ```

3.  **Run Development**:
    ```bash
    npm run dev
    ```

## Architecture Best Practices

The project follows **Vercel React Best Practices**:

- Granular component extraction to minimize re-renders.
- Optimized package imports for `lucide-react` and UI components.
- Functional state updates to prevent stale closures.
- URL-driven state management for shareable views.

---

Built with focus and precision.
