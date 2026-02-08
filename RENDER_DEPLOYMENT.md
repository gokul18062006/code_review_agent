# 🚀 Deploy Code Review Agent to Render

## Complete Deployment Guide

### Prerequisites:
✅ GitHub account
✅ Render account (free tier works!)
✅ Your code pushed to GitHub

---

## Step 1: Push Code to GitHub

```powershell
# If not already done
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

## Step 2: Deploy Backend (FastAPI)

### 2.1 Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your `code_review_agent` repo

### 2.2 Configure Backend Service

**Settings:**
- **Name**: `code-review-agent-backend`
- **Region**: Oregon (US West)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Environment**: `Python 3`
- **Build Command**: 
  ```
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```
  uvicorn backend.app.app:app --host 0.0.0.0 --port $PORT
  ```

### 2.3 Add Environment Variables

Click **"Environment"** tab and add:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `ROE0HtsG9o9Zz122QhAPl11juXmzBVs03idWHTT1` |
| `PYTHON_VERSION` | `3.13.7` |

### 2.4 Deploy

Click **"Create Web Service"**

Wait 3-5 minutes for deployment. You'll get a URL like:
`https://code-review-agent-backend.onrender.com`

---

## Step 3: Deploy Frontend (React)

### 3.1 Create Static Site on Render

1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repository
3. Select your `code_review_agent` repo

### 3.2 Configure Frontend Service

**Settings:**
- **Name**: `code-review-agent-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Publish Directory**: 
  ```
  dist
  ```

### 3.3 Add Environment Variable

Click **"Environment"** tab and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://code-review-agent-backend.onrender.com` |

*(Replace with YOUR actual backend URL from Step 2)*

### 3.4 Deploy

Click **"Create Static Site"**

You'll get a URL like:
`https://code-review-agent-frontend.onrender.com`

---

## Step 4: Update CORS Settings

After deployment, update backend CORS to allow frontend:

**Edit backend/app/app.py:**

Find the CORS section and update:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://code-review-agent-frontend.onrender.com",  # Add your frontend URL
        "*"  # Or use "*" for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push changes:
```powershell
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the update.

---

## Step 5: Test Your Deployed App

1. Visit your frontend URL: `https://code-review-agent-frontend.onrender.com`
2. Click "Python - Bad Example"
3. Click "Review Code"
4. Should see AI-powered analysis!

---

## 🎯 Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Environment variables set (OPENAI_API_KEY)
- [ ] Backend URL copied
- [ ] Frontend deployed on Render
- [ ] Frontend environment variable set (VITE_API_URL)
- [ ] CORS updated in backend
- [ ] Tested the live app

---

## 📊 Render Free Tier Limits

✅ **Web Services**: 750 hours/month (enough for 1 service)
✅ **Static Sites**: Unlimited
⚠️ **Note**: Free tier web services sleep after 15 min of inactivity

**Tip**: Upgrade to paid ($7/month) to prevent sleep

---

## 🔧 Alternative: Deploy as Single Service

If you want both in one service:

### Using Blueprint (render.yaml)

The `render.yaml` file is already created. Just:

1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your repo
4. Select `render.yaml`
5. Set environment variables
6. Deploy!

This deploys both services automatically.

---

## 🐛 Troubleshooting

### Backend not starting:
- Check logs in Render dashboard
- Verify `requirements.txt` has all packages
- Check Python version matches

### Frontend can't reach backend:
- Verify `VITE_API_URL` points to backend URL
- Check CORS settings in backend
- Look at browser console for errors

### API key not working:
- Ensure `OPENAI_API_KEY` is set in backend environment
- Check it's not exposed in frontend

---

## 🌐 Your Live URLs

After deployment, you'll have:

**Frontend**: `https://code-review-agent-frontend.onrender.com`
**Backend**: `https://code-review-agent-backend.onrender.com`
**API Docs**: `https://code-review-agent-backend.onrender.com/docs`

---

## 🎉 Success!

Your Code Review Agent is now live and accessible worldwide!

Share it in your portfolio! 🚀
