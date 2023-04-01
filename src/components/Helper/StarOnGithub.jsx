import { useState, useEffect } from 'react';

const Header = ({ repoURL }) => {
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);
  const [totalStars, setTotalStars] = useState(0);

  const fetchTotalStars = async () => {
    try {
      const response = await fetch(`https://api.github.com/repos/${repoURL}`);
      const data = await response.json();
      setTotalStars(data?.stargazers_count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTotalStars();
  }, []);

  const handleCloseHeader = () => {
    setIsHeaderOpen(false);
  };

  const style = {
    header: {
      display: isHeaderOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      color: '#24292e',
      height: '30px',
      padding: '0 5px',
      position: 'relative'
    },
    githubIcon: {
      height: '22px',
      width: '22px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#24292e',
      marginLeft: '10px',
      textDecoration: 'underline'
    },
    closeButton: {
      backgroundColor: 'transparent',
      color: '#24292e',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      marginLeft: '100px',
      position: 'absolute',
      top: '5px',
      right: '10px'
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      marginLeft: '20px',
      cursor: 'pointer'
    },
    totalStars: {
      marginRight: '40px',
      display: 'flex',
      gap: '5px'
    }
  };

  return (
    <div style={style.header}>
      <a
        href={`https://github.com/${repoURL}`}
        style={style.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div style={style.githubIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </div>
        <div style={style.title}>
          <h2> {repoURL}</h2>
        </div>
      </a>
      <div>
        <p style={style.totalStars}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.88 117.1"
            height="20"
            width="20"
          >
            <path
              fill="#FFD700"
              d="M64.42,2,80.13,38.7,120,42.26a3.2,3.2,0,0,1,1.82,5.62h0L91.64,74.18l8.9,39A3.19,3.19,0,0,1,98.12,117a3.27,3.27,0,0,1-2.46-.46L61.41,96.1,27.07,116.64a3.18,3.18,0,0,1-4.38-1.09,3.14,3.14,0,0,1-.37-2.38h0l8.91-39L1.09,47.88a3.24,3.24,0,0,1-.32-4.52,3.32,3.32,0,0,1,2.29-1l39.72-3.56L58.49,2a3.24,3.24,0,0,1,5.93,0Z"
            />
          </svg>
          {totalStars}
        </p>
        <button style={style.closeButton} onClick={handleCloseHeader}>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;
