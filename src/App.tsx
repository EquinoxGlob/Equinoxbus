import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { useReferralEngine } from './hooks/useReferralEngine';
import Landing from './components/Landing';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Membership from './pages/Membership';
import Network from './pages/Network';
import Wallet from './pages/Wallet';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Community from './pages/Community';
import AdminPanel from './pages/Admin';

export default function App() {
  const { isConnected } = useAppContext();
  useReferralEngine(); // Bulletproof Global Referral Capture

  if (!isConnected) {
    return <Landing />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/join" element={<Navigate to="/" replace />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/network" element={<Network />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/community" element={<Community />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
