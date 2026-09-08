import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function AdminDashboard() {
    const [movies, setMovies] = useState([]);

    // Form State
    const [judul, setJudul] = useState('');
    const [tahun, setTahun] = useState('');
    const [sutradara, setSutradara] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [genre, setGenre] = useState('');
    const [trailerUrl, setTrailerUrl] = useState('');

    // Image Specific State (Two Options)
    const [image, setImage] = useState(null); // For local file
    const [imageUrl, setImageUrl] = useState(''); // For Google link

    const [editId, setEditId] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Automatic Genre Category List
    const genreOptions = [
        "Action", "Drama", "Romance", "Horror", "Sci-Fi",
        "Comedy", "Thriller", "Fantasy", "Documentary", "Animation", "Mystery", "Crime"
    ];

    useEffect(() => {
        if (!token) navigate('/login');
        else fetchMovies();
    }, [token, navigate]);

    const fetchMovies = async () => {
        try {
            const response = await axios.get('https://darkish-squeeze-smirk.ngrok-free.dev//api/movies');
            setMovies(response.data.data);
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    };

    const handleEdit = (movie) => {
        setJudul(movie.judul); setTahun(movie.tahun); setSutradara(movie.sutradara);
        setDeskripsi(movie.deskripsi || ''); setGenre(movie.genre || ''); setTrailerUrl(movie.trailer_url || '');
        setEditId(movie.id);

        // Reset image form when editing
        setImage(null);
        setImageUrl('');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Permanently delete this movie from the database?')) {
            try {
                await axios.delete(`https://darkish-squeeze-smirk.ngrok-free.dev//api/movies/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchMovies();
            } catch (error) { alert('Failed to delete data.'); }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('judul', judul); formData.append('tahun', tahun); formData.append('sutradara', sutradara);
        formData.append('deskripsi', deskripsi); formData.append('genre', genre); formData.append('trailer_url', trailerUrl);

        // Send image (File or URL)
        if (image) formData.append('image', image);
        if (imageUrl) formData.append('imageUrl', imageUrl);

        try {
            if (editId) {
                await axios.put(`https://darkish-squeeze-smirk.ngrok-free.dev//api/movies/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });
                alert('Movie updated!'); setEditId(null);
            } else {
                await axios.post('https://darkish-squeeze-smirk.ngrok-free.dev//api/movies', formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });
                alert('Movie added!');
            }
            resetForm();
            fetchMovies();
        } catch (error) { alert('An error occurred while saving data.'); }
    };

    const resetForm = () => {
        setJudul(''); setTahun(''); setSutradara(''); setDeskripsi('');
        setGenre(''); setTrailerUrl(''); setImage(null); setImageUrl(''); setEditId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/');
    };

    const theme = { bgMain: '#0b0f19', bgCard: '#151b2b', primary: '#1db954', textMain: '#ffffff', textMuted: '#94a3b8', border: '#1f2937' };
    const inputStyle = { width: '100%', padding: '12px', boxSizing: 'border-box', backgroundColor: theme.bgMain, color: theme.textMain, border: `1px solid ${theme.border}`, borderRadius: '6px', outline: 'none' };

    return (
        <div style={{ backgroundColor: theme.bgMain, minHeight: '100vh', color: theme.textMain, fontFamily: "'Inter', sans-serif" }}>

            {/* Top Navbar Dashboard */}
            <div style={{ backgroundColor: theme.bgCard, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}` }}>
                <h2 style={{ margin: 0, color: theme.primary, letterSpacing: '1px' }}>ALGMOVIES <span style={{ color: theme.textMain, fontSize: '18px', fontWeight: 'normal' }}>| CMS</span></h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/" style={{ color: theme.textMuted, textDecoration: 'none', fontWeight: 'bold' }}>View Public Website</Link>
                    <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
                </div>
            </div>

            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Form Panel */}
                <div style={{ backgroundColor: theme.bgCard, padding: '30px', borderRadius: '12px', border: `1px solid ${theme.border}`, marginBottom: '40px' }}>
                    <h3 style={{ marginTop: 0, color: theme.primary }}>{editId ? `✏️ Edit Film ID: ${editId}` : '➕ Add New Movie Catalog'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: theme.textMuted }}>Movie Title</label>
                                <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: theme.textMuted }}>Select Genre Category</label>
                                {/* GENRE DROPDOWN CODE */}
                                <select value={genre} onChange={(e) => setGenre(e.target.value)} required style={inputStyle}>
                                    <option value="" disabled>-- Select Genre --</option>
                                    {genreOptions.map((g, index) => (
                                        <option key={index} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: theme.textMuted }}>Release Year</label>
                                <input type="number" value={tahun} onChange={(e) => setTahun(e.target.value)} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: theme.textMuted }}>Director</label>
                                <input type="text" value={sutradara} onChange={(e) => setSutradara(e.target.value)} required style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: theme.textMuted }}>YouTube Trailer Link</label>
                            <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={trailerUrl} onChange={(e) => setTrailerUrl(e.target.value)} style={inputStyle} />
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: theme.textMuted }}>Full Synopsis</label>
                            <textarea rows="3" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
                        </div>

                        {/* DUAL IMAGE SOURCE CODE */}
                        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: `1px solid ${theme.border}`, marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '15px', color: '#fff', fontWeight: 'bold' }}>🖼️ Poster Image Source (Fill One Only)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: theme.primary, fontSize: '14px' }}>Option 1: Upload from Laptop/PC</label>
                                    <input type="file" onChange={(e) => { setImage(e.target.files[0]); setImageUrl(''); }} style={{ color: theme.textMuted }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: theme.primary, fontSize: '14px' }}>Option 2: Paste Web Image URL (Google/IMDb)</label>
                                    <input type="text" placeholder="https://example.com/poster.jpg" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImage(null); }} style={inputStyle} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button type="submit" style={{ backgroundColor: theme.primary, color: '#000', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {editId ? 'Save Changes' : 'Publish Movie'}
                            </button>
                            {editId && (
                                <button type="button" onClick={resetForm} style={{ backgroundColor: 'transparent', color: theme.textMain, border: `1px solid ${theme.border}`, padding: '12px 25px', borderRadius: '6px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Data Table Management */}
                <div style={{ backgroundColor: theme.bgCard, padding: '30px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                    <h3 style={{ marginTop: 0, color: theme.textMain }}>Total Database Catalog ({movies.length} Movies)</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1f2937', textAlign: 'left' }}>
                                <th style={{ padding: '15px', borderRadius: '8px 0 0 0' }}>Poster</th>
                                <th style={{ padding: '15px' }}>Title</th>
                                <th style={{ padding: '15px' }}>Category</th>
                                <th style={{ padding: '15px' }}>Year</th>
                                <th style={{ padding: '15px', textAlign: 'center', borderRadius: '0 8px 0 0' }}>Management Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((m) => (
                                <tr key={m.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                    <td style={{ padding: '15px' }}>
                                        {m.foto ? <img src={m.foto} alt="" style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} /> : 'No Image'}
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{m.judul}</td>
                                    <td style={{ padding: '15px' }}><span style={{ backgroundColor: '#374151', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{m.genre}</span></td>
                                    <td style={{ padding: '15px', color: theme.textMuted }}>{m.tahun}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button onClick={() => handleEdit(m)} style={{ backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}>Edit</button>
                                        <button onClick={() => handleDelete(m.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;