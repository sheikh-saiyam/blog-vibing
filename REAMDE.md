# Blog Vibing - Modern Blog Frontend

A premium, high-performance blog frontend application designed for a seamless reading and writing experience. Built with the latest generic web technologies, this project focuses on speed, accessibility, and a modern aesthetic.

> **Developed by [Sheikh Saiyam](https://github.com/sheikh-saiyam)**

## 🚀 Key Features

### 🌟 Core Experience

- **Modern Tech Stack**: Powered by **Next.js 16** and **React 19** for server-side rendering and high performance.
- **Premium UI/UX**: Beautifully designed interface with **Tailwind CSS 4** and **Radix UI** primitives.
- **Smooth Animations**: Fluid interactions and page transitions powered by **Framer Motion**.
- **Dark Mode Support**: Fully integrated theme switching (Light/Dark) via `next-themes`.

### ⚡ Functionality

- **Authentication & Security**: Secure user authentication (Login/Register) featuring `better-auth`.
- **User Dashboard**: Dedicated dashboard for users to manage their profiles and content.
- **Admin Panel**: Administrative tools for content moderation and platform management.
- **Post Management**: Create, edit, and delete blog posts with a intuitive editor.
- **Data Visualization**: Interactive charts and analytics powered by `recharts`.
- **Infinite Scroll**: Seamless content browsing with optimized data fetching.
- **Smart Form Handling**: Type-safe forms with `react-hook-form` and `zod` validation.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Core**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI concepts](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Utilities**: `date-fns`, `clsx`, `tailwind-merge`

## 📂 Project Structure

A quick look at the top-level structure of the application:

```bash
src/
├── app/          # Next.js App Router (Pages: Login, Dashboard, Posts, etc.)
├── components/   # Reusable UI components (Buttons, Cards, Modals)
├── hooks/        # Custom React hooks for logic reuse
├── lib/          # API configuration, Auth setup, and utilities
├── styles/       # Global styles and Tailwind configuration
└── types/        # TypeScript interfaces and types
```

## ⚙️ Environment Variables

To run this project efficiently, you need to configure the following environment variables. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000  # URL of your backend API
```

## ⚡ Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (Preferred package manager)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sheikh-saiyam/blog-vibing.git
    cd blog-frontend-app
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file as shown in the configuration section above.

### Running Development Server

Start the application in development mode:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

Create an optimized production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## 📜 Available Scripts

| Command      | Description                                          |
| :----------- | :--------------------------------------------------- |
| `pnpm dev`   | Starts the development server with hot reloading.    |
| `pnpm build` | Builds the application for production usage.         |
| `pnpm start` | Serve the production build locally.                  |
| `pnpm lint`  | Runs ESLint to identify and fix code quality issues. |

---

_Made with ❤️ by Sheikh Saiyam_
