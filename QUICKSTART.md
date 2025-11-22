# 🚀 Quick Start Guide

Get the Sustainable Negotiation AI prototype running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ OpenAI API key ready ([Get one here](https://platform.openai.com/api-keys))

## Step 1: Backend Setup (2 minutes)

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

**IMPORTANT:** Open the `.env` file and add your OpenAI API key:

```bash
# Edit backend/.env
OPENAI_API_KEY=sk-your-actual-openai-key-here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run start:dev
```

You should see:
```
🚀 Sustainable Negotiation AI Backend running on: http://localhost:3001
📡 API available at: http://localhost:3001/api
```

**✅ Backend is ready!** Leave this terminal running.

## Step 2: Frontend Setup (2 minutes)

Open a **NEW** terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.local.example .env.local
```

The default values should work:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Start the frontend server:

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

**✅ Frontend is ready!**

## Step 3: Test the Application (1 minute)

1. Open your browser to: **http://localhost:3000**

2. You should see the home page with "AI-Powered Sustainable Negotiations"

3. Click **"Start Negotiation Simulation"**

4. Try this quick test scenario:

   **Party A:**
   - Name: `Tech Corp`
   - Goals: `Expand data center capacity by 50%`
   - Constraints: `Budget of $10M, 12-month timeline`

   **Party B:**
   - Name: `Environmental Group`
   - Goals: `Ensure 100% renewable energy use`
   - Constraints: `No carbon offsets, must be truly green`

   **ESG Priorities:**
   - Environmental: `80`
   - Social: `50`
   - Governance: `60`

5. Click **"Run Sustainable Negotiation AI"**

6. Wait ~10-15 seconds for AI processing

7. View your results with 3 different compromise proposals! 🎉

## Troubleshooting

### "Cannot connect to backend"
- ✅ Make sure backend is running on port 3001
- ✅ Check if `http://localhost:3001/api` is accessible
- ✅ Verify CORS settings in backend

### "OpenAI API Error"
- ✅ Verify your OpenAI API key is correct
- ✅ Check your OpenAI account has credits
- ✅ Ensure no firewall blocking OpenAI API
- ⚠️ The system will use fallback responses if API fails

### "Port already in use"
- Backend: Change `PORT=3001` to another port in `backend/.env`
- Frontend: Run `npm run dev -- -p 3001` to use different port

### Dependencies not installing
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure you're using Node.js 18+

## What's Next?

### Try More Scenarios
Check out `EXAMPLES.md` for 6 detailed negotiation scenarios to test.

### Understand the Architecture
Read `ARCHITECTURE.md` for technical details and system design.

### Customize the Platform
- **Backend**: Modify prompts in `backend/src/negotiation/services/openai.service.ts`
- **Frontend**: Update styling in `frontend/src/app/globals.css` or components
- **Add Features**: Extend DTOs, add new endpoints, create new pages

### Development Tips

**Backend Hot Reload:**
Any changes to `.ts` files will automatically reload the server.

**Frontend Hot Reload:**
Any changes to React components will refresh the browser automatically.

**View Logs:**
- Backend: Check the terminal running `npm run start:dev`
- Frontend: Check browser DevTools console (F12)
- API Requests: Check Network tab in DevTools

## Useful Commands

### Backend
```bash
npm run start:dev    # Development with hot reload
npm run build        # Build for production
npm run start:prod   # Run production build
npm run lint         # Check code style
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Check code style
```

## API Testing with curl

Test the backend directly:

```bash
curl -X POST http://localhost:3001/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "partyA": {
      "name": "Company A",
      "goals": "Maximize profit",
      "constraints": "Budget $5M"
    },
    "partyB": {
      "name": "Company B",
      "goals": "Ensure sustainability",
      "constraints": "Zero emissions"
    },
    "esg": {
      "environmental": 80,
      "social": 60,
      "governance": 70
    }
  }'
```

## Success Indicators

You'll know everything is working when:

✅ Backend shows: "Sustainable Negotiation AI Backend running on: http://localhost:3001"
✅ Frontend shows: Next.js compilation successful
✅ Browser displays the home page without errors
✅ Form submission generates AI compromises
✅ Radar chart displays on results page
✅ No red errors in browser console

## Need Help?

1. Check the main `README.md` for detailed information
2. Review individual README files in `/backend` and `/frontend`
3. Read `ARCHITECTURE.md` for system design details
4. Try the examples in `EXAMPLES.md`

---

**🎉 Congratulations!** You now have a fully functional AI-powered negotiation platform running locally.

Enjoy exploring sustainable negotiations with AI! 🌱
