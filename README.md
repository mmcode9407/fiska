# Fiska

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

Fiska is a web application designed to facilitate the creation of educational flashcards. The application supports both AI-generated flashcards and manual creation, enabling users to quickly generate high-quality study cards. With features such as text pasting, inline flashcard review and editing, as well as a simple registration and login system, Fiska aims to enhance the learning experience through effective spaced repetition techniques.

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind CSS 4, Shadcn/ui
- **Backend:** Supabase for database and authentication
- **AI Integration:** Openrouter.ai for accessing various AI models
- **Testing:**
  - **Unit and Integration Tests:** Vitest, React Testing Library, MSW (Mock Service Worker)
  - **E2E Tests:** Playwright (cross-browser testing with Chromium, Firefox, WebKit support)
- **CI/CD & Hosting:** GitHub Actions and DigitalOcean

## Getting Started Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mmcode9407/fiska.git
   cd fiska
   ```

2. **Node Version:**

   Ensure you are using the Node version specified in the [.nvmrc](./.nvmrc) file. Currently it's **22.14.0**.

   ```bash
   nvm use
   ```

3. **Installation:**

   ```bash
   npm install
   ```

4. **Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the project for production.
- `npm run preview` - Previews the production build.
- `npm run astro` - Runs Astro-specific commands.
- `npm run lint` - Lints the project files.
- `npm run lint:fix` - Automatically fixes linting errors.
- `npm run format` - Formats the codebase using Prettier.

## Project Scope

Fiska covers the following key functionalities:

- **Flashcard Generation:**
  - AI-powered generation from text input (1000 to 10000 characters).
  - Inline review and editing with options to accept or reject generated flashcards. Only accepted flashcards are saved.
- **Manual Flashcard Creation:**
  - A dedicated button to create a new flashcard.
  - Form fields for "front" (up to 200 characters) and "back" (up to 500 characters).
- **Flashcard Management:**
  - Viewing, editing, and deleting saved flashcards in the "My Flashcards" view.
- **User Account Management:**
  - Registration and login functionality with email confirmation.
  - Secure access ensuring that flashcards are available only to authenticated users.
- **Spaced Repetition Integration:**
  - Accepted flashcards are seamlessly integrated with an external spaced repetition algorithm to boost learning efficiency.

## Project Status

Fiska is currently in the MVP stage and under active development.

## License

This project is licensed under the MIT License.
