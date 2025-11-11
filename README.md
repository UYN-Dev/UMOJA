This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
# UMOJA - Unity. Culture. Legacy.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to shared API keys (ask team lead)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd UMOJA_FINAL
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your `.env.local` file with the actual API keys (get these from your team lead or shared password manager):
   - Clerk keys (authentication)
   - Supabase keys (database)
   - OpenAI key (assessment analysis)

### 4. Set up the database
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL files in order:
   - `database_setup.sql` - Creates the database schema
   - `populate_assessments.sql` - Populates assessment data (if needed)

### 5. Run the development server
```bash
npm run dev
```

### 6. Open the app
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting
- **Missing environment variables**: Make sure all keys in `.env.local` are filled in
- **Database connection errors**: Verify Supabase keys are correct and database is set up
- **Authentication errors**: Check Clerk keys are correct
