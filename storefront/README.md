# Saleor Storefront

Modern, responsive ecommerce storefront built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Server-side rendering with Next.js 14
- TypeScript for type safety
- Tailwind CSS for styling
- Apollo Client for GraphQL
- Responsive design
- Product catalog with categories
- Product detail pages
- Shopping cart
- Modern UI/UX

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Saleor API running (see main README.md)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Homepage
│   ├── products/     # Product pages
│   ├── categories/   # Category pages
│   └── cart/         # Shopping cart
├── components/       # Reusable React components
├── lib/             # Utilities and configurations
└── types/           # TypeScript type definitions
```

### Customization

#### Styling

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

#### Components

All components are in `src/components/`. Edit them to change the UI.

#### API Queries

GraphQL queries are in `src/lib/queries.ts`. Add or modify queries as needed.

## Building for Production

```bash
npm run build
npm run start
```

The optimized production build will be available on port 3000.

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql/
```

For production, update to your actual API URL.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Saleor Documentation](https://docs.saleor.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Apollo Client](https://www.apollographql.com/docs/react/)
