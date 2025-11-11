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

## Clerk Webhook: Sync User Deletions with Supabase

When a Clerk user is deleted, this app automatically deletes the corresponding row in the Supabase `users` table (and, thanks to `ON DELETE CASCADE`, removes all related records).

### 1. Environment Variables

Add the following to your `.env.local` file:

```
CLERK_WEBHOOK_SECRET=whsec_xxx            # Clerk Dashboard → Webhooks → your endpoint → Signing secret
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
```

### 2. Webhook Endpoint (already implemented)

- **Location:** [`app/api/webhooks/clerk/route.ts`](app/api/webhooks/clerk/route.ts)
- **Platform:** Node.js
- **What it does:**  
  - Verifies incoming webhook requests using Svix signature
  - Deletes the Supabase user matching the Clerk `id` (`clerk_id`)
  - Optionally syncs email updates

### 3. Setting Up the Clerk Webhook

1. Go to **Clerk Dashboard** → Your app → **Webhooks** → **Add endpoint**
2. Use these URLs:
    - **Production:** `https://your-domain.com/api/webhooks/clerk`
    - **Local Dev (ngrok):**
        - Start your app: `npm run dev` (at `localhost:3000`)
        - Start ngrok: `ngrok http 3000`
        - Set endpoint to: `https://<your-ngrok-subdomain>.ngrok-free.app/api/webhooks/clerk`
3. **Events:** Select `user.deleted` (optionally `user.updated`)
4. Copy the **Signing secret** and set it as `CLERK_WEBHOOK_SECRET` in `.env.local`
5. Restart your dev server after updating environment variables

### 4. Testing the Webhook

- In Clerk Dashboard, under Webhooks, select your endpoint and send a **test event** (`user.deleted`)
- Expect a **200 OK** response
- Check your Supabase project—the corresponding user row should be deleted from `users`

### 5. Additional Notes

- Make sure your `SUPABASE_SERVICE_KEY` is used (service role required for deletes)
- The database uses foreign keys with `ON DELETE CASCADE`, so deleting a user automatically cleans up related records
- For local development:
    - The ngrok URL must exactly match the one registered in Clerk
    - Ensure your dev server is running and accessible

