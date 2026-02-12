import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        const result = await loginUser(username, password);
        if (result) {
            navigate('/');
        } else {
            setError('ACCESS DENIED: Invalid credentials');
        }
    };

    const handleRegister = async () => {
        setError('');
        if (!username || !password) {
            setError('ERROR: Empty fields');
            return;
        }
        const success = await registerUser(username, password);
        if (success) {
            alert('AGENT REGISTERED. PLEASE LOGIN.');
        } else {
            setError('REGISTRATION FAILED: User exists?');
        }
    };

    return (
        <div id="login-screen">
            <div className="login-box">
                <h1 className="glitch-text">ACCESS CONTROL</h1>
                <p>COUNCIL OF RICKS DATABASE</p>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="ENTER AGENT ID..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="ENTER PASSWORD..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="auth-buttons">
                    <button className="auth-btn" onClick={handleLogin}>LOGIN</button>
                    <button className="auth-btn register" onClick={handleRegister}>NEW AGENT REGISTRATION</button>
                </div>

                <p style={{ marginTop: '15px', height: '20px', color: 'var(--rick-error)', fontWeight: 'bold' }}>
                    {error}
                </p>
            </div>

            <div className="crt-overlay"></div>
        </div>
    );
};