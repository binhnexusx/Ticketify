# 🏨 Ticketify — Hotel Booking App
**Ticketify** is a modern hotel booking web application that allows users to browse, book, and manage hotel room reservations. The project is built using **React**, **TypeScript**, **Tailwind CSS**, and follows best practices for code quality, scalability, and team collaboration.
---
## 🚀 Tech Stack
- ⚛️ React 19 — UI framework
- ⚡ Vite — Next-gen front-end build tool
- 📦 PNPM — Fast, disk-efficient package manager
- ✅ ESLint + Prettier — Code linting and formatting
- 🐶 Husky
---
## 🛠️ Getting Started
### 1. Clone the repository
```bash
git clone https://gitlab.zimaw.com/binh.hoang/ticketify_fe.git
cd ticketify_fe
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Start the development server
```bash
pnpm dev
```
### 📁 Project Structure

```bash
src/
├── assets/        # Images, icons, fonts
├── components/    # Reusable UI components
├── constants/     # Static values (e.g., roles, routes)
├── hooks/         # Custom React hooks
├── layouts/       # Common layout wrappers (AuthLayout, MainLayout, etc.)
├── pages/         # Route-based page components
├── routes/        # Route definitions and guards
├── services/      # API services (e.g., Axios setup)
├── store/         # Global state management (e.g., Zustand, Redux)
├── types/         # TypeScript types/interfaces
├── utils/         # Helper functions (formatters, validators)
├── App.tsx        # Main App component
└── main.tsx       # App entry point
### Code Style & Conventions
This project uses ESLint, Prettier, and (optional) Husky for clean and consistent code.
    Lint & Format Rules
        ✔️ Semicolons: Required
        ✔️ Quotes: Use 'single' quotes
        ✔️ Indentation: 2 spaces
        ✔️ File/Folder naming: kebab-case
        ✔️ Variables & functions: camelCase
        ✔️ Components & types: PascalCase
```

# 📦 Commit Message Guidelines
To ensure consistency and clean version history, **all commits in this project must follow the convention below**.  
⚠️ Commits not following the correct format will be blocked by Husky + Commitlint.
## ✅ Commit Format
- `type`: the type of change
- `message`: a brief summary of what was done
---
## 🔖 Allowed Commit Types
| Type       | Description                                           | Example commit message                        |
|------------|-------------------------------------------------------|------------------------------------------------|
| `feat`     | Adding a new feature                                  | `feat: Add login functionality`               |
| `fix`      | Fixing a bug                                          | `fix: Resolve token expiration issue`         |
| `refactor` | Code improvements without changing behavior           | `refactor: Optimize login API call`           |
| `style`    | UI, styles, CSS, layout (no logic changes)            | `style: Update button hover effect`           |
| `docs`     | Documentation changes (README, comments, etc.)        | `docs: Add commit guidelines to README`       |
| `update`   | General updates or enhancements                       | `update: Modify user role management`         |
| `remove`   | Removing code, features, or files                     | `remove: Delete old auth service`             |
---
## 🚀 Branch Naming Convention
Please name your branches like this:
| Branch Type | Description                        | Example                    |
|-------------|------------------------------------|----------------------------|
| `feature/`  | Developing a new feature           | `feature/login-page`       |
| `fix/`      | Fixing bugs                        | `fix/navbar-toggle`        |
| `refactor/` | Code cleanup or optimization       | `refactor/form-handler`    |
| `chore/`    | Misc tasks (e.g. config updates)   | `chore/cleanup-imports`    |
| `test/`     | Test-related changes               | `test/user-service`        |
| `docs/`     | Documentation changes              | `docs/update-readme`       |
| `release/`  | Preparing a release version        | `release/v1.0.0`           |
---
## 💡 Quick Reference
| Action               | Command                                             |
|----------------------|-----------------------------------------------------|
| Create a branch      | `git checkout -b feature/login-page`               |
| Commit new feature   | `git commit -m "feat: Implement login UI"`         |
| Commit a bug fix     | `git commit -m "fix: Fix crash on invalid token"`  |
| Commit refactor      | `git commit -m "refactor: Clean up auth flow"`     |
| Commit documentation | `git commit -m "docs: Add setup instructions"`     |
You don’t need to configure anything manually. Just use the correct format when committing.
---
