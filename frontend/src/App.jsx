import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute, AdminRoute } from './components/auth/RouteGuards';

// Layouts
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';

// Auth Pages
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import Chat from './pages/student/Chat';
import ParagraphTool from './pages/student/ParagraphTool';
import Goals from './pages/student/Goals';
import Roadmaps from './pages/student/Roadmaps';
import BrainGym from './pages/student/BrainGym';
import MentalHealth from './pages/student/MentalHealth';
import CareerAI from './pages/student/CareerAI';
import Profile from './pages/student/Profile';
import LifeHacks from './pages/student/LifeHacks';
import StudyHacks from './pages/student/StudyHacks';
import Progress from './pages/student/Progress';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AllStudents from './pages/admin/AllStudents';
import AddStudent from './pages/admin/AddStudent';
import UploadCSV from './pages/admin/UploadCSV';
import EmailLogs from './pages/admin/EmailLogs';
import PromptEditor from './pages/admin/PromptEditor';
import BrainGymScores from './pages/admin/ContentManager';
import Settings from './pages/admin/Settings';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Onboarding - Protected but not fully onboarded */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            
            {/* Student Routes */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="chat" element={<Chat />} />
              <Route path="paragraph-tool" element={<ParagraphTool />} />
              <Route path="goals" element={<Goals />} />
              <Route path="roadmaps" element={<Roadmaps />} />
              <Route path="neuroscience" element={<BrainGym />} />
              <Route path="mental-health" element={<MentalHealth />} />
              <Route path="career" element={<CareerAI />} />
              <Route path="profile" element={<Profile />} />
              <Route path="life-hacks" element={<LifeHacks />} />
              <Route path="study-hacks" element={<StudyHacks />} />
              <Route path="progress" element={<Progress />} />
            </Route>

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminDashboard />} />
              <Route path="students" element={<AllStudents />} />
              <Route path="add-student" element={<AddStudent />} />
              <Route path="upload-csv" element={<UploadCSV />} />
              <Route path="email-logs" element={<EmailLogs />} />
              <Route path="prompt-editor" element={<PromptEditor />} />
              <Route path="content" element={<BrainGymScores />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
