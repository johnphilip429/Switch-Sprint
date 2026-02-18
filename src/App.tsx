import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Applications } from './pages/Applications';
import { StudyPlan } from './pages/StudyPlan';
import { Resources } from './pages/Resources';
import { Analytics } from './pages/Analytics';
import { MockInterview } from './pages/MockInterview';
import { Networking } from './pages/Networking';
import { Resumes } from './pages/Resumes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="interview" element={<MockInterview />} />
        <Route path="networking" element={<Networking />} />
        <Route path="resumes" element={<Resumes />} />
        <Route path="study" element={<StudyPlan />} />
        <Route path="resources" element={<Resources />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
