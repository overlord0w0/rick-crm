import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Agents } from './pages/Agents';
import { GalaxyMap } from './pages/GalaxyMap';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Agents />} />
                <Route path="agents" element={<Agents />} />
                <Route path="map" element={<GalaxyMap />} />
                <Route path="profile" element={<Profile />} />
                <Route path="admin" element={<Admin />} />

                <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;