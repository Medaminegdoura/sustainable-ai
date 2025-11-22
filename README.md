# 🌱 Sustainable Negotiation AI

> AI-powered platform for fair, balanced, and environmentally responsible negotiations

A web-based prototype that helps organizations reach sustainable agreements using artificial intelligence. The system analyzes goals, constraints, and ESG priorities to generate optimized compromise proposals.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Example Scenarios](#example-scenarios)
- [Notes](#notes)

## 🎯 Overview

**Sustainable Negotiation AI** is a functional prototype that demonstrates how AI can support decision-making in negotiations by offering faster, more objective, and sustainability-focused insights.

### What It Does

1. **Analyzes** negotiation parameters from two parties
2. **Considers** ESG priorities (Environmental, Social, Governance)
3. **Generates** three types of AI-powered compromise proposals:
   - 💰 **Economic-Optimized**: Prioritizes financial efficiency
   - 🤝 **Social-Optimized**: Prioritizes fairness and social impact
   - 🌍 **Balanced Sustainable**: Harmonizes all ESG factors
4. **Visualizes** impact scores with interactive charts

## ✨ Features

### Core Functionality
- ✅ Two-party negotiation simulation
- ✅ Customizable ESG priority weights
- ✅ OpenAI-powered compromise generation
- ✅ Real-time impact score calculation
- ✅ Interactive radar chart visualization

### User Experience
- 🎨 Clean, minimalist interface
- 📱 Fully responsive design
- ⚡ Fast, optimized performance
- 🔄 Fallback responses if API fails
- 💾 Session-based result storage

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   (NestJS)      │
│   Port: 3001    │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   OpenAI API    │
│   (GPT-4o-mini) │
└─────────────────┘
```

### System Components

**Frontend (Next.js + React)**
- User interface and interaction
- Form handling and validation
- Data visualization (Chart.js)
- Client-side routing

**Backend (NestJS + Node.js)**
- REST API endpoints
- Request validation
- OpenAI integration
- Business logic

**AI Layer (OpenAI)**
- Compromise generation
- Natural language processing
- Context-aware recommendations

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **OpenAI API key** ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository:**
   ```bash
   cd design-proto
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   npm run start:dev
   ```
   Backend will run on `http://localhost:3001`

3. **Set up the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Environment Variables

**Backend (`.env`):**
```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (`.env.local`):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📖 Usage

### Step 1: Home Page
- Read about the platform
- Click "Start Negotiation Simulation"

### Step 2: Setup Negotiation
- Enter **Party A** details:
  - Name (e.g., "Tech Corporation")
  - Goals (e.g., "Maximize profits while expanding")
  - Constraints (e.g., "Must maintain 20% margin")
  
- Enter **Party B** details:
  - Name (e.g., "Environmental Alliance")
  - Goals (e.g., "Ensure zero carbon emissions")
  - Constraints (e.g., "Cannot compromise on standards")

- Set **ESG Priorities** (0-100):
  - 🌍 Environmental
  - 🤝 Social
  - ⚖️ Governance

- Click "Run Sustainable Negotiation AI"

### Step 3: View Results
- Review AI-generated compromises
- Analyze impact scores on radar chart
- Choose to run another simulation

## 📁 Project Structure

```
design-proto/
├── backend/                  # NestJS backend
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── negotiation/
│   │       ├── negotiation.controller.ts
│   │       ├── negotiation.module.ts
│   │       ├── dto/
│   │       └── services/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── setup/page.tsx   # Setup page
│   │   │   └── results/page.tsx # Results page
│   │   ├── components/ui/
│   │   ├── lib/
│   │   └── types/
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
│
└── README.md                 # This file
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **HTTP Client**: Axios

### Backend
- **Framework**: NestJS
- **Runtime**: Node.js
- **Language**: TypeScript
- **Validation**: class-validator
- **HTTP Client**: Axios

### AI
- **Provider**: OpenAI
- **Model**: GPT-4o-mini
- **API**: REST

## 📡 API Documentation

### POST `/api/simulate`

Generates AI-powered negotiation compromises.

**Request:**
```json
{
  "partyA": {
    "name": "Tech Corp",
    "goals": "Increase market share",
    "constraints": "Budget limited to $5M"
  },
  "partyB": {
    "name": "Green Alliance",
    "goals": "Zero emissions",
    "constraints": "No fossil fuels"
  },
  "esg": {
    "environmental": 80,
    "social": 60,
    "governance": 70
  }
}
```

**Response:**
```json
{
  "economic_compromise": "Implement cost-sharing...",
  "social_compromise": "Prioritize fair labor practices...",
  "balanced_compromise": "Phased approach balancing...",
  "scores": {
    "economic": 75,
    "social": 82,
    "environmental": 88
  }
}
```

## 💡 Example Scenarios

### Scenario 1: Tech Company + Environmental NGO

**Party A (Tech Corp)**
- Goals: Launch new data center, maximize efficiency
- Constraints: $10M budget, 18-month timeline

**Party B (Green Alliance)**
- Goals: 100% renewable energy usage
- Constraints: No carbon offset cheating

**ESG**: Environmental 90, Social 50, Governance 60

**Result**: AI suggests renewable energy partnerships with phased implementation.

### Scenario 2: Factory + Local Community

**Party A (Manufacturing Inc)**
- Goals: Increase production by 30%
- Constraints: Cannot exceed $2M expansion cost

**Party B (Community Board)**
- Goals: No increase in pollution or noise
- Constraints: Protect local park area

**ESG**: Environmental 70, Social 85, Governance 55

**Result**: AI proposes noise barriers, emission filters, and community benefit fund.

## 📝 Notes

### Prototype Status
⚠️ **This is a prototype, not production-ready software.**

**What's Included:**
- ✅ Functional UI and API
- ✅ OpenAI integration
- ✅ Basic error handling
- ✅ Responsive design

**What's NOT Included:**
- ❌ Authentication/Authorization
- ❌ Database persistence
- ❌ User accounts
- ❌ Rate limiting
- ❌ Advanced security measures
- ❌ Comprehensive testing
- ❌ Production deployment config

### Future Enhancements

Potential improvements for production:
1. **User authentication** (JWT, OAuth)
2. **Database** (PostgreSQL, MongoDB)
3. **Result history** and comparison
4. **Multi-party negotiations** (3+ parties)
5. **Export to PDF/CSV**
6. **Real-time collaboration**
7. **Advanced analytics dashboard**
8. **Custom AI model fine-tuning**
9. **Integration with CRM/ERP systems**

## 🤝 Contributing

This is a prototype project. For production use, consider:
- Adding comprehensive tests
- Implementing proper security measures
- Setting up CI/CD pipeline
- Adding monitoring and logging
- Implementing proper error tracking

## 📄 License

MIT License - See individual README files for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- NestJS and Next.js communities
- Tailwind CSS team
- Chart.js contributors

---

**Built with ❤️ for sustainable negotiations**

For questions or issues, please refer to the individual README files in `/backend` and `/frontend` directories.
