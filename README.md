🌱 AgriAssist – Smart Farming Assistant (Frontend)
AgriAssist is an intelligent farming companion designed to empower farmers with personalized agricultural insights, market trends, helpful reminders, and AI-powered chatbot assistance.
This repository contains the frontend application, built with React + TailwindCSS, which serves as the user interface for farmers to interact with the system seamlessly.

🚀 Features
✅ 1. Beautiful, Responsive UI
Clean and modern React + TailwindCSS design.

Fully responsive, optimized for both desktop and mobile devices.

✅ 2. Dynamic Landing Page
Block 1 (Pre-Sign-In): Displays rotating information about AgriAssist’s features and benefits.

Block 1 (Post-Sign-In): Shows helpful farming reminders fetched from backend, with the option to add new reminders.

Block 2 – Market Dashboard:

Real-time (dummy for now) crop prices with smooth continuous scrolling animation.

Hover to pause animation & click crops to view market details in a modal.

A search bar (with mic icon) for asking questions (will be integrated with AI backend soon).

Block 3 – Important Alerts:

Displays location-based farming alerts.

"Sign in to see details" prompt for non-signed users.

✅ 3. Profile Management
Sign-in flow with a user icon replacing the sign-in button upon login.

Comprehensive Profile Modal:

Farmers can fill detailed personal & agricultural information (e.g., crops, farming history, land info).

Supports scrolling through multiple fields.

Two modes: Text input (default) and Audio input (for future AI voice-based profile creation).

✅ 4. Smooth User Experience
Modals with blurred background for sign-in, profile editing, and crop details.

Seamless state management for switching between signed-in and guest views.

Animations and transitions for improved UX.

🛠 Tech Stack
Frontend Framework: React (Vite for fast builds & dev server)

Styling: TailwindCSS (fully responsive, utility-first CSS framework)

Icons & UI Elements: React Icons

State Management: React Hooks (useState, useEffect)

API Integration: REST API (planned backend integration with Python FastAPI)

🔗 Integration with Backend
The frontend is designed to integrate with the AgriAssist Python Backend, which provides:

Profile APIs – Fetch and update farmer profiles.

Market & Alerts APIs – Real-time crop price updates and personalized alerts.

LLM AI Services – Chatbot and voice processing powered by Google Vertex AI (Gemini).

📂 Project Structure

agriassist-frontend/
├── public/                  # Images & static files
├── src/
│   ├── api/                 # API service files (profileService, marketService, etc.)
│   ├── components/
│   │   ├── Header.jsx       # Top navigation with Sign-In & Language Dropdown
│   │   ├── Footer.jsx       # Footer with copyright
│   │   ├── Block1.jsx       # Dynamic helpful reminders / rotating info
│   │   ├── Block2.jsx       # Market dashboard with scrolling crops
│   │   ├── Block3.jsx       # Important alerts
│   │   ├── ProfileModal.jsx # Farmer profile creation & editing
│   │   └── SignInModal.jsx  # Sign-in modal
│   ├── App.jsx              # Main page combining all blocks
│   └── main.jsx             # Entry point
├── package.json
└── tailwind.config.js


🚦 Current Status
✔ Frontend UI 90% complete – All major pages and modals are functional.
✔ Basic sign-in flow implemented (mock).
✔ Profile creation & editing integrated with backend (in-memory Python for now).
✔ Animations & smooth UX implemented.

🔜 Next Steps:

Integrate real backend with Firestore for storing farmer profiles & reminders.

Connect market prices & alerts to live data APIs.

Implement LLM chatbot (Gemini Pro) for voice/text queries.

Add multi-language support.