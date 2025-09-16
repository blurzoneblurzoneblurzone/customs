# Supabase Connection Setup Guide

## Root Cause Analysis

The `net::ERR_NAME_NOT_RESOLVED` errors occur because:

1. **Placeholder URLs**: The application is using `https://placeholder.supabase.co` which is not a real Supabase instance
2. **Missing Environment Variables**: The `.env` file contains placeholder values instead of actual Supabase credentials
3. **Unconfigured Supabase Project**: No actual Supabase project has been created and configured
4. **Missing Database Schema**: The required tables don't exist in the Supabase database

## Step-by-Step Solution

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `rta-schedule-system`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for the project to be ready (2-3 minutes)

### Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Project API Key** (anon/public key)

### Step 3: Configure Environment Variables

Create or update your `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

### Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Run the migration file that was created: `supabase/migrations/reset_and_create_schedule_database.sql`
3. Or manually execute the SQL commands to create the required tables

### Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add your production domain when deploying
3. Create an admin user:
   - Go to **Authentication** → **Users**
   - Click "Add user"
   - Email: `admin@yourdomain.com`
   - Password: Create a secure password
   - Confirm the user

### Step 6: Update Row Level Security (RLS)

The migration should have set up RLS policies, but verify:

1. Go to **Authentication** → **Policies**
2. Ensure each table has appropriate policies:
   - **SELECT**: Allow for `anon` and `authenticated` users
   - **INSERT/UPDATE/DELETE**: Allow only for `authenticated` users

## Code Configuration Updates

### Update Supabase Client Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Deployment Configuration

### For Production Deployment

1. **Environment Variables**: Set the following in your hosting platform:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Supabase Settings**: Update your Supabase project settings:
   - **Site URL**: Your production domain
   - **Redirect URLs**: Add your production domain

3. **CORS Configuration**: Supabase automatically handles CORS for your domain

## Verification Steps

### 1. Test Local Development
```bash
npm run dev
```
- Check browser console for errors
- Try logging in with your admin credentials
- Verify data loads in the schedule view

### 2. Test Database Connection
```javascript
// Test in browser console
import { supabase } from './src/lib/supabase.js'
const { data, error } = await supabase.from('subjects').select('*')
console.log('Data:', data, 'Error:', error)
```

### 3. Test Authentication
```javascript
// Test login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@yourdomain.com',
  password: 'your-password'
})
console.log('Auth:', data, 'Error:', error)
```

## Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to version control
- Use different credentials for development and production
- Rotate API keys regularly

### 2. Row Level Security
- Always enable RLS on all tables
- Create specific policies for different user roles
- Test policies thoroughly

### 3. API Key Management
- Use the `anon` key for client-side applications
- Never expose the `service_role` key in client code
- Monitor API usage in Supabase dashboard

## Common Issues and Solutions

### Issue: "Invalid API key"
**Solution**: Verify your API key is correct and hasn't expired

### Issue: "Row Level Security policy violation"
**Solution**: Check your RLS policies allow the required operations

### Issue: "CORS errors"
**Solution**: Verify your domain is added to Supabase allowed origins

### Issue: "Database connection timeout"
**Solution**: Check your internet connection and Supabase service status

## Monitoring and Maintenance

1. **Monitor Usage**: Check Supabase dashboard for API usage and performance
2. **Backup Strategy**: Set up automated backups in Supabase
3. **Error Logging**: Implement proper error handling and logging
4. **Performance**: Monitor query performance and optimize as needed

## Next Steps After Setup

1. Test all application features
2. Set up proper error boundaries in React
3. Implement loading states for better UX
4. Add proper TypeScript types for database schema
5. Set up automated testing for database operations

Remember to restart your development server after updating environment variables!