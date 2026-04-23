import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Explore from './pages/Explore';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Navigation from './components/Navigation';
import { UserProfile } from './types';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem('bookBridge_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans pb-24">
      <Routes>
        <Route path="/" element={profile ? <Home profile={profile} onUpdateProfile={(p) => {
          setProfile(p);
          localStorage.setItem('bookBridge_profile', JSON.stringify(p));
        }} /> : <Onboarding onComplete={(p) => {
          setProfile(p);
          localStorage.setItem('bookBridge_profile', JSON.stringify(p));
          navigate('/');
        }} />} />
        <Route path="/explore" element={profile ? <Explore profile={profile} onUpdateProfile={(p) => {
          setProfile(p);
          localStorage.setItem('bookBridge_profile', JSON.stringify(p));
        }} /> : null} />
        <Route path="/library" element={profile ? <Library profile={profile} onUpdateProfile={(p) => {
          setProfile(p);
          localStorage.setItem('bookBridge_profile', JSON.stringify(p));
        }} /> : null} />
        <Route path="/settings" element={<Settings profile={profile} onUpdate={(p) => {
          setProfile(p);
          localStorage.setItem('bookBridge_profile', JSON.stringify(p));
        }} />} />
      </Routes>
      {profile && <Navigation />}
    </div>
  );
}
