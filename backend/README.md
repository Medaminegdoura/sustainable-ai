# Sustainable Negotiation AI - Backend

Backend API for the Sustainable Negotiation AI platform. Built with NestJS, TypeScript, and OpenAI API.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

### Running the Application

**Development mode (with hot reload):**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3001/api`

## 📡 API Endpoints

### POST /api/simulate

Simulates a negotiation between two parties and returns AI-generated compromise proposals.

**Request Body:**
```json
{
  "partyA": {
    "name": "Tech Corp",
    "goals": "Maximize profitability while expanding market share",
    "constraints": "Must maintain 20% profit margin, limited budget of $5M"
  },
  "partyB": {
    "name": "Environmental Alliance",
    "goals": "Ensure sustainable practices and zero carbon emissions",
    "constraints": "Cannot compromise on environmental standards"
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
  "economic_compromise": "AI-generated economic-focused proposal...",
  "social_compromise": "AI-generated social-focused proposal...",
  "balanced_compromise": "AI-generated balanced proposal...",
  "scores": {
    "economic": 75,
    "social": 82,
    "environmental": 88
  }
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── main.ts                      # Application entry point
│   ├── app.module.ts                # Root module
│   └── negotiation/
│       ├── negotiation.module.ts    # Negotiation feature module
│       ├── negotiation.controller.ts # REST controller
│       ├── dto/
│       │   ├── simulation-request.dto.ts   # Request validation
│       │   └── simulation-response.dto.ts  # Response types
│       └── services/
│           ├── negotiation.service.ts      # Business logic
│           └── openai.service.ts           # OpenAI integration
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

## 🧠 OpenAI Integration

The backend uses OpenAI's GPT-4o-mini model to generate three types of compromises:

1. **Economic-Optimized**: Focuses on financial efficiency and ROI
2. **Social-Optimized**: Prioritizes fairness and social impact
3. **Balanced Sustainable**: Harmonizes economic, social, and environmental factors

### Prompt Engineering

Each compromise type uses a specialized system prompt to guide the AI:

- **Economic**: Expert in financial optimization and cost reduction
- **Social**: Expert in social responsibility and ethical considerations
- **Balanced**: Expert in ESG principles and sustainable solutions

### Fallback Mechanism

If the OpenAI API is unavailable or fails, the service provides reasonable fallback responses to ensure the prototype remains functional.

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 Notes

- This is a **prototype**, not production-ready
- API key should be secured in production
- Rate limiting not implemented
- No database persistence (stateless API)
- Simple deterministic scoring algorithm

## 🛠️ Technologies

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type-safe development
- **Axios**: HTTP client for OpenAI API
- **class-validator**: Request validation
- **class-transformer**: DTO transformation

## 📄 License

MIT
