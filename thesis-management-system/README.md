# ThesisAI - Smart Thesis Management System

AI-powered thesis storage and analysis platform built with React, Next.js, and OpenAI.

## Features

✨ **Smart AI Analysis**
- Automatic abstract extraction from PDFs
- AI-powered keyword generation
- Natural language processing with OpenAI GPT-4

🎓 **User Management**
- Secure authentication with JWT
- User registration and login
- Personalized dashboard

📚 **Paper Management**
- Upload research papers (PDF format)
- View AI-extracted abstracts and keywords
- Search and filter by keywords
- Organize your thesis collection

🎨 **Modern UI**
- Beautiful dark theme with gradient accents
- Smooth animations with Framer Motion
- Fully responsive design
- Intuitive user experience

## Tech Stack

**Frontend:**
- React 19
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- ShadcN/UI Components

**Backend:**
- Next.js Route Handlers
- Vercel AI SDK
- OpenAI API (GPT-4 Mini)

**Storage (Production):**
- MongoDB Atlas (database)
- Cloudinary/Firebase Storage (file storage)

## Setup & Installation

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd thesis-management-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`
NEXT_PUBLIC_DEV_URL=http://localhost:3000
\`\`\`

**For Production (OpenAI Integration):**

Add to your Vercel project settings:
- `OPENAI_API_KEY` - Get from https://platform.openai.com

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## Usage

### Landing Page
- View features and create an account
- Sign in with existing credentials

### Dashboard
- Upload PDF papers
- View automatically extracted abstracts and keywords
- Search papers by keywords or abstract content
- Filter by multiple keywords
- Track your thesis collection

### Upload Paper
1. Click "Upload New Thesis"
2. Select a PDF file from your computer
3. AI analyzes the paper automatically
4. Review the extracted abstract and keywords
5. Edit if needed and save

## API Endpoints

### Authentication
- `POST /api/auth` - Register or login

### Papers
- `GET /api/papers` - Fetch all user papers
- `POST /api/papers` - Save new paper with abstract/keywords
- `DELETE /api/papers?id={paperId}` - Delete a paper

### PDF Processing
- `POST /api/extract` - Extract and analyze PDF

## Production Setup

### Database (MongoDB)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get connection string
3. Create `.env.local`:

\`\`\`
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/thesis-db
\`\`\`

### File Storage (Cloudinary)

1. Sign up at https://cloudinary.com
2. Get your credentials
3. Add to environment variables:

\`\`\`
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

### Deployment

**Deploy to Vercel:**

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## Project Structure

\`\`\`
thesis-management-system/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── extract/       # PDF extraction & AI analysis
│   │   └── papers/        # Paper CRUD operations
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── auth-modal.tsx     # Login/signup modal
│   ├── paper-card.tsx     # Paper display card
│   ├── upload-modal.tsx   # Upload interface
│   └── ui/                # ShadcN UI components
├── public/                # Static assets
├── .env.local             # Environment variables
└── README.md              # This file
\`\`\`

## Features Breakdown

### Authentication System
- JWT-based auth (production ready)
- Secure password handling
- Session management via localStorage

### PDF Processing
- Text extraction from PDFs
- AI analysis with OpenAI GPT-4
- Fallback mechanisms for reliability

### Search & Filtering
- Real-time keyword search
- Multi-filter support
- Dynamic keyword extraction
- Result counting

### UI Components
- Responsive grid layouts
- Smooth animations
- Dark theme support
- Accessibility features

## Future Enhancements

- [ ] Admin dashboard
- [ ] Bulk paper upload
- [ ] PDF download functionality
- [ ] Share papers with others
- [ ] Advanced analytics
- [ ] Dark/Light mode toggle
- [ ] Email notifications
- [ ] Paper collaboration features

## Support

For issues or questions, please open a GitHub issue or contact support.

## License

MIT License - feel free to use this project for personal or commercial purposes.
\`\`\`
