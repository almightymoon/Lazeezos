# Lazeezos - Folder Structure

This document describes the folder structure of the Lazeezos project, organized to match best practices and maintainability.

```
lazeezos/
│
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── (routes)/                           # Application routes
│   │   │   ├── login/                          # User login page
│   │   │   ├── signup/                         # User signup page
│   │   │   ├── partner/                        # Partner/Restaurant pages
│   │   │   │   ├── login/                      # Partner login
│   │   │   │   ├── signup/                     # Partner signup
│   │   │   │   └── page.tsx                    # Partner landing page
│   │   │   ├── rider/                          # Rider pages
│   │   │   │   ├── login/                      # Rider login
│   │   │   │   ├── signup/                     # Rider signup
│   │   │   │   └── page.tsx                    # Rider landing page
│   │   │   ├── page.tsx                        # Home page
│   │   │   ├── layout.tsx                      # Root layout
│   │   │   └── globals.css                     # Global styles
│   │   │
│   │   ├── helpers/                            # Helper functions
│   │   │   └── (helper files)
│   │   │
│   │   └── utils/                              # Utility functions
│   │       └── (utility files)
│   │
│   ├── components/                             # React Components
│   │   ├── Header/                             # Header component
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Cart/                               # Cart component
│   │   │   ├── Cart.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Restaurant/                         # Restaurant components
│   │   │   ├── RestaurantCard.tsx
│   │   │   ├── RestaurantMenu.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Filter/                             # Filter components
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── CategoryBar.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── figma/                              # Figma-related components
│   │   │   └── ImageWithFallback.tsx
│   │   │
│   │   └── ui/                                 # UI component library (Shadcn)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sonner.tsx
│   │       └── ... (other UI components)
│   │
│   ├── lib/                                    # Library utilities
│   │   ├── db.ts                               # Database connection (Prisma)
│   │   ├── db-queries.ts                       # Database query functions
│   │   └── redis.ts                            # Redis connection and services
│   │
│   ├── Modules/                                # Feature Modules
│   │   └── (feature modules - to be organized)
│   │
│   └── styles/                                 # Additional styles
│       ├── fonts.css
│       └── theme.css
│
├── prisma/                                     # Prisma ORM
│   └── schema.prisma                           # Database schema
│
├── public/                                     # Public static assets
│   └── lazeezos_icon.png                       # App icon/logo
│
├── .env                                        # Environment variables
├── .gitignore                                  # Git ignore rules
├── package.json                                # NPM dependencies
├── tailwind.config.js                          # Tailwind configuration
├── tsconfig.json                               # TypeScript configuration
└── next.config.js                              # Next.js configuration
```

## Structure Overview

### **App Directory** (`src/app/`)
- **Routes**: All Next.js pages and routes
  - `page.tsx` - Home page
  - `login/` - User login
  - `signup/` - User signup
  - `partner/` - Partner/Restaurant pages
  - `rider/` - Rider pages
- **Helpers**: Helper functions for app logic
- **Utils**: Utility functions

### **Components Directory** (`src/components/`)
- **Organized by Feature**: Components grouped by functionality
  - `Header/` - Header component
  - `Cart/` - Shopping cart component
  - `Restaurant/` - Restaurant-related components
  - `Filter/` - Filter and category components
  - `figma/` - Figma-related components
  - `ui/` - UI component library (Shadcn UI)
- **Index Files**: Each component folder has an `index.ts` for clean imports

### **Library Directory** (`src/lib/`)
- **Database**: Prisma client and queries
- **Redis**: Redis connection and service layers
- **Utilities**: Shared utility functions

### **Modules Directory** (`src/Modules/`)
- **Feature Modules**: Self-contained modules for major features
- To be organized as features are developed

## Import Patterns

### Components
```typescript
// From components directory
import { Header } from '@/components/Header';
import { Cart, CartItem } from '@/components/Cart';
import { RestaurantCard, Restaurant } from '@/components/Restaurant';
import { FilterSidebar, FilterOptions } from '@/components/Filter';
import { Button } from '@/components/ui/button';
```

### Library
```typescript
// From lib directory
import { prisma } from '@/lib/db';
import { redisClient } from '@/lib/redis';
```

## Benefits of This Structure

1. **Separation of Concerns**: Components are separate from app routes
2. **Scalability**: Easy to add new features and modules
3. **Maintainability**: Clear organization makes code easier to find and maintain
4. **Reusability**: Components can be easily imported across the app
5. **Type Safety**: TypeScript imports work seamlessly with the structure


