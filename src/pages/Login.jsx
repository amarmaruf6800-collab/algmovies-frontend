import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            if (isRegisterMode) {
                await axios.post('/api/auth/register-user', { username, password });
                setMessage('Akun berhasil dibuat! Silakan Login.');
                setIsRegisterMode(false);
                setUsername(''); setPassword('');
            } else {
                const response = await axios.post('/api/auth/login', { username, password });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);

                if (response.data.role === 'admin') navigate('/admin');
                else navigate('/');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Terjadi kesalahan! Coba lagi.');
        }
    };

    const theme = { bgMain: '#0b0f19', bgCard: '#151b2b', primary: '#1db954', textMain: '#ffffff', textMuted: '#94a3b8' };

    return (
        <div style={{ background: `linear-gradient(135deg, ${theme.bgMain} 0%, #111827 100%)`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMain, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ backgroundColor: theme.bgCard, padding: '50px', borderRadius: '16px', width: '100%', maxWidth: '400px', margin: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid #1f2937' }}>

                <h1 style={{ color: theme.primary, textAlign: 'center', margin: '0 0 10px 0', fontSize: '32px', fontWeight: '900', letterSpacing: '1px' }}>ALGMOVIES</h1>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.textMuted, fontSize: '16px', fontWeight: 'normal' }}>
                    {isRegisterMode ? 'Buat Akun Penonton' : 'Masuk ke Akun Anda'}
                </h2>

                {message && <p style={{ backgroundColor: message.includes('berhasil') ? 'rgba(29, 185, 84, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('berhasil') ? theme.primary : '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', border: `1px solid ${message.includes('berhasil') ? theme.primary : '#ef4444'}` }}>{message}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    <input
                        type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required
                        style={{ padding: '15px', backgroundColor: theme.bgMain, color: theme.textMain, border: '1px solid #374151', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
                    />
                    <input
                        type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        style={{ padding: '15px', backgroundColor: theme.bgMain, color: theme.textMain, border: '1px solid #374151', borderRadius: '8px', fontSize: '16px', outline: 'none' }}
                    />
                    <button type="submit" style={{ backgroundColor: theme.primary, color: '#000', padding: '15px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        {isRegisterMode ? 'Daftar Sekarang' : 'Masuk'}
                    </button>
                </form>

                <p style={{ marginTop: '30px', color: theme.textMuted, textAlign: 'center', fontSize: '14px' }}>
                    {isRegisterMode ? 'Sudah punya akun? ' : 'Baru di ALGMOVIES? '}
                    <span onClick={() => { setIsRegisterMode(!isRegisterMode); setMessage(''); }} style={{ color: theme.primary, cursor: 'pointer', fontWeight: 'bold' }}>
                        {isRegisterMode ? 'Login di sini.' : 'Daftar sekarang.'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;