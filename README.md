# AI Studio

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

- `pnpm run dev`: Starts the application in development mode.
- `pnpm run build`: Creates an optimized production build of your application.
- `pnpm run start`: Starts a Node.js server for the production build.
- `pnpm run lint`: Runs ESLint to identify and fix linting errors.

## Tech Stack

- **Framework**: Next.js 15
- **UI**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Notifications**: Sonner

## Project Structure

```
├── app/                 # Next.js app router
├── components/          # React components
├── lib/                 # Utilities (image processing, API, storage)
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── constants/           # App constants and configuration
```

## Build

To create a production-ready build, run the following command:

```bash
pnpm run build
```

This command bundles your application for production, optimizing it for the best performance. The build artifacts will be stored in the `.next` directory.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), from the creators of Next.js.

Vercel provides an out-of-the-box deployment experience for Next.js applications, with features like automatic scaling and continuous deployment from your Git repository. Alternatively, Next.js can be deployed on any platform that supports Node.js, Docker, or static site hosting.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
