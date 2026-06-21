# Trao AI Travel Planner ✈️🌐
An intelligent, full-stack AI-powered vacation itinerary planner that transforms unstructured text generation streams into high-fidelity, interactive, and editable data timelines with persistent cloud synchronization.

---

## 🚀 Project Overview
Trao solves a major limitation in standard AI travel tools: static, un-editable output text. Instead of forcing users to copy-paste chat outputs, Trao synthesizes tailored, day-by-day itineraries that users can actively manipulate in real-time. The application dynamically isolates structured cost parameters, recommends localized hotel options, and manages state synchronization seamlessly across a cloud database.

---

### 📐 System Architecture & Data Pipeline
[ SYSTEM DATA PIPELINE ]
                                  
  ┌─────────────────────────┐               ┌─────────────────────────┐
  │  Vercel Edge Frontend   │ ──(HTTPS/CORS)──►  Render Node.js API   │
  │    (Next.js / Tailwind) │ ◄─────────────────│     Gateway Server      │
  └─────────────────────────┘               └─────────────────────────┘
                                                        │
                                         ┌──────────────┴──────────────┐
                                         ▼                             ▼
                            ┌─────────────────────────┐   ┌─────────────────────────┐
                            │  MongoDB Atlas Cluster  │   │     Gemini 2.5 Flash    │
                            │ (User Accounts & Trips) │   │   (Itinerary Engine)    │
                            └─────────────────────────┘   └─────────────────────────┘

---
## 🛠️ Chosen Tech Stack
This project leverages the **MERN Stack** alongside modern frontend layouts to deliver a responsive, decoupled micro-architecture:

* **Frontend:** Next.js (React / Pure JavaScript) + Tailwind CSS
* **Backend:** Node.js + Express.js
* **Database:** MongoDB + Mongoose ODM
* **AI Engine:** Gemini 2.5 Flash (`@google/genai`)

### Justification
* **Next.js & JavaScript (.jsx):** Developed using standard JavaScript (`.jsx`) files to guarantee fast local building speeds, native browser runtime support, and total flexibility without legacy compilation bottlenecks.
* **Express & Mongoose ODM:** Provides an asynchronous, non-blocking middleware routing path perfect for handling streaming generation processing and state updates without memory bottlenecks.
* **Gemini 2.5 Flash:** Offers superior context window parameters and incredibly fast response execution times compared to alternatives, significantly reducing loading spin durations in the frontend interface.

---

## 💻 Setup Instructions

### 1. Local Environment Configuration

#### Backend Setup:
1. Navigate to the backend directory:
   ```bash
   cd backend  
---
🔒 Authentication & Authorization Approach

**Client Token Storage:** Upon a successful validation handshake, the client context stores an ephemeral authentication signature inside `localStorage`. This key serves as the core routing gatekeeper to check for active sessions before permitting a user to view or modify dashboard variables.

Security parameters are processed using a secure, standard decoupled authentication layout:

Password Hashing: User passwords are encrypted before database persistence using Bcrypt.js running a computational workload factor of 10 salt rounds.

Access Isolation: Dedicated /api/auth/register and /api/auth/login database pathways validate user records against unique indexes inside MongoDB to prevent collision faults or plaintext credential visibility.

---
🤖 AI Agent Design and Purpose
The AI Agent functions as an Excursion Routing Synthesizer. Its primary purpose is to convert intent data (e.g., spending constraints, destination matching) into actionable, chronological timeline itineraries.

Prompt Engineering Protocol: The agent is given explicit layout conditions, forcing it to separate contextual data logic fields into strict boundary blocks. This design completely eliminates "hallucination leakages" where general conversation text overflows into data grids.

---
✨ Creative & Custom Features

**Intelligent Accommodation Selection (Bonus Feature):** Dynamically scans structural context blocks based on target budget tiers, territory matching, and popular traveler ratings, mapping live recommended lodging configurations instantly into presentation layout matrices.

Dynamic Day-Timeline Node Editor: Users can actively edit their itineraries live in the browser. Clicking [Remove] instantly splices individual elements from the array, while inputs allow appending custom nodes. Changes immediately commit to the cloud via a background PATCH synchronization channel.

Isolated Budget Analytics Cards: Automatically separates metric costs (Transit, Lodging, Subsistence) into numerical cards rather than unformatted block text.

Bonus Property Matching: Dynamically scans the AI layout context to map localized hotel options straight into individual UI showcase modules.

---
⚖️ Key Design Decisions & Trade-Offs

**Production Cross-Origin Gateways (CORS):** Instead of using a dangerous global wildcard (`*`) that opens up security vulnerabilities, I designed a strict, explicit CORS array middleware on the Node.js layer. This safely bridges production assets running on Vercel's edge network directly with the Render cloud backend, preventing unauthorized third-party cross-site request interceptions.

Hybrid Text-Data Parsing vs. Pure Structured AI Output
Decision: Forcing an AI model to return pure JSON often leads to formatting breaks, trailing commas, and un-parseable JSON errors that crash the server. Trao uses a hybrid text structure with dedicated marker tags.

Trade-Off: It requires additional regex filtering on the Node.js backend layer, but it guarantees that the server never crashes if the AI slightly modifies its sentence composition.

---
⚠️ Known Limitations
Stateless Chat Context: The current model evaluates itinerary requests independently; it does not retain memory of previous trip queries during a single active session block.

Currency Standardization: Financial estimations default strictly to Euro/USD metrics and do not dynamically recalibrate base valuations according to localized territory currencies in real-time.