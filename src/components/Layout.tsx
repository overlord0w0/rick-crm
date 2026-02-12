import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
    return (
        <>
            <div className="crt-overlay"></div>

            <div id="gadget-frame">
                <Sidebar />

                <main id="main-screen">
                    <div id="top-bar">
                        <div style={{ color: 'var(--rick-green)', fontSize: '0.8rem' }}>
                            SYSTEM STATUS: ONLINE
                        </div>
                    </div>

                    <div className="view-section">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
};