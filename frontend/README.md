# Sustainable Negotiation AI - Frontend

Modern web interface for the Sustainable Negotiation AI platform. Built with Next.js 14, React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

The app will be available at: `http://localhost:3000`

## 📱 Pages

### 1. Home Page (`/`)

Landing page with:
- Platform introduction
- Key features showcase
- "How it works" section
- Call-to-action button

### 2. Setup Page (`/setup`)

Negotiation configuration interface with:
- Party A input form (name, goals, constraints)
- Party B input form (name, goals, constraints)
- ESG priority sliders (Environmental, Social, Governance)
- Form validation
- Loading states during API calls

### 3. Results Page (`/results`)

Displays simulation results:
- Radar chart showing impact scores
- Three AI-generated compromise proposals:
  - Economic-optimized
  - Social-optimized
  - Balanced sustainable
- Navigation options

## 🎨 UI Components

All components are located in `src/components/ui/`:

- **Button**: Configurable button with variants and loading states
- **Card**: Container component for grouped content
- **Input**: Styled text input with label and error handling
- **TextArea**: Multi-line text input for longer content
- **Slider**: Range slider for ESG priorities (0-100)

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   ├── setup/
│   │   │   └── page.tsx         # Setup page
│   │   └── results/
│   │       └── page.tsx         # Results page
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── TextArea.tsx
│   │       └── Slider.tsx
│   ├── lib/
│   │   └── api.ts               # API client
│   └── types/
│       └── negotiation.ts       # TypeScript types
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.local.example
```

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly controls

### State Management
- React hooks (useState, useEffect)
- SessionStorage for result persistence
- Client-side navigation

### Form Validation
- Required field validation
- Clear error messages
- Disabled states during submission

### Data Visualization
- Radar chart using Chart.js
- Color-coded score display
- Interactive tooltips

## 🔧 Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (required)

### Tailwind CSS

Custom theme colors defined in `tailwind.config.js`:
- Primary green palette for sustainability theme
- Extended color scales for various UI elements

## 📦 Dependencies

### Core
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization
- **react-chartjs-2**: React wrapper for Chart.js

### HTTP Client
- **Axios**: Promise-based HTTP client

## 🎨 Design Principles

- **Minimalist**: Clean, uncluttered interface
- **Intuitive**: Clear navigation and CTAs
- **Professional**: Business-appropriate styling
- **Accessible**: Semantic HTML and ARIA labels
- **Responsive**: Mobile, tablet, and desktop support

## 🚦 User Flow

1. User lands on **Home page**
2. Clicks "Start Negotiation Simulation"
3. Fills out **Setup form** with party details and ESG priorities
4. Submits form (calls backend API)
5. Navigates to **Results page**
6. Views AI-generated compromises and impact scores
7. Can run another simulation or return home

## 🧪 Testing

```bash
# Lint check
npm run lint
```

## 📝 Notes

- SessionStorage used for demo simplicity (no database)
- Client-side routing only
- No authentication/authorization
- Prototype-level error handling

## 🛠️ Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS
- **Chart.js**: Data visualization
- **Axios**: HTTP client

## 📄 License

MIT
