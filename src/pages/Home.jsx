import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [viewMode, setViewMode] = useState('home');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const genreOptions = ["All", "Action", "Drama", "Romance", "Horror", "Sci-Fi", "Comedy", "Thriller", "Fantasy", "Documentary", "Animation", "Mystery", "Crime"];

  useEffect(() => {
    getMovies(1);
    if (token) fetchWatchlist();
  }, [token]);

  const getMovies = async (pageNumber = 1) => {
    try {
      if (pageNumber > 1) setIsLoadingMore(true);
      const response = await axios.get(`/api/movies?page=${pageNumber}&limit=3`);
      if (pageNumber === 1) setMovies(response.data.data);
      else setMovies((prev) => [...prev, ...response.data.data]);

      setPage(pageNumber);
      setHasNextPage(response.data.pagination?.hasNextPage || false);
      setIsLoadingMore(false);
    } catch (error) {
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => getMovies(page + 1);

  const handleSearch = async (e) => {
    e.preventDefault();
    setViewMode('home');
    setSelectedGenre('All');
    if (!searchQuery) return getMovies(1);
    try {
      const response = await axios.get(`/api/movies/search?q=${searchQuery}`);
      setMovies(response.data.data);
      setHasNextPage(false);
    } catch (error) { console.error(error); }
  };

  const handleGenreChange = async (e) => {
    const g = e.target.value;
    setSelectedGenre(g);
    setViewMode('home');
    setSearchQuery('');

    if (g === 'All') {
      getMovies(1);
    } else {
      try {
        const response = await axios.get(`/api/movies/search?q=${g}`);
        setMovies(response.data.data);
        setHasNextPage(false);
      } catch (error) { console.error(error); }
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get('/api/watchlist', { headers: { Authorization: `Bearer ${token}` } });
      setWatchlist(response.data.data);
    } catch (error) { }
  };

  const handleAddWatchlist = async (movieId) => {
    try {
      // Mengirimkan format movieId dan movie_id sekaligus agar backend tidak salah tangkap
      await axios.post('/api/watchlist', { movieId: movieId, movie_id: movieId }, { headers: { Authorization: `Bearer ${token}` } });
      fetchWatchlist();
    } catch (error) {
      console.error(error);
      alert('Failed to add to watchlist');
    }
  };

  const handleRemoveWatchlist = async (watchlistId) => {
    try {
      await axios.delete(`/api/watchlist/${watchlistId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchWatchlist();
    } catch (error) { }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('role'); setWatchlist([]); navigate('/');
  };

  const resetToHome = () => {
    setViewMode('home'); setSelectedGenre('All'); setSearchQuery(''); getMovies(1); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  let displayMovies = viewMode === 'watchlist' ? watchlist : movies;

  // Premium theme with dark tones and neon accents
  const theme = {
    bgMain: '#080c18',
    bgCard: 'rgba(255,255,255,0.04)',
    bgCardSolid: '#0f172a',
    primary: '#00e676',
    primaryDim: 'rgba(0, 230, 118, 0.15)',
    textMain: '#f1f5f9',
    textMuted: '#94a3b8',
    borderLight: 'rgba(255,255,255,0.06)',
    glassBg: 'rgba(8, 12, 24, 0.75)',
  };

  return (
    <div
      style={{
        backgroundColor: theme.bgMain,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: theme.textMain,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .premium-card {
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid ${theme.borderLight};
          background: ${theme.bgCard};
          border-radius: 20px;
          overflow: hidden;
        }
        .premium-card:hover {
          transform: translateY(-8px);
          background: rgba(255,255,255,0.07);
          border-color: ${theme.primary}40;
          box-shadow: 0 20px 40px -12px rgba(0, 230, 118, 0.2);
        }

        .play-overlay {
          opacity: 0;
          transition: opacity 0.4s ease;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .premium-card:hover .play-overlay {
          opacity: 1;
        }
        .play-overlay:hover .play-circle {
          transform: scale(1.08);
          box-shadow: 0 0 40px ${theme.primary}70;
        }

        .btn-glow {
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-glow:hover {
          transform: scale(1.04);
          box-shadow: 0 0 30px ${theme.primary}60;
        }

        .custom-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300e676%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 1.2rem top 50%;
          background-size: 0.7rem auto;
          padding-right: 3rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-color: rgba(255,255,255,0.04);
          color: ${theme.textMain};
          border: 1px solid ${theme.borderLight};
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          min-width: 170px;
          outline: none;
        }
        .custom-select:focus {
          border-color: ${theme.primary};
          box-shadow: 0 0 0 3px ${theme.primary}30;
        }
        .custom-select option {
          background: ${theme.bgCardSolid};
          color: ${theme.textMain};
        }

        .input-premium {
          background: rgba(255,255,255,0.04);
          border: 1px solid ${theme.borderLight};
          color: ${theme.textMain};
          padding: 12px 20px;
          border-radius: 12px 0 0 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 200px;
        }
        .input-premium:focus {
          border-color: ${theme.primary};
          box-shadow: 0 0 0 3px ${theme.primary}30;
        }
        .input-premium::placeholder {
          color: ${theme.textMuted}80;
        }

        .search-btn {
          background: ${theme.primary};
          color: #000;
          padding: 12px 24px;
          border: none;
          border-radius: 0 12px 12px 0;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          transition: background 0.2s;
        }
        .search-btn:hover {
          background: #00c853;
        }

        .nav-blur {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: ${theme.glassBg};
          border-bottom: 1px solid ${theme.borderLight};
          padding: 16px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: ${theme.primary};
          cursor: pointer;
          transition: all 0.3s ease;
          text-shadow: 0 0 20px ${theme.primary}30;
          margin: 0;
        }
        .logo:hover {
          transform: scale(1.02);
          text-shadow: 0 0 40px ${theme.primary}60;
        }

        .hero-gradient {
          background: linear-gradient(to bottom, rgba(8,12,24,0.1) 0%, rgba(8,12,24,0.6) 70%, ${theme.bgMain} 100%);
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-animate {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .badge-primary {
          background: ${theme.primaryDim};
          color: ${theme.primary};
          border: 1px solid ${theme.primary}40;
          padding: 6px 18px;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          display: inline-block;
        }

        .footer-link {
          color: ${theme.textMuted};
          cursor: default;
          margin-bottom: 8px;
          font-size: 14px;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: ${theme.textMain};
        }

        @media (max-width: 768px) {
          .nav-blur { padding: 12px 20px; flex-wrap: wrap; gap: 12px; }
          .logo { font-size: 24px; }
          .hero-title { font-size: 40px !important; }
          .hero-desc { font-size: 15px !important; }
          .hero-btn { padding: 14px 30px !important; font-size: 16px !important; }
          .input-premium { width: 150px; }
          .custom-select { min-width: 140px; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="nav-blur">
        <h1 className="logo" onClick={resetToHome}>
          ALGMOVIES
        </h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {!token ? (
            <Link
              to="/login"
              className="btn-glow"
              style={{
                backgroundColor: theme.primary,
                color: '#000',
                padding: '10px 28px',
                borderRadius: '40px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px',
                letterSpacing: '0.3px',
              }}
            >
              Login / Sign Up
            </Link>
          ) : (
            <>
              {role === 'admin' ? (
                <Link
                  to="/admin"
                  className="btn-glow"
                  style={{
                    backgroundColor: '#fff',
                    color: '#000',
                    padding: '10px 24px',
                    borderRadius: '40px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setViewMode(viewMode === 'watchlist' ? 'home' : 'watchlist');
                    setSelectedGenre('All');
                  }}
                  style={{
                    backgroundColor: viewMode === 'watchlist' ? theme.primary : 'transparent',
                    color: viewMode === 'watchlist' ? '#000' : theme.textMain,
                    padding: '10px 24px',
                    border: viewMode === 'watchlist' ? 'none' : `1px solid ${theme.borderLight}`,
                    borderRadius: '40px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {viewMode === 'watchlist' ? '← Back' : 'My Watchlist'}
                </button>
              )}
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: theme.textMuted,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '14px',
                  padding: '8px 12px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.textMuted)}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO BANNER */}
      {viewMode === 'home' && movies.length > 0 && selectedGenre === 'All' && !searchQuery && (
        <div
          style={{
            position: 'relative',
            height: '75vh',
            minHeight: '560px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${movies[0].foto})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              filter: 'brightness(0.7) saturate(1.1)',
            }}
          />
          <div className="hero-gradient" />

          <div
            className="hero-animate"
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '800px',
              textAlign: 'center',
              padding: '0 20px',
            }}
          >
            <span className="badge-primary">#1 Highlight Today</span>
            <h1
              className="hero-title"
              style={{
                color: '#fff',
                fontSize: 'clamp(44px, 8vw, 80px)',
                margin: '20px 0 16px',
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: '-2px',
                textShadow: '0 4px 30px rgba(0,0,0,0.6)',
              }}
            >
              {movies[0].judul}
            </h1>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px 20px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '24px',
                color: theme.textMuted,
                fontWeight: 500,
                fontSize: '15px',
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              }}
            >
              <span>{movies[0].tahun}</span>
              <span>•</span>
              <span>{movies[0].genre}</span>
              <span>•</span>
              <span style={{ color: theme.primary }}>4K Ultra HD</span>
            </div>
            <p
              className="hero-desc"
              style={{
                color: '#cbd5e1',
                fontSize: 'clamp(16px, 1.2vw, 20px)',
                margin: '0 0 40px',
                lineHeight: 1.7,
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              }}
            >
              {movies[0].deskripsi
                ? movies[0].deskripsi.substring(0, 200) + '...'
                : 'Watch exclusive trailers and explore the best cinema world only on ALGMOVIES.'}
            </p>
            <Link
              to={`/movie/${movies[0].id}`}
              className="btn-glow hero-btn"
              style={{
                backgroundColor: theme.primary,
                color: '#000',
                padding: '18px 48px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                letterSpacing: '0.3px',
              }}
            >
              <span style={{ fontSize: '22px', lineHeight: 1 }}>▶</span> PLAY TRAILER
            </Link>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          padding: viewMode === 'home' ? '0 48px 80px' : '40px 48px 80px',
          marginTop: viewMode === 'watchlist' ? '0' : '-40px',
          position: 'relative',
          zIndex: 10,
          flex: 1,
        }}
      >
        {/* TOP CONTROLS */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(24px, 3vw, 34px)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#fff',
            }}
          >
            {viewMode === 'watchlist'
              ? 'My Watchlist'
              : searchQuery
                ? `Search Results: “${searchQuery}”`
                : 'Explore Catalog'}
            {!searchQuery && viewMode === 'home' && (
              <span style={{ color: theme.primary }}>.</span>
            )}
          </h2>

          {viewMode === 'home' && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                className="custom-select"
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                {genreOptions.map((g) => (
                  <option key={g} value={g}>
                    {g === 'All' ? 'All Genres' : g}
                  </option>
                ))}
              </select>

              <form onSubmit={handleSearch} style={{ display: 'flex' }}>
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-premium"
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* MOVIE GRID */}
        {displayMovies.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '120px 0',
              color: theme.textMuted,
            }}
          >
            <h3 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '16px' }}>
              {viewMode === 'watchlist' ? 'Your watchlist is still empty.' : 'Oops! Movie not found.'}
            </h3>
            <button
              onClick={resetToHome}
              style={{
                marginTop: '8px',
                background: 'transparent',
                color: theme.primary,
                border: `1px solid ${theme.primary}`,
                padding: '12px 32px',
                borderRadius: '40px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.primaryDim;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '32px',
            }}
          >
            {displayMovies.map((movie) => {
              // Menangkap ID film dengan tangguh (mengantisipasi kolom id atau movie_id)
              const currentMovieId = movie.id || movie.movie_id;

              // Mencocokkan dengan data watchlist secara akurat
              const watchlistData = watchlist.find((w) => w.id === currentMovieId || w.movie_id === currentMovieId);
              const isInWatchlist = !!watchlistData;

              // Menangkap ID valid untuk proses hapus
              const validWatchlistId = watchlistData ? (watchlistData.watchlist_id || watchlistData.id) : null;

              return (
                <div key={currentMovieId} className="premium-card">
                  {/* POSTER */}
                  <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
                    {movie.foto ? (
                      <img
                        src={movie.foto}
                        alt={movie.judul}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.textMuted,
                          fontSize: '14px',
                        }}
                      >
                        No Poster
                      </div>
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(0,0,0,0.75)',
                        color: theme.primary,
                        padding: '4px 14px',
                        borderRadius: '30px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backdropFilter: 'blur(4px)',
                        border: `1px solid ${theme.primary}30`,
                      }}
                    >
                      {movie.tahun}
                    </span>

                    {/* PLAY OVERLAY */}
                    <Link
                      to={`/movie/${currentMovieId}`}
                      className="play-overlay"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(8,12,24,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                      }}
                    >
                      <div
                        className="play-circle"
                        style={{
                          width: '64px',
                          height: '64px',
                          background: theme.primary,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 0 30px ${theme.primary}50`,
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        }}
                      >
                        <span style={{ color: '#000', fontSize: '26px', marginLeft: '6px' }}>
                          ▶
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* CARD INFO */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span
                      style={{
                        color: theme.primary,
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      {movie.genre || 'Movie'}
                    </span>
                    <h3
                      style={{
                        margin: '0 0 20px 0',
                        fontSize: '20px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 700,
                        letterSpacing: '-0.3px',
                      }}
                    >
                      {movie.judul}
                    </h3>

                    <div style={{ marginTop: 'auto' }}>
                      {token && role !== 'admin' ? (
                        <button
                          onClick={() =>
                            isInWatchlist
                              ? handleRemoveWatchlist(validWatchlistId)
                              : handleAddWatchlist(currentMovieId)
                          }
                          style={{
                            background: isInWatchlist ? 'transparent' : 'rgba(255,255,255,0.05)',
                            color: isInWatchlist ? theme.textMuted : '#fff',
                            border: isInWatchlist ? `1px solid ${theme.borderLight}` : 'none',
                            padding: '12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            width: '100%',
                            transition: 'all 0.25s ease',
                            fontSize: '14px',
                          }}
                          onMouseEnter={(e) => {
                            if (!isInWatchlist) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            } else {
                              e.currentTarget.style.borderColor = '#ef4444';
                              e.currentTarget.style.color = '#ef4444';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isInWatchlist) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            } else {
                              e.currentTarget.style.borderColor = theme.borderLight;
                              e.currentTarget.style.color = theme.textMuted;
                            }
                          }}
                        >
                          {isInWatchlist ? 'Remove from Watchlist' : '+ Add to Watchlist'}
                        </button>
                      ) : (
                        <Link
                          to={`/movie/${currentMovieId}`}
                          style={{
                            display: 'block',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            textAlign: 'center',
                            padding: '12px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '14px',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')
                          }
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LOAD MORE */}
        {viewMode === 'home' && hasNextPage && selectedGenre === 'All' && !searchQuery && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <button
              className="btn-glow"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              style={{
                background: 'transparent',
                color: theme.primary,
                border: `2px solid ${theme.primary}`,
                padding: '14px 48px',
                borderRadius: '50px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => {
                if (!isLoadingMore) {
                  e.currentTarget.style.background = theme.primary;
                  e.currentTarget.style.color = '#000';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoadingMore) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = theme.primary;
                }
              }}
            >
              {isLoadingMore ? 'LOADING...' : 'SHOW MORE'}
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          background: '#03060d',
          padding: '60px 48px 40px',
          borderTop: `1px solid ${theme.borderLight}`,
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          <div>
            <h2
              style={{
                color: theme.primary,
                margin: '0 0 12px',
                fontSize: '28px',
                fontWeight: 900,
                letterSpacing: '-0.5px',
              }}
            >
              ALGMOVIES
            </h2>
            <p style={{ color: theme.textMuted, maxWidth: '300px', lineHeight: 1.7, fontSize: '14px' }}>
              Exclusive movie streaming platform with 4K HDR quality. Enjoy the best cinema from around the world.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
                Company
              </h4>
              <p className="footer-link">About Us</p>
              <p className="footer-link">Careers</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
                Help
              </h4>
              <p className="footer-link">FAQ</p>
              <p className="footer-link">Help Center</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
                Legal
              </h4>
              <p className="footer-link">Privacy</p>
              <p className="footer-link">Terms</p>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: `1px solid ${theme.borderLight}`,
            paddingTop: '24px',
            textAlign: 'center',
            color: '#475569',
            fontSize: '13px',
          }}
        >
          © {new Date().getFullYear()} ALGMOVIES. All rights reserved. Developed for the best cinematic experience.
        </div>
      </footer>
    </div>
  );
}

export default Home;