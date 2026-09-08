# SiteFlow: Construction Site Management App

## ⚠️ The Problem
Managing construction sites is often chaotic and disconnected. Communication between site managers (owners) and on-site workers is typically scattered across phone calls, text messages, and paper notes. This leads to:
- **Delayed Blockers:** When a problem occurs on-site, owners aren't notified immediately, causing costly delays.
- **Lost Material Requests:** Workers requesting supplies via text can get easily overlooked, stalling work.
- **Lack of Visibility:** Owners struggle to track real-time progress across multiple different project sites.
- **Accountability Gaps:** Hard to maintain a single source of truth for completed work and photo evidence.

## 💡 The Solution
SiteFlow is a real-time, role-based application designed to bridge the gap between the field and the office. It provides a centralized hub where workers can check off tasks, report issues, and request materials, while owners get a birds-eye view of all their ongoing projects instantly.

---

## ✨ Current Features

### 1. Dual-Role System (Demo Mode)
- **Role Switcher:** Instantly toggle between **Project Owner** and **Site Worker** views using the dev-switcher at the top of the screen.
- **Frictionless Entry:** The login system has been completely removed to create a frictionless, ready-to-use demo state. Anyone with the link can test the app without signing up.

### 2. Site Worker Field Interface
- **Mobile-First UI:** A streamlined, touch-friendly interface designed to be used by workers on their phones in the field.
- **Task Execution:** View assigned tasks for the day and check them off as completed in real-time.
- **Issue Reporting:** Quickly flag blockers or problems (e.g., "Pipe burst", "Missing permit") directly to the owner.
- **Material Requests:** Submit structured requests for needed supplies (e.g., "5 bags of concrete") to keep the job moving.
- **Photo Uploads:** Attach visual evidence of completed work or reported problems.

### 3. Project Owner Dashboard
- **Multi-Site Management:** Switch between different active construction sites to monitor progress.
- **Real-Time Progress Tracking:** Watch task completion bars update live as workers check them off on-site.
- **Action Center:** A centralized inbox to review and resolve reported issues and approve material requests.
- **Team Overview:** View assigned workers and supervisors for each project.

---

## 🛠️ Integrations & Tech Stack

### Frontend Architecture
- **Framework:** React 18 with TypeScript.
- **Build Tool:** Vite for lightning-fast compilation and HMR.
- **Styling:** Tailwind CSS for a modern, responsive, and highly customizable UI.
- **Icons:** `lucide-react` for clean, professional iconography.

### Backend & Integrations
- **Firebase Firestore:** Integrated as the primary NoSQL database. It powers the **real-time synchronization** across the app. When a worker checks off a task, the owner sees it instantly without refreshing the page.
- **Environment Agnostic:** All Firebase credentials have been abstracted into standard `VITE_FIREBASE_*` environment variables for secure, portable deployment.

### Deployment Preparedness
- **Vercel & Netlify Ready:** Pre-configured with `vercel.json` and `netlify.toml` routing rules to perfectly support Single Page Application (SPA) routing.
- **Zero-Config Export:** Fully decoupled from the proprietary development environment; it can be cloned to a local machine, deployed to Vercel, or pushed to GitHub immediately.
