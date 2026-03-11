# NextAuth v5 Migration - Deployment Fix Guide

## What Changed

### 1. Package Versions
- `next-auth`: `^4.24.11` → `^5.0.0-beta.25`
- `next`: `^16.0.8` (compatible with v5)

### 2. Files Modified
1. **New file**: `src/auth.ts` - Central auth configuration
2. **Updated**: `src/app/api/auth/[...nextauth]/route.ts` - Simplified to use handlers
3. **Updated**: `package.json` - Version bumps

### 3. Client-side Code (No Changes Needed! ✓)
The following imports remain the same:
- `import { signIn } from "next-auth/react"` ✓
- `import { useSession } from "next-auth/react"` ✓
- `import { SessionProvider } from "next-auth/react"` ✓

All your existing client-side code will work without modifications!

## Deployment Instructions

### Step 1: Fix Permission Error on Server
SSH into your server and run:

```bash
ssh nevin@31.97.203.238

# Fix ownership of the project directory
sudo chown -R nevin:nevin /var/www/thomsonscasa_frontend_web

# Also fix permissions
sudo chmod -R 755 /var/www/thomsonscasa_frontend_web
```

### Step 2: Update deploy.sh Script
Edit your deploy script:

```bash
nano ~/deploy.sh
```

Update it to include `--legacy-peer-deps` (optional, but recommended for stability):

```bash
#!/bin/bash

# Navigate to project directory
cd /var/www/thomsonscasa_frontend_web

# Pull latest code
git pull origin main

# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build

# Restart PM2
pm2 restart all
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

### Step 3: Deploy
First, commit and push the changes from your local machine:

```bash
git add .
git commit -m "Upgrade to NextAuth v5 for Next.js 16 compatibility"
git push origin main
```

Then run the deploy script on the server:

```bash
ssh nevin@31.97.203.238
./deploy.sh
```

## What to Verify After Deployment

1. **Google Sign-In**: Test the sign-in flow at `/sign-in`
2. **Session Persistence**: Verify users stay logged in across page refreshes
3. **Protected Routes**: Ensure authentication-required pages still work
4. **User Data**: Check that Google ID and user info are correctly stored in sessions

## Rollback Plan (If Needed)

If something goes wrong, you can quickly rollback:

```bash
# On your local machine
git revert HEAD
git push origin main

# On the server
./deploy.sh
```

## Additional Notes

- The `--legacy-peer-deps` flag is recommended because NextAuth v5 is still in beta
- All your existing authentication logic remains the same
- The migration is mostly configuration-level changes
- No database changes required
