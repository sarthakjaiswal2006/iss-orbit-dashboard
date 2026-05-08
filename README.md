# 🚀 ISS Orbit Dashboard

A futuristic, real-time dashboard built with React and Vite to track the International Space Station (ISS), read space-related news, and interact with an AI Assistant powered by Mistral 7B.

## Features

- **Live ISS Tracking**: Real-time map displaying the ISS's current location, updated every 15 seconds.
- **Speed Calculation**: Dynamically calculates the ISS speed using the Haversine formula based on its travel distance over time.
- **Astronauts in Space**: Displays the current number of people in space and their names/crafts.
- **Space News**: Latest spaceflight news with caching (15 minutes) for optimal performance.
- **AI Chatbot**: Built-in floating assistant that answers questions using ONLY data currently available on the dashboard.
- **Data Visualizations**: Recharts integration for ISS speed history and news source distribution.
- **Futuristic UI**: Fully responsive, glassmorphism design with dark/light mode and Framer Motion animations.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Map**: Leaflet.js (`react-leaflet`)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP**: Axios
- **AI Model**: `mistralai/Mistral-7B-Instruct-v0.2` (via Hugging Face API)

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd iss-orbit-dashboard
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example`):
\`\`\`bash
cp .env.example .env
\`\`\`
Add your Hugging Face API key inside the `.env` file:
\`\`\`
VITE_HF_API_KEY=your_huggingface_api_key_here
\`\`\`
*Note: You can generate a free API key at [Hugging Face](https://huggingface.co/settings/tokens).*

### 4. Local Development
Start the development server:
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
\`\`\`bash
npm run build
\`\`\`
The output will be in the `dist/` directory, ready to deploy.

## Vercel Deployment Steps
1. Push your code to GitHub.
2. Log in to Vercel and click **Add New Project**.
3. Import your GitHub repository.
4. In the "Environment Variables" section, add `VITE_HF_API_KEY` with your Hugging Face key.
5. Click **Deploy**. Vercel will automatically run `npm install` and `npm run build`.

## Folder Structure

\`\`\`text
src/
├── components/
│   ├── Charts/        # Recharts visualizations
│   ├── Chatbot/       # AI Assistant
│   ├── ISS/           # Map and Astronauts list
│   ├── Layout/        # Navbar
│   ├── News/          # Space news grid
│   └── UI/            # Reusable components (Cards, Loaders, Skeletons)
├── context/           # Theme and Dashboard Context providers
├── hooks/             # Custom hooks for fetching data (useISSTracking, useNews)
├── pages/             # Main Dashboard layout
├── services/          # Hugging Face API integration
├── utils/             # Haversine formula calculation
├── App.jsx            # Root component with Providers
├── index.css          # Tailwind and global styles
└── main.jsx           # Entry point
\`\`\`
