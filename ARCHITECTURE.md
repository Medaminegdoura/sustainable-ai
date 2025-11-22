# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FRONTEND LAYER                             │
│                    Next.js 14 + React 18                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Home   │  │  Setup   │  │ Results  │  │ Components│       │
│  │   Page   │  │   Page   │  │   Page   │  │    UI     │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              API Client (Axios)                       │      │
│  │         Handles HTTP requests to backend             │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ REST API
                             │ POST /api/simulate
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       BACKEND LAYER                             │
│                        NestJS + Node.js                         │
│                    http://localhost:3001                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐      │
│  │         Negotiation Controller                        │      │
│  │    - Handles incoming HTTP requests                  │      │
│  │    - Validates request DTOs                          │      │
│  │    - Returns response DTOs                           │      │
│  └─────────────────────┬────────────────────────────────┘      │
│                        │                                         │
│  ┌─────────────────────▼────────────────────────────────┐      │
│  │         Negotiation Service                           │      │
│  │    - Business logic orchestration                    │      │
│  │    - Coordinates OpenAI service calls                │      │
│  │    - Calculates impact scores                        │      │
│  └─────────────────────┬────────────────────────────────┘      │
│                        │                                         │
│  ┌─────────────────────▼────────────────────────────────┐      │
│  │         OpenAI Service                                │      │
│  │    - Manages OpenAI API integration                  │      │
│  │    - Implements prompt engineering                   │      │
│  │    - Handles API errors & fallbacks                  │      │
│  └─────────────────────┬────────────────────────────────┘      │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         │ HTTPS/REST
                         │ POST /v1/chat/completions
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                        AI LAYER                                 │
│                  OpenAI API (GPT-4o-mini)                       │
├─────────────────────────────────────────────────────────────────┤
│  - Processes natural language prompts                           │
│  - Generates compromise proposals                               │
│  - Returns structured text responses                            │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Input Flow
```
User fills form → Frontend validation → API call → Backend validation → AI processing
```

### 2. Response Flow
```
AI generates text → Backend formats response → Frontend receives JSON → Display results
```

### 3. Detailed Request Flow

```
┌──────────┐
│  User    │
│  Input   │
└────┬─────┘
     │
     │ 1. Submit form
     ▼
┌──────────────────┐
│  Setup Page      │
│  (React State)   │
└────┬─────────────┘
     │
     │ 2. POST /api/simulate
     │    {partyA, partyB, esg}
     ▼
┌──────────────────┐
│  API Client      │
│  (Axios)         │
└────┬─────────────┘
     │
     │ 3. HTTP Request
     ▼
┌──────────────────┐
│  Controller      │
│  - Validate DTO  │
└────┬─────────────┘
     │
     │ 4. Call service
     ▼
┌──────────────────┐
│  Negotiation     │
│  Service         │
└────┬─────────────┘
     │
     │ 5. Request 3 compromises in parallel
     ├──────────┬──────────┐
     │          │          │
     ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│Economic │ │ Social  │ │Balanced │
│Compromise│ │Compromise│ │Compromise│
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     │ 6. OpenAI API calls   │
     └───────────┴───────────┘
                 │
                 ▼
        ┌────────────────┐
        │  OpenAI API    │
        │  GPT-4o-mini   │
        └────────┬───────┘
                 │
                 │ 7. AI-generated text
                 ▼
        ┌────────────────┐
        │  Negotiation   │
        │  Service       │
        │  - Calculate   │
        │    scores      │
        └────────┬───────┘
                 │
                 │ 8. Return response
                 ▼
        ┌────────────────┐
        │  Controller    │
        └────────┬───────┘
                 │
                 │ 9. JSON response
                 ▼
        ┌────────────────┐
        │  Results Page  │
        │  - Display     │
        │  - Chart       │
        └────────────────┘
```

## Component Interactions

### Frontend Components

```
App
├── Layout (Global wrapper)
│   └── Metadata configuration
│
├── Home Page (/)
│   └── Button → Navigate to Setup
│
├── Setup Page (/setup)
│   ├── Input components (Party A)
│   ├── Input components (Party B)
│   ├── Slider components (ESG)
│   ├── Button → Submit form
│   └── API Client → POST /api/simulate
│
└── Results Page (/results)
    ├── Card → Display compromises
    ├── Radar Chart → Visualize scores
    └── Button → Run again
```

### Backend Modules

```
AppModule (Root)
├── ConfigModule (Environment variables)
│
└── NegotiationModule
    ├── NegotiationController
    │   └── POST /api/simulate endpoint
    │
    ├── NegotiationService
    │   ├── simulate() - Main orchestration
    │   └── calculateScores() - Score computation
    │
    └── OpenAiService
        ├── generateEconomicCompromise()
        ├── generateSocialCompromise()
        ├── generateBalancedCompromise()
        └── callOpenAI() - HTTP client
```

## API Contract

### Request Schema
```typescript
{
  partyA: {
    name: string,
    goals: string,
    constraints: string
  },
  partyB: {
    name: string,
    goals: string,
    constraints: string
  },
  esg: {
    environmental: number (0-100),
    social: number (0-100),
    governance: number (0-100)
  }
}
```

### Response Schema
```typescript
{
  economic_compromise: string,
  social_compromise: string,
  balanced_compromise: string,
  scores: {
    economic: number (0-100),
    social: number (0-100),
    environmental: number (0-100)
  }
}
```

## AI Prompt Strategy

### 1. System Prompts (Role Definition)
- **Economic AI**: "You are an expert negotiation AI specialized in finding economically optimal solutions..."
- **Social AI**: "You are an expert negotiation AI specialized in socially responsible solutions..."
- **Balanced AI**: "You are an expert negotiation AI specialized in sustainable, balanced solutions..."

### 2. User Prompts (Context + Instructions)
```
Analyze this negotiation:
- Party A: [name, goals, constraints]
- Party B: [name, goals, constraints]
- ESG Priorities: [environmental, social, governance]

Provide a [type]-optimized compromise (3-5 sentences, specific and actionable).
```

### 3. Response Processing
- Receive raw text from OpenAI
- Trim whitespace
- Store in response DTO
- Return to frontend

## Security Considerations (Production)

**Current Prototype:**
- ⚠️ No authentication
- ⚠️ No rate limiting
- ⚠️ API key in environment variable (basic)
- ⚠️ CORS enabled for localhost

**Production Requirements:**
- ✅ JWT authentication
- ✅ Rate limiting (e.g., 10 requests/minute)
- ✅ API key in secure vault (AWS Secrets, Azure Key Vault)
- ✅ CORS restricted to specific domains
- ✅ Input sanitization
- ✅ HTTPS only
- ✅ Logging & monitoring

## Performance Optimization

**Current:**
- Parallel AI calls (3 compromises at once)
- 60-second timeout
- Fallback responses on failure

**Future:**
- Response caching (Redis)
- Request queuing (Bull/RabbitMQ)
- Streaming responses (Server-Sent Events)
- CDN for frontend assets

## Deployment Architecture (Future)

```
┌──────────────┐
│   Vercel     │  ← Frontend (Next.js)
└──────┬───────┘
       │
       │ HTTPS
       ▼
┌──────────────┐
│   AWS/Azure  │  ← Backend (Docker + Node.js)
│   Container  │
└──────┬───────┘
       │
       │ HTTPS
       ▼
┌──────────────┐
│  OpenAI API  │
└──────────────┘
```

## Technology Decisions

| Choice | Rationale |
|--------|-----------|
| **Next.js** | React framework with SSR, excellent DX, built-in routing |
| **NestJS** | Enterprise-grade Node.js, TypeScript-first, modular architecture |
| **TypeScript** | Type safety, better IDE support, fewer runtime errors |
| **Tailwind CSS** | Rapid UI development, consistent design, small bundle size |
| **Chart.js** | Lightweight charting library, good documentation |
| **Axios** | Promise-based HTTP client, interceptor support |
| **REST (not GraphQL)** | Simpler for prototype, easier to test, better caching |
| **SessionStorage** | No DB needed for prototype, fast, client-side |
| **GPT-4o-mini** | Cost-effective, fast responses, sufficient quality |

---

This architecture supports rapid prototyping while maintaining clear separation of concerns and scalability paths for production.
