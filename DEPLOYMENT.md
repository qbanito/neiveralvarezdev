# DEPLOYMENT GUIDE - OMNIA Portfolio

## 🚀 Quick Deploy to Netlify

### Method 1: Netlify CLI (Recommended for this session)

1. **Install Netlify CLI globally:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```
This will open your browser to authenticate.

3. **Build your project:**
```bash
npm run build
```

4. **Deploy to Netlify:**
```bash
# Test deploy (draft URL)
netlify deploy

# When ready, deploy to production
netlify deploy --prod
```

5. **Follow the prompts:**
- Create & configure new site? Yes
- Team: Select your team
- Site name: `neiveralvarezdev` (or your preferred name)
- Publish directory: `dist`

### Method 2: Netlify UI (Connect Git Repository)

1. **Push code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - OMNIA Portfolio"
git branch -M main
git remote add origin https://github.com/yourusername/neiveralvarezdev.git
git push -u origin main
```

2. **Go to [Netlify](https://app.netlify.com)**

3. **Click "Add new site" → "Import an existing project"**

4. **Select GitHub and choose your repository**

5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20

6. **Deploy!** ✨

## 📝 What's Already Configured

✅ `netlify.toml` - Build and redirect configuration
✅ `public/_redirects` - SPA routing support
✅ Security headers
✅ Cache optimization
✅ Build command and publish directory

## 🔧 Post-Deployment Tasks

### 1. Update API URL in Production

Once deployed, update the API endpoint in `App.tsx`:

```typescript
// Line ~465 in handleFormSubmit
const response = await fetch('YOUR_API_URL/api/contact', {
  // ...
});
```

### 2. Deploy API Server

Deploy the `api` folder to:
- **Railway:** [railway.app](https://railway.app)
- **Render:** [render.com](https://render.com)
- **Fly.io:** [fly.io](https://fly.io)

### 3. Configure Environment Variables

On your API hosting platform, set:
- `RESEND_API_KEY` = `re_ZSteqbvY_66XiJHHH1SPdDHt9srxjNqZN`
- `PORT` = `3001`

### 4. Update CORS in API

In `api/server.js`, update allowed origins:

```javascript
app.use(cors({
  origin: ['https://your-netlify-site.netlify.app', 'http://localhost:3000']
}));
```

## 🎯 Custom Domain Setup

1. Go to Netlify dashboard → Domain settings
2. Add custom domain: `neiveralvarezdev.com`
3. Follow Netlify's DNS configuration instructions
4. SSL certificate will be auto-provisioned

## 📊 Monitoring

After deployment:
- Check Netlify deploy logs
- Test contact form functionality
- Verify all images load correctly
- Test on mobile devices
- Check email deliverability

## 🐛 Common Issues

**Build fails:**
- Check Node version (should be 20)
- Verify all dependencies are in package.json
- Run `npm run build` locally first

**404 errors on routes:**
- `_redirects` file should be in `public/` folder
- `netlify.toml` redirect rules are configured

**Images not loading:**
- Check paths are relative
- Verify images are in `public/` folder

## 🎉 Ready to Deploy!

Run this command in your project directory:

```bash
netlify deploy --prod
```

Your site will be live in seconds! 🚀
