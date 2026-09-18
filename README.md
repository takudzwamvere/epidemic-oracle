# 🌐 Epidemic Oracle

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Machine Learning Powered epidemic prediction and outbreak surveillance platform for Southern and Central Africa.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.17.0
- npm, pnpm, or yarn

### Installation & Development Server

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

## 🏗️ Architecture & Features

- **Outbreak Forecasting:** Time-series analysis and ARIMA-based predictive modeling for regional epidemics (Cholera, Malaria, COVID-19, Typhoid).
- **Surveillance Dashboards:** Interactive maps, risk stratification metrics, and automated alert generation.
- **Role-Based Access Control:** Strict permission routing for SuperAdmin, Admin, and User roles with guest evaluation access.
- **Normalized Data Pipeline:** Uniform CSV ingestion engine with country and sub-national aggregation.

## 🛡️ Security & Architecture Enhancements

- **Role-Based Middleware Redirections:** Enforces strict access control, blocking unauthorized routes.
- **Backend API Route Hardening:** Protected CRUD endpoints under `/api/users` and `/api/users/[id]`.
- **Decoupled Outbreak Alerts API:** REST endpoints `/api/notifications` and `/api/notifications/read`.
- **Design Language Alignment:** Consistent slate/blue palettes, border hierarchy, and responsive UI components.

## 📦 Deployment

Optimized for deployment on [Vercel](https://vercel.com). Refer to [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for details.
