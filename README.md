This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🛡️ Security Enhancements (July 2026)

The following security and code quality improvements have been implemented:
* **Role-Based Middleware Redirections:** Enforce strict access control, blocking non-superadmins from `/superadmin/*` routes and non-admins/non-superadmins from `/admin/*` routes.
* **Backend API Route Hardening:** Restrict all CRUD endpoints under `/api/users` and `/api/users/[id]` exclusively to the `SUPERADMIN` role.
* **Client-Side Layout Redirection Fallbacks:** Correctly display the user's role and handle redirect checks gracefully in `AdminLayout` and `SuperAdminLayout`.
* **Pruning Unused Libraries & Files:** Removed obsolete Resend, simpleEmailService, and EmailJS integrations, along with pruning `@google/generative-ai` and `@emailjs/browser` packages.
* **Refactored Code Duplication:** Centralized the `useTypewriter` hook into a common utility under `lib/hooks.ts` across 5 pages.

