# Deployment Guide

## Step 1: Deploy PostgreSQL Database on Neon.tech

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)
4. Save this - you'll need it for Render

## Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: katch-backend
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Add Environment Variables:
   - `DATABASE_URL`: (paste your Neon connection string)
   - `SECRET_KEY`: (generate a random string)
   - `JWT_SECRET_KEY`: (generate a random string)
   - `MAIL_USERNAME`: (your Gmail)
   - `MAIL_PASSWORD`: (Gmail app password)
   - `FRONTEND_URL`: (leave blank for now, update after Vercel)
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://katch-backend.onrender.com`)

## Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite (or auto-detect)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL`: (paste your Render backend URL)
6. Click "Deploy"
7. Copy your frontend URL (e.g., `https://katch.vercel.app`)

## Step 4: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Save changes (this will redeploy)

## Done! 🎉

Your app should now be fully deployed and connected.
