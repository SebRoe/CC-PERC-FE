# CC-PERC Frontend

Modern React frontend for CC-PERC (Content Clarity - Perception) - AI-powered homepage analysis tool.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **HeroUI** component library (v2)
- **Tailwind CSS** for styling
- **Tanstack Query** for data fetching
- **React Router** for navigation
- **Framer Motion** for animations

## Prerequisites

- **Node.js 20+** with npm
- Backend API running at http://localhost:8000

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Ensure VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Development: http://localhost:5173
   - Production build preview: `npm run preview`

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── analysis/   # Analysis-specific components
│   ├── auth/       # Authentication components
│   ├── common/     # Shared components
│   └── layout/     # Layout components
├── hooks/          # Custom React hooks
├── lib/           # API clients and utilities
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── styles/        # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript compiler check

## Key Features

- **Authentication**: JWT-based auth with httpOnly cookies
- **Dashboard**: View all homepage analyses
- **Analysis**: Submit URLs for AI-powered analysis
- **Human vs AI View**: See what AI agents can and cannot perceive
- **SEO Analysis**: Comprehensive technical SEO audit
- **Interactive Reports**: Downloadable analysis reports

## Development Tips

### API Integration
The API client is configured in `src/lib/api-client.ts` with automatic token refresh on 401 errors.

### State Management
- Authentication state: Context API (`src/contexts/AuthContext.tsx`)
- Server state: Tanstack Query with custom hooks
- UI state: Local component state with useState

### Styling
- Use Tailwind CSS utility classes
- HeroUI components for consistent design
- Custom components in `src/components/common`

### Type Safety
- All API responses have TypeScript interfaces
- Use `src/types` for shared type definitions
- Enable strict mode in `tsconfig.json`

## Production Build

```bash
# Build the application
npm run build

# Preview the build locally
npm run preview

# Deploy the dist/ folder to your hosting provider
```

## Troubleshooting

### CORS Issues
Ensure backend CORS settings include your frontend URL in `main.py`.

### Authentication Errors
Check that cookies are enabled and the API base URL is correct in `.env`.

### Build Errors
Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Add types for new features
4. Test on both development and production builds

---

Part of the CC-PERC project. See the [main README](../../../README.md) for full documentation.