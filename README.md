# TalentFlow – A Mini Hiring Platform

A React-based application for managing **Jobs**, **Candidates**, and **Assessments**.  
This project was built as a **front-end only** technical assignment – all data is persisted locally using IndexedDB and a simulated REST API (MSW).

---

## 🚀 Features

### Jobs
- Create, edit, archive/unarchive jobs  
- Reorder via drag-and-drop (with optimistic updates + rollback)  
- Filter by title, status, or tags  
- Deep links: `/jobs/:jobId`

### Candidates
- Virtualized list (1,000+ seeded candidates) with search & stage filters  
- Kanban board for stage transitions (drag-and-drop)  
- Candidate profile with timeline of stage changes

### Assessments
- Builder per job: add sections and questions (short/long text, choice, numeric)  
- Live preview pane for form rendering  
- State & responses saved locally

---

## 🛠️ Tech Stack

- **React + Vite + TypeScript**
- **TailwindCSS** (with shadcn/ui)
- **MSW** for mock API
- **Dexie** for IndexedDB
- **@tanstack/react-query** for data fetching & caching
- **@dnd-kit** for drag & drop
- **react-hook-form + zod** for forms & validation

---

## 📦 Setup & Run

```bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/talentflow.git
cd talentflow

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start dev server
npm run dev
