# Leben Brewing Co - Bar Menu Website

A responsive bar menu website with Firebase backend for managing menu items. Features a public-facing menu and an admin dashboard for CRUD operations.

## Features

- **Public Menu**: Dark-themed menu matching the original PDF design
- **Admin Dashboard**: Manage menu items (add, edit, delete)
- **Firebase Integration**: 
  - Firestore for menu data storage
  - Firebase Authentication for admin access
- **Responsive Design**: Mobile-first design that works on all devices

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firestore Database**:
   - Go to Firestore Database in the left sidebar
   - Click "Create database"
   - Start in production mode
   - Choose your preferred location
4. Enable **Authentication**:
   - Go to Authentication in the left sidebar
   - Click "Get started"
   - Enable "Email/Password" sign-in method
5. Create an admin user:
   - Go to Authentication > Users
   - Click "Add user"
   - Enter email and password for your admin account
6. Get your Firebase config:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Copy the config values

### 2. Environment Variables

1. Copy `.env.example` to `.env.local`:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Fill in your Firebase configuration values in `.env.local`

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the public menu.

### 5. Access Admin Dashboard

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Sign in with the admin credentials you created in Firebase
3. Manage menu items from the dashboard

## Firestore Data Structure

### Collection: `menuItems`

Each document contains:
- `name` (string): Item name
- `description` (string): Item description
- `price` (string): Price with currency symbol
- `category` (string): Menu category (e.g., "Para Picar", "Pizzas", "Cervezas")
- `vegetarian` (boolean): Whether the item is vegetarian

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Public menu page
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard
│   │   └── login/
│   │       └── page.tsx      # Admin login
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   └── firebase.ts           # Firebase configuration
└── components/
    └── ui/                   # shadcn/ui components
\`\`\`

## Technologies Used

- **Next.js 15** - React framework
- **Firebase** - Backend services (Firestore + Auth)
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **TypeScript** - Type safety

## License

MIT
