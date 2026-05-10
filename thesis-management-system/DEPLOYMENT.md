# Deployment Guide

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with repository
- Vercel account (free tier available)
- OpenAI API key

### Steps

1. **Push to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Add Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables:
   \`\`\`
   OPENAI_API_KEY=sk-...
   \`\`\`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

### Production Checklist
- [ ] Add OpenAI API key
- [ ] Setup MongoDB (if using)
- [ ] Configure Cloudinary (for file storage)
- [ ] Test all features
- [ ] Set up monitoring

## Option 2: Deploy Backend to Render

If you separate frontend and backend:

1. Create `backend` folder with Express.js setup
2. Push to GitHub
3. Go to https://render.com
4. Create new Web Service
5. Connect GitHub repository
6. Add environment variables
7. Deploy

## Option 3: Self-Hosted (Docker)

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

Build and run:
\`\`\`bash
docker build -t thesis-ai .
docker run -p 3000:3000 thesis-ai
\`\`\`

## Environment Variables for Production

\`\`\`
# API Keys
OPENAI_API_KEY=sk-...

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# File Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Security
JWT_SECRET=your-secret-key

# URLs
NEXT_PUBLIC_API_URL=https://yourdomain.com
\`\`\`

## Monitoring & Maintenance

- Use Vercel Analytics for performance monitoring
- Set up error tracking with Sentry
- Regular backups of MongoDB
- Monitor API usage and costs

## Troubleshooting

**Build fails:**
- Check Node version (18+)
- Verify all dependencies installed
- Check environment variables

**PDF extraction fails:**
- Ensure PDFs are valid
- Check OpenAI API quota
- Verify API key is correct

**Database connection fails:**
- Check MongoDB connection string
- Verify IP whitelist
- Test connection locally
