# Example Negotiation Scenarios

This file contains example scenarios to test the Sustainable Negotiation AI platform.

## Scenario 1: Tech Company Expansion vs Environmental Protection

### Party A: TechGlobal Inc.
```json
{
  "name": "TechGlobal Inc.",
  "goals": "Build a new data center to support 50% business growth over next 2 years. Maximize operational efficiency and minimize construction costs.",
  "constraints": "Budget limited to $15 million. Must complete within 18 months. Need to maintain 99.9% uptime SLA."
}
```

### Party B: Green Future Alliance
```json
{
  "name": "Green Future Alliance",
  "goals": "Ensure the data center uses 100% renewable energy and has zero carbon emissions. Protect local wildlife habitats.",
  "constraints": "Cannot accept carbon offset programs as a substitute for real emissions reduction. Water usage must not exceed regional sustainability limits."
}
```

### ESG Settings
- Environmental: 85
- Social: 50
- Governance: 65

### Expected Outcome
AI should suggest renewable energy integration (solar panels, wind power), water recycling systems, and phased implementation approach.

---

## Scenario 2: Manufacturing Expansion vs Community Concerns

### Party A: Industrial Manufacturing Corp
```json
{
  "name": "Industrial Manufacturing Corp",
  "goals": "Increase production capacity by 30% to meet rising demand. Minimize disruption to current operations.",
  "constraints": "Maximum expansion budget of $5 million. Cannot relocate facility. Need to maintain competitive pricing."
}
```

### Party B: Riverside Community Board
```json
{
  "name": "Riverside Community Board",
  "goals": "Prevent increase in noise pollution, air quality degradation, and traffic congestion. Preserve quality of life for 5,000 residents.",
  "constraints": "Noise levels cannot exceed current EPA standards. No expansion into the adjacent park area. Working hours restricted to 7 AM - 7 PM."
}
```

### ESG Settings
- Environmental: 70
- Social: 90
- Governance: 60

### Expected Outcome
AI should propose noise barriers, emission filtration systems, community benefit programs, traffic management plans, and regular reporting.

---

## Scenario 3: Supplier Contract Negotiation

### Party A: Global Retail Chain
```json
{
  "name": "Global Retail Chain",
  "goals": "Secure 20% cost reduction on textile supplies while maintaining quality. Improve supply chain reliability and reduce lead times.",
  "constraints": "Cannot compromise on product quality standards. Need flexible order quantities. Payment terms must remain at 60 days."
}
```

### Party B: Sustainable Textiles Ltd
```json
{
  "name": "Sustainable Textiles Ltd",
  "goals": "Maintain fair wages for workers, use only organic materials, achieve B-Corp certification. Grow business by 15%.",
  "constraints": "Cannot reduce worker wages below living wage standards. Organic certification requirements are non-negotiable. Minimum order quantities of 10,000 units."
}
```

### ESG Settings
- Environmental: 75
- Social: 80
- Governance: 70

### Expected Outcome
AI should suggest volume-based pricing tiers, quality partnerships, transparency initiatives, and shared sustainability investments.

---

## Scenario 4: Real Estate Development vs Historic Preservation

### Party A: Urban Developers LLC
```json
{
  "name": "Urban Developers LLC",
  "goals": "Develop mixed-use building with 200 residential units and commercial space. Achieve 18% ROI within 5 years.",
  "constraints": "Site acquisition cost already $8 million. Zoning allows maximum 12 floors. Must break ground within 6 months."
}
```

### Party B: Historic Preservation Society
```json
{
  "name": "Historic Preservation Society",
  "goals": "Preserve the architectural character of historic downtown district. Maintain cultural heritage and community identity.",
  "constraints": "Building facade of existing 1920s structure must be preserved. Height cannot exceed neighboring historic buildings. Modern materials must complement historic aesthetics."
}
```

### ESG Settings
- Environmental: 60
- Social: 85
- Governance: 75

### Expected Outcome
AI should propose facade preservation, adaptive reuse strategies, community engagement programs, and heritage incorporation in design.

---

## Scenario 5: Renewable Energy Project

### Party A: SolarWind Energy Co
```json
{
  "name": "SolarWind Energy Co",
  "goals": "Install 50MW solar farm to supply clean energy to 15,000 homes. Achieve project profitability within 7 years through government incentives and energy sales.",
  "constraints": "Land lease budget $200,000/year. Grid connection costs capped at $2 million. Needs regulatory approval within 12 months."
}
```

### Party B: Agricultural Landowners Association
```json
{
  "name": "Agricultural Landowners Association",
  "goals": "Maintain agricultural productivity, protect farmland value, ensure fair compensation. Allow continued farming activities where possible.",
  "constraints": "Cannot remove more than 40% of arable land from production. Solar panels must allow for dual-use (agrivoltaics). Lease payments must match or exceed agricultural income."
}
```

### ESG Settings
- Environmental: 95
- Social: 70
- Governance: 80

### Expected Outcome
AI should suggest agrivoltaic systems (solar + farming), revenue sharing models, land restoration clauses, and community benefit programs.

---

## Scenario 6: Corporate Merger Integration

### Party A: Tech Startup Innovate AI
```json
{
  "name": "Innovate AI (Startup)",
  "goals": "Secure acquisition deal that values company at $50 million. Retain key team members for 3 years. Maintain product autonomy.",
  "constraints": "Founders must retain advisory roles. Employee stock options must be honored. Cannot relocate team from current city."
}
```

### Party B: Enterprise Corp Solutions
```json
{
  "name": "Enterprise Corp Solutions",
  "goals": "Acquire innovative AI technology and talent. Achieve synergies within 18 months. Integrate products into existing platform.",
  "constraints": "Maximum acquisition budget $40 million. Need full IP transfer. Integration must complete within 2 years."
}
```

### ESG Settings
- Environmental: 40
- Social: 75
- Governance: 85

### Expected Outcome
AI should propose earnout structures, retention bonuses, phased integration, governance representation, and cultural integration plans.

---

## How to Use These Examples

### In the Web Interface:

1. Navigate to the Setup page
2. Copy the "Party A" information into the Party A form fields
3. Copy the "Party B" information into the Party B form fields
4. Set the ESG sliders to the specified values
5. Click "Run Sustainable Negotiation AI"
6. Review the AI-generated compromises

### Via API (curl):

```bash
curl -X POST http://localhost:3001/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "partyA": {
      "name": "TechGlobal Inc.",
      "goals": "Build a new data center to support 50% business growth over next 2 years. Maximize operational efficiency and minimize construction costs.",
      "constraints": "Budget limited to $15 million. Must complete within 18 months. Need to maintain 99.9% uptime SLA."
    },
    "partyB": {
      "name": "Green Future Alliance",
      "goals": "Ensure the data center uses 100% renewable energy and has zero carbon emissions. Protect local wildlife habitats.",
      "constraints": "Cannot accept carbon offset programs as a substitute for real emissions reduction. Water usage must not exceed regional sustainability limits."
    },
    "esg": {
      "environmental": 85,
      "social": 50,
      "governance": 65
    }
  }'
```

### Via JavaScript:

```javascript
const response = await fetch('http://localhost:3001/api/simulate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    partyA: {
      name: "TechGlobal Inc.",
      goals: "Build a new data center...",
      constraints: "Budget limited to $15 million..."
    },
    partyB: {
      name: "Green Future Alliance",
      goals: "Ensure the data center uses 100% renewable energy...",
      constraints: "Cannot accept carbon offset programs..."
    },
    esg: {
      environmental: 85,
      social: 50,
      governance: 65
    }
  })
});

const result = await response.json();
console.log(result);
```

---

## Tips for Creating Custom Scenarios

### Good Goal Statements:
- ✅ Specific and measurable: "Increase production by 30%"
- ✅ Time-bound: "Complete within 18 months"
- ✅ Outcome-focused: "Achieve zero carbon emissions"

### Good Constraint Statements:
- ✅ Clear boundaries: "Budget cannot exceed $5 million"
- ✅ Non-negotiables: "Cannot relocate facility"
- ✅ Regulatory limits: "Must meet EPA standards"

### ESG Priority Settings:

**High Environmental (80-100):**
- Climate change focused
- Renewable energy projects
- Conservation efforts

**High Social (80-100):**
- Community impact
- Labor rights
- Social justice initiatives

**High Governance (80-100):**
- Transparency requirements
- Ethical business practices
- Stakeholder engagement

**Balanced (50-70 each):**
- General business negotiations
- Multi-stakeholder projects
- Sustainable development

---

## Experiment Ideas

1. **Test Extremes**: Set all ESG values to 100 or 0 and see how compromises change
2. **Asymmetric Priorities**: Party A focused on profit, Party B on sustainability
3. **Impossible Constraints**: Create scenarios with truly conflicting requirements
4. **Multi-Dimensional**: Complex scenarios with environmental, social, AND governance challenges
5. **Real-World Adaptation**: Use actual negotiations from news or case studies

---

These examples demonstrate the platform's capability to handle diverse negotiation contexts while considering sustainability priorities.
