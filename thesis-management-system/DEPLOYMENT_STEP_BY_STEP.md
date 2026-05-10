# Step-by-Step Deployment Guide for ThesisAI

## Quick Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Prepare Your Repository
Ensure your project is pushed to GitHub:

\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select "Other Git Repository" and paste your GitHub URL
4. Click "Continue"

### Step 3: Configure Environment Variables
In the Vercel import dialog, add these environment variables:

\`\`\`
OPENAI_API_KEY = sk-your-openai-api-key
\`\`\`

Get your OpenAI API key from: https://platform.openai.com/api-keys

### Step 4: Deploy
1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. You'll get a live URL like `https://thesis-ai-xyz.vercel.app`

### Step 5: Test Your Deployment
1. Visit your live URL
2. Create an account
3. Upload a test PDF
4. Verify AI extraction works

---

## Detailed Deployment Options

### Option A: Vercel Deployment (Easiest)

**Pros:**
- Free tier available
- Automatic deployments on git push
- Built-in monitoring and logs
- Perfect for full-stack Next.js apps

**Steps:**
1. Sign up at vercel.com
2. Import GitHub repository
3. Add OPENAI_API_KEY to environment variables
4. Click Deploy

**Cost:** Free for hobby projects, $20+/month for production

---

### Option B: Self-Hosted on Render

**Pros:**
- More control over infrastructure
- Good for complex deployments
- Free tier available

**Steps:**

1. Create account at https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Choose branch: `main`
5. Add environment variables:
   - `OPENAI_API_KEY`
   - `NODE_ENV = production`
   - `NODE_VERSION = 18`
6. Select plan (Free or Paid)
7. Click "Create Web Service"

**Building:**
- Runtime: Node
- Build Command: `npm run build`
- Start Command: `npm start`

**Cost:** Free tier sleeps after 15 min inactivity, $7+/month for production

---

### Option C: Self-Hosted with Docker

**Pros:**
- Maximum control and flexibility
- Can host on any VPS (AWS, DigitalOcean, etc.)
- Highly scalable

**Prerequisites:**
- Docker installed
- VPS or cloud server (AWS EC2, DigitalOcean, Linode, etc.)

**Steps:**

1. Create `.env` file:
\`\`\`
OPENAI_API_KEY=sk-your-key
NODE_ENV=production
\`\`\`

2. Create `Dockerfile`:
\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

3. Build and run locally:
\`\`\`bash
docker build -t thesis-ai .
docker run -p 3000:3000 --env-file .env thesis-ai
\`\`\`

4. Deploy to cloud (DigitalOcean example):
\`\`\`bash
# Login to your DigitalOcean or cloud provider
# Push image to registry
docker tag thesis-ai your-registry/thesis-ai:latest
docker push your-registry/thesis-ai:latest

# Deploy via provider's dashboard or CLI
\`\`\`

**Cost:** $5-20/month depending on VPS provider

---

## Production Checklist

Before going live, ensure:

- [ ] **Environment Variables Set**
  - [ ] `OPENAI_API_KEY` configured
  - [ ] Deployment platform verified

- [ ] **Security**
  - [ ] No sensitive keys in code
  - [ ] `.env` files in `.gitignore`
  - [ ] HTTPS enabled (automatic on Vercel)

- [ ] **Testing**
  - [ ] Sign up functionality works
  - [ ] PDF upload works
  - [ ] AI extraction succeeds
  - [ ] Search/filter functions properly
  - [ ] Mobile responsive

- [ ] **Monitoring**
  - [ ] Error tracking setup (Sentry optional)
  - [ ] Performance monitoring enabled
  - [ ] Logs accessible

- [ ] **Maintenance Plan**
  - [ ] Regular backups
  - [ ] Monitor API costs
  - [ ] Update dependencies monthly
  - [ ] Monitor uptime

---

## Troubleshooting Deployment Issues

### Build Fails
**Error:** "Cannot find module..."
**Solution:** Run `npm install` locally and commit `package-lock.json`

**Error:** "Out of memory during build"
**Solution:** Upgrade to paid tier or reduce app size

### App Won't Start
**Error:** "ENOENT: no such file or directory"
**Solution:** Ensure all `.next` build artifacts exist - run `npm run build` locally first

### PDF Extraction Fails
**Error:** "OpenAI API error"
**Check:**
1. API key is correct: https://platform.openai.com/api-keys
2. API key has sufficient quota
3. Network connectivity working

**Solution:** Verify API key and quota in OpenAI dashboard

### Environment Variables Not Loaded
**Solution:** Restart deployment after adding environment variables

---

## Monitoring & Maintenance

### Performance Monitoring
- **Vercel:** Built-in analytics dashboard
- **Render:** Basic monitoring included
- **Self-hosted:** Use New Relic, DataDog, or similar

### Error Tracking (Optional but Recommended)
1. Sign up at https://sentry.io
2. Get DSN key
3. Add to environment variables
4. Get real-time error notifications

### Cost Optimization
- Monitor OpenAI API usage: https://platform.openai.com/usage
- Set rate limits if needed
- Consider caching responses

---

## Next Steps After Deployment

1. **Domain Setup** (Optional)
   - Purchase domain from GoDaddy, Namecheap, etc.
   - Connect to your deployment platform
   - Set up SSL certificate

2. **Analytics** (Optional)
   - Add Google Analytics
   - Track user behavior and conversion

3. **Email Notifications** (Future Enhancement)
   - Set up SendGrid or Mailgun
   - Send notifications on new features

4. **Continuous Deployment**
   - Set up GitHub Actions
   - Auto-deploy on push to main branch

---

## Support & Help

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **OpenAI Docs:** https://platform.openai.com/docs
- **Render Docs:** https://render.com/docs

Having trouble? Check the logs in your deployment platform's dashboard!
