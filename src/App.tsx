import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { MainLayout } from './components/ui/layout/MainLayout';
import { JobsPage } from './pages/JobsPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { AssessmentBuilderPage } from './pages/AssessmentBuilderPage';
import CandidateDashboard from './pages/CandidateDashboard';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId/assessment" element={<AssessmentBuilderPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
          <Route path="/dashboard" element={<CandidateDashboard />} />
        </Routes>
      </MainLayout>
      <Toaster />
    </Router>
  );
}

export default App;
