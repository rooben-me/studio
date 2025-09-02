# Studio - Ruban Assignment

## Screenshots

<img width="1152" height="576" alt="484111330-3e134f03-d27e-4c15-8e25-3a9dfbdf7a4c (1) (1)" src="https://github.com/user-attachments/assets/a75b7b5c-d1a9-4663-8d44-ba5dbaa3eacd" />
<img width="1151" height="612" alt="484111398-a3f4b812-8ee4-425e-928d-f192c2ddafe9 (1)" src="https://github.com/user-attachments/assets/01c8fdc2-375f-4e7d-af12-9ccb888222da" />

## TODOs

- [x] ~~The image generated from the Gemini API gives a huge file (more than 3MB) and is not downscaled. As we are currently storing it in local storage, this is causing an issue and needs to be handled.~~
- [x] ~~Improve homepage styling.~~
- [x] ~~Fix some capitalization issues in the history badges.~~
- [x] ~~Remove the small image upload component (This was kept for the task selector feature, but we can remove this for now).~~
- [ ] Add a task selector ( like a carousel ) on the home page instead of showing the image upload in the beginning of the user journey.
- [ ] Add suggested autocomplete to the input prompt based on the task selected (e.g., if "change color" is selected, show a colors dropdown. if "change background" is selected, have a popover with a variety of backgrounds, etc.).

### Future

- [ ] Connect a DB, add authentication and add a rate limiter.

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

### API Configuration

This application supports two API modes:

1. **Mock API**: Uses a simulated API with random delays and responses for testing
2. **Gemini API** (default): Uses Google's Gemini 2.5 Flash Image Preview model through OpenRouter for actual image generation

To use the Gemini API, create a `.env.local` file in the project root:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get your API key from [OpenRouter](https://openrouter.ai/keys).

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Using the Application

1. Upload an image using the image upload area
2. Enter a prompt describing what you want to change
3. Select a task type (optional)
4. Use the API mode toggle in the top right to switch between Mock and Gemini modes
5. Click generate to process your image

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
- **AI**: Google Gemini 2.5 Flash Image Preview (via OpenRouter)
- **API**: Mock API for testing + Real Gemini API through OpenRouter

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
