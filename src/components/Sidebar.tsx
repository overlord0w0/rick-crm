import { Link, useLocation } from 'react-router-dom';
import { Shield, Users, Map, FileText, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../api';

export const Sidebar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path ? 'nav-btn active' : 'nav-btn';

    return (
        <aside id="sidebar">
            <h2 style={{ color: 'var(--rick-blue)' }}>SMDS v5.0</h2>

            <nav className="nav-menu">
                <Link to="/" className={isActive('/')}>
                    <Users size={20} />
                    [ AGENTS DB ]
                </Link>

                <Link to="/profile" className={isActive('/profile')}>
                    <Shield size={20} />
                    [ MY DOSSIER ]
                </Link>

                <Link to="/map" className={isActive('/map')}>
                    <Map size={20} />
                    [ GALAXY MAP ]
                </Link>

                <Link to="/admin" className={isActive('/admin')} style={{color: location.pathname === '/admin' ? 'black' : 'var(--rick-error)', borderColor: 'var(--rick-error)'}}>
                    <FileText size={20} />
                    [ CLASSIFIED ]
                </Link>
            </nav>

            <div style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>
                USER: <span id="user-display">{getCurrentUser() || 'GUEST'}</span><br />
                LEVEL: 1
            </div>

            <button className="nav-btn" onClick={logoutUser} style={{
                marginTop: '15px',
                borderColor: 'var(--rick-error)',
                color: 'var(--rick-error)'
            }}>
                <LogOut size={20} />
                [ SYSTEM EXIT ]
            </button>
        </aside>
    );
};