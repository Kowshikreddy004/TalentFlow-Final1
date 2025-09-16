TALENTFLOW - A Mini Hiring Platform
<div align="center">

A front-end application built for a React technical assignment. It simulates a hiring platform where an HR team can manage jobs, candidates, and assessments, all powered by a mock API layer and local persistence.

</div>

<div align="center">

</div>

Live Demo & Repository
Live Application

Source Code

[DEPLOYED LINK ON VERCEL/NETLIFY] (replace this)

[LINK TO YOUR GITHUB REPO] (replace this)

Core Features
This application fully implements the core flows specified in the project requirements:

Jobs Board Management:

List & Filter: View all jobs with their current status and tags.

Drag-and-Drop Reordering: Change the order of job listings with a smooth drag-and-drop interface.

Optimistic Updates: UI updates instantly upon reordering. If the mock API returns an error (as it's designed to do intermittently), the changes are automatically rolled back, providing a seamless user experience.

Create & Edit: Functionality to add new jobs and edit existing ones via a modal.

Candidates Kanban Board:

Kanban View: Manage the entire candidate pipeline by dragging candidates between stages (Applied, Screen, Tech, Offer, Hired, Rejected).

Client-Side Search: Instantly search through the list of 1,000+ seeded candidates by name or email.

Persistent State: All candidate movements are saved to the local database.

Dynamic Assessment Builder:

Live Form Preview: A sophisticated interface to build job-specific assessment forms with a live preview pane that updates as you add or modify questions.

Multiple Question Types: Supports various fields like short text, long text, single-choice, and more.

Local Persistence: The state of the assessment builder is automatically saved to the browser's local storage, so no work is lost on refresh.

Architecture & Technical Decisions
The primary architectural goal was to build a front-end application that behaves as if it were connected to a real, stateful backend server. This was achieved through a three-layer architecture:

UI Layer (Vite + React): The user interface, built with modern tools for a fast and responsive experience.

Mock API Layer (MSW - Mock Service Worker): This is the "fake backend." MSW intercepts all fetch requests at the network level. This is a critical decision because it means the application code is completely agnostic of the mock server. We can swap MSW for a real API in the future without changing a single line of application code. MSW was also configured to simulate real-world network conditions, including artificial latency (200-1200ms) and a 5-10% random error rate on write operations to test resilience.

Persistence Layer (Dexie.js for IndexedDB): This is the "database." All data is stored locally in the browser's IndexedDB. MSW acts as a write-through layer to Dexie, meaning every successful POST or PATCH request updates the local database. On application load, the state is rehydrated from this database, ensuring all user changes persist across sessions.

Tech Stack
Category

Technology

Framework

React (with Vite)

Styling

Tailwind CSS & ShadCN/UI

State Management

TanStack Query (React Query) for server state

Routing

React Router DOM

API Mocking

Mock Service Worker (MSW)

Local Database

Dexie.js (IndexedDB Wrapper)

Drag & Drop

dnd-kit

Forms

React Hook Form & Zod for schema validation

Data Seeding

Faker.js

Local Setup and Installation
To run this project on your local machine, follow these steps:

Clone the Repository

git clone [YOUR_REPOSITORY_URL]
cd talentflow-app

Install Dependencies

npm install

Run the Development Server

npm run dev

The application will now be running on http://localhost:5173. The msw service worker will intercept API calls, and the dexie database will be seeded with data on the first load.

Known Issues & Future Improvements
Candidate List Virtualization: The current implementation of the Kanban board renders all candidates in each stage. For optimal performance with the seeded 1,000+ candidates, this list should be virtualized using a library like @tanstack/react-virtual to only render the items visible in the viewport.

Advanced Assessment Logic: The assessment builder's conditional logic (e.g., show Question 3 only if Question 1 is "Yes") has not been implemented. This would require a more complex form state management strategy.

Deep Linking & Modals: While the structure is in place, the specific routes for /jobs/:jobId and /candidates/:id need to be fully implemented, along with the modals for creating and editing jobs.
