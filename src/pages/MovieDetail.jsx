import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`https://darkish-squeeze-smirk.ngrok-free.dev//api/movies/${id}`);
        setMovie(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
  };

  // Premium theme aligned with Home.jsx
  const theme = {
    bgMain: '#0a0e1a',
    bgCard: 'rgba(255,255,255,0.04)',
    bgCardSolid: '#141b2b',
    primary: '#00e676',
    primaryDim: 'rgba(0, 230, 118, 0.15)',
    textMain: '#f1f5f9',
    textMuted: '#94a3b8',
    borderLight: 'rgba(255,255,255,0.06)',
    glassBg: 'rgba(10, 14, 26, 0.75)',
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: theme.bgMain,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.primary,
          fontFamily: "'Inter', sans-serif",
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '1px',
        }}
      >
        <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>PREPARING THEATER...</span>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        style={{
          backgroundColor: theme.bgMain,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
          fontFamily: "'Inter', sans-serif",
          fontSize: '20px',
          fontWeight: 500,
        }}
      >
        Movie Not Found
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.bgMain,
        minHeight: '100vh',
        color: theme.textMain,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: ${theme.textMuted};
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          padding: 8px 16px 8px 12px;
          border-radius: 40px;
          border: 1px solid transparent;
          transition: all 0.25s ease;
        }
        .back-btn:hover {
          color: ${theme.textMain};
          border-color: ${theme.borderLight};
          background: rgba(255,255,255,0.04);
          transform: translateX(-4px);
        }

        .logo-link {
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .logo-link:hover {
          transform: scale(1.02);
          text-shadow: 0 0 30px ${theme.primary}60;
        }

        .video-frame {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px -20px rgba(0, 230, 118, 0.2);
          border: 1px solid ${theme.borderLight};
          aspect-ratio: 16 / 9;
          background: #000;
          transition: box-shadow 0.4s ease;
        }
        .video-frame:hover {
          box-shadow: 0 30px 80px -20px rgba(0, 230, 118, 0.3);
        }

        .info-card {
          background: ${theme.bgCard};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid ${theme.borderLight};
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.4);
          transition: border-color 0.3s ease;
        }
        .info-card:hover {
          border-color: ${theme.primary}40;
        }

        .badge-match {
          background: ${theme.primaryDim};
          color: ${theme.primary};
          padding: 4px 14px;
          border-radius: 40px;
          font-weight: 700;
          font-size: 13px;
          border: 1px solid ${theme.primary}30;
        }

        .badge-4k {
          border: 1px solid ${theme.textMuted}50;
          padding: 2px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: ${theme.textMuted};
        }

        .genre-tag {
          background: ${theme.bgCard};
          color: ${theme.textMain};
          padding: 6px 18px;
          border-radius: 40px;
          font-size: 13px;
          border: 1px solid ${theme.borderLight};
        }

        .share-btn {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid ${theme.borderLight};
          color: ${theme.textMain};
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.25s ease;
        }
        .share-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: ${theme.primary}40;
          color: ${theme.primary};
        }

        .nav-blur {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: ${theme.glassBg};
          border-bottom: 1px solid ${theme.borderLight};
          padding: 16px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .section-title {
          font-size: clamp(36px, 5vw, 56px);
          margin: 0 0 12px 0;
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1.05;
          color: #fff;
        }

        .synopsis {
          font-size: clamp(16px, 1.2vw, 19px);
          line-height: 1.8;
          color: #cbd5e1;
          max-width: 700px;
        }

        @media (max-width: 768px) {
          .nav-blur { padding: 12px 20px; flex-wrap: wrap; gap: 10px; }
          .back-btn { font-size: 13px; padding: 6px 12px; }
          .logo-link { font-size: 22px !important; }
          .info-card { padding: 24px; }
        }
      `}</style>

      {/* NAVBAR */}
      <div className="nav-blur">
        <Link to="/" className="back-btn">
          <span style={{ fontSize: '20px', lineHeight: 1 }}>←</span> Back
        </Link>

        <Link to="/" className="logo-link" style={{ color: theme.primary, fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px', textShadow: `0 0 20px ${theme.primary}30` }}>
          ALGMOVIES
        </Link>

        <div style={{ width: '120px' }}></div> {/* Spacer for balance */}
      </div>

      {/* VIDEO FRAME */}
      <div style={{ padding: '32px 40px 20px', backgroundColor: '#05080f' }}>
        <div className="video-frame" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {movie.trailer_url ? (
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(movie.trailer_url)}
              title={movie.judul}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block' }}
            />
          ) : (
            <img
              src={movie.foto}
              alt={movie.judul}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
        </div>
      </div>

      {/* DETAIL INFO */}
      <div
        style={{
          padding: '20px 40px 60px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '40px',
            alignItems: 'flex-start',
          }}
        >
          {/* LEFT: Title & Synopsis */}
          <div style={{ flex: '2 1 600px' }}>
            <h1 className="section-title">{movie.judul}</h1>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px 20px',
                alignItems: 'center',
                marginBottom: '28px',
                fontSize: '15px',
                color: theme.textMuted,
              }}
            >
              <span className="badge-match">99% Match</span>
              <span>{movie.tahun}</span>
              <span className="badge-4k">4K ULTRA HD</span>
              <span className="genre-tag">{movie.genre}</span>
            </div>

            <p className="synopsis">
              {movie.deskripsi ||
                'No synopsis information available for this title. Watch the trailer to get a glimpse of the story.'}
            </p>
          </div>

          {/* RIGHT: Crew Info */}
          <div className="info-card" style={{ flex: '1 1 280px' }}>
            <h3
              style={{
                color: theme.textMain,
                marginTop: 0,
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: `1px solid ${theme.borderLight}`,
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '-0.3px',
              }}
            >
              Crew & Info
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: theme.textMuted, fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                Director
              </div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>
                {movie.sutradara || '—'}
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <div style={{ color: theme.textMuted, fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                Distributor
              </div>
              <div style={{ color: theme.primary, fontSize: '16px', fontWeight: 600 }}>
                ALGMOVIES Network
              </div>
            </div>

            <button className="share-btn">Share Movie</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;