# CreatorHub 🚀

> **The Modern Editorial Studio & AI-Powered Content Operating System for Digital Creators**

CreatorHub is an end-to-end editorial studio and content management platform engineered for digital content creators, media teams, and agencies. It unifies trend discovery, AI-assisted ideation, research intelligence, multimedia production, collaborative editing, and cross-platform repurposing into a single cohesive workspace.

---

## ✨ Features

- **📡 Live Trend & Discover Feed**: Aggregates real-time trends, industry RSS feeds, and topic performance metrics with instant filtering across tech, business, gaming, and lifestyle.
- **💡 AI Ideation & Viral Scoring**: Generates high-impact content concepts, title variations, and virality potential ratings powered by generative AI.
- **🔍 Deep Research & Citation Hub**: Organizes reference sources, competitive angles, key statistics, and takeaways.
- **📐 Multi-Format Content Blueprints**: Structuring workflows tailored for YouTube scripts, newsletters, LinkedIn carousels, TikToks/Shorts, and podcasts.
- **✍️ Collaborative Production Studio**: Rich editorial workspace with real-time room syncing via Socket.IO, status pipelines, word counts, and revision tracking.
- **🔄 Content Family Repurposing**: Convert 1 long-form anchor piece into 10+ derivative assets (threads, shorts, quotes, clips, carousels).
- **✅ Editorial Review & Quality Checks**: Pre-publish checklists, tone verification, asset validation, and review approvals.
- **📊 Audience & Analytics Engine**: Engagement projections, retention benchmarks, and demographic audience alignment.
- **⚡ Instant In-Memory Database Fallback**: Out-of-the-box readiness—automatically falls back to an embedded in-memory MongoDB cluster and auto-seeds diverse multi-niche sample data if no local MongoDB instance is detected!

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **Real-Time Client**: Socket.IO Client
- **Forms & Validation**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 4
- **Database**: MongoDB via Mongoose (with automated `mongodb-memory-server` fallback)
- **Real-Time Engine**: Socket.IO Server
- **Authentication**: JWT & Bcrypt (with Google OAuth integration)
- **AI Integration**: Google Generative AI (@google/generative-ai)
- **Data Ingestion**: RSS Parser & Axios

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- *Optional*: Local MongoDB instance (not required, backend automatically uses in-memory DB if unavailable)

---

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/balanithyam/CreatorHub.git
cd CreatorHub
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env

# Start backend server (port 5000)
npm run dev
```

#### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install

# Start frontend dev server (port 5173)
npm run dev
```

#### 4. Access the Studio
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
CreatorHub/
├── backend/                  # Express REST API & Socket.IO server
│   ├── config/              # Database connection & memory fallback
│   ├── controllers/         # Request controllers
│   ├── middleware/          # Auth & validation middleware
│   ├── models/              # Mongoose data schemas
│   ├── routes/              # Express API route definitions
│   ├── scripts/             # Data seeding & migration scripts
│   ├── services/            # Feed & external service integrations
│   ├── sockets/             # Real-time Socket.IO room handlers
│   ├── utils/               # Auto-seeding and helper utilities
│   ├── server.js            # Server entry point
│   ├── package.json
│   └── .env.example         # Environment template
│
├── frontend/                 # React 18 + Vite client
│   ├── src/
│   │   ├── components/      # UI components & shared layout
│   │   ├── context/         # Auth, Theme, & Real-time contexts
│   │   ├── pages/           # Studio views (Discover, Ideas, Production, etc.)
│   │   ├── services/        # API client & axios instances
│   │   ├── types/           # TypeScript interfaces & types
│   │   ├── App.tsx          # Router setup
│   │   └── main.tsx         # React root
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── .gitignore               # Comprehensive Git exclusion rules
└── README.md                # Project documentation
```

---

## 🔒 Security & Privacy

- Environment variables (`.env`) and API credentials are kept out of source control.
- Passwords are encrypted using bcrypt hashing.
- Authenticated endpoints are guarded with JSON Web Token (JWT) verification.

---

## 👩‍💻 Author

**Bala Nithya M**
- GitHub: [@balanithyam](https://github.com/balanithyam)
- LinkedIn: [Bala Nithya M](https://www.linkedin.com/in/bala-nithya-m-89781b309)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
