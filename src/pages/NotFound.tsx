import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="view-section" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            textAlign: 'center'
        }}>
            <h1 className="glitch-text" style={{ fontSize: '4rem', color: 'red', margin: 0 }}>404</h1>
            <h2 style={{ color: 'var(--rick-green)' }}>DIMENSION NOT FOUND</h2>

            <p style={{ maxWidth: '400px', margin: '20px 0', color: '#888' }}>
                The portal gun coordinates you entered do not correspond to any known reality.
                You are floating in the void between dimensions.
            </p>

            <div style={{
                width: '150px', height: '150px',
                background: 'radial-gradient(circle, #00ff00 0%, transparent 70%)',
                borderRadius: '50%',
                marginBottom: '30px',
                boxShadow: '0 0 50px var(--rick-green)',
                animation: 'spin 10s linear infinite'
            }}></div>

            <button className="action-btn" onClick={() => navigate('/')}>
                OPEN PORTAL HOME
            </button>

            <style>{`
        @keyframes spin { 
            from { transform: rotate(0deg); } 
            to { transform: rotate(360deg); } 
        }
      `}</style>
        </div>
    );
};