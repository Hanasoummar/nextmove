
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import {
  Sparkles,
  BriefcaseBusiness,
  Briefcase,
  CircleDot,
} from 'lucide-react';

import ExtractPage from './pages/ExtractPage';
import ApplicationsPage from './pages/ApplicationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell min-h-screen text-slate-100">
        <aside className="sidebar">
          <NavLink to="/" className="brand">
            <div className="brand-icon">
              <Briefcase size={19} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                NEXTMOVE
              </h1>
              <p className="brand-caption">CAREER WORKSPACE</p>
            </div>
          </NavLink>

          <div className="sidebar-navigation">
            <p className="nav-label">WORKSPACE</p>

            <nav className="mt-3 space-y-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
              >
                <Sparkles className="nav-icon" size={16} strokeWidth={1.8} />
                <span className="nav-text">AI Job Extractor</span>
              </NavLink>

              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
              >
                <BriefcaseBusiness className="nav-icon" size={16} strokeWidth={1.8} />
                <span className="nav-text">My Applications</span>
              </NavLink>
            </nav>
          </div>

          <div className="sidebar-bottom">
            <div className="sidebar-promo">
              <div className="sidebar-promo-icon">
                <Sparkles size={15} strokeWidth={1.8} />
              </div>
              <p className="text-xs font-semibold text-slate-200">
                Your next opportunity
              </p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Stay organized and keep moving forward.
              </p>
            </div>
          </div>
        </aside>

        <div className="main-area">
          <header className="topbar">
  <div>
    <p className="topbar-eyebrow">NEXTMOVE</p>
    <p className="mt-1 text-sm font-semibold text-slate-200">
      Your Career Workspace
    </p>
  </div>

  <div className="workspace-status">
    <CircleDot size={13} strokeWidth={1.8} />
    <span>Workspace active</span>
  </div>
</header>

          <main className="content-area">
            <Routes>
              <Route path="/" element={<ExtractPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
            </Routes>
          </main>

          <footer className="app-footer">
            NEXTMOVE · Build your career, one opportunity at a time.
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}
