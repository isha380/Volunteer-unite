

'use client';

import React, { useState, useEffect } from 'react';
import { Users, Calendar, Award } from 'lucide-react';

export default function VolunteerUniteLanding() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const [cursorParticles, setCursorParticles] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    
   
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 10
    }));
    
    setParticles(generatedParticles);

   
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create cursor trail particles
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      
      setCursorParticles(prev => [...prev, newParticle].slice(-15));
      
      // Remove particle after animation
      setTimeout(() => {
        setCursorParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check if user is logged in
  const checkAuth = () => {
   
    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('token') || 
                  sessionStorage.getItem('authToken');
    
  
    const isAuthenticated = document.cookie.includes('authToken') || token;
    
    return isAuthenticated;
  };

  const handleGetStarted = () => {
   
    if (checkAuth()) {
      
      window.location.href = '/events';
    } else {
      
      window.location.href = '/login';
    }
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cursorTrail {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1) rotate(180deg);
            opacity: 1;
          }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          overflow-x: hidden;
        }

        .container {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #e8f1ff 0%, #4e6db0 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cursor-glow {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 197, 253, 0.1) 40%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 9998;
          transition: all 0.1s ease-out;
          mix-blend-mode: screen;
        }

        .cursor-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }

        .cursor-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(59, 130, 246, 0.6) 50%, transparent 100%);
          border-radius: 50%;
          animation: cursorTrail 1s ease-out forwards;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .cursor-particle::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sparkle 1s ease-out forwards;
        }

        .background-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
        }

        .shape1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(45deg, #3b82f6 0%, #60a5fa 100%);
          top: -10%;
          left: -10%;
          animation: float 8s ease-in-out infinite;
        }

        .shape2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(45deg, #2563eb 0%, #3b82f6 100%);
          bottom: -10%;
          right: -10%;
          animation: float 10s ease-in-out infinite reverse;
        }

        .shape3 {
          width: 350px;
          height: 350px;
          background: linear-gradient(45deg, #60a5fa 0%, #93c5fd 100%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 6s ease-in-out infinite;
        }

        .content {
          position: relative;
          z-index: 1;
          padding: 60px 20px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 80px;
          animation: ${isLoaded ? 'fadeInUp 0.8s ease-out' : 'none'};
        }

        .welcome-text {
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 300;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .title {
          font-size: 4.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 25px;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          animation: ${isLoaded ? 'fadeInUp 0.8s ease-out 0.2s backwards' : 'none'};
          position: relative;
        }

        .title::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
          -webkit-background-clip: text;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto 40px;
          animation: ${isLoaded ? 'fadeInUp 0.8s ease-out 0.4s backwards' : 'none'};
        }

        .button-group {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          animation: ${isLoaded ? 'fadeInUp 0.8s ease-out 0.6s backwards' : 'none'};
        }

        .btn {
          padding: 16px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn:active::after {
          width: 300px;
          height: 300px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.6);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .btn:hover .arrow {
          transform: translateX(5px);
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-top: 60px;
          width: 100%;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 40px 30px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(96, 165, 250, 0.15) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .feature-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transform: rotate(45deg);
          animation: shimmer 3s infinite;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-card:nth-child(1) {
          animation: ${isLoaded ? 'slideInLeft 0.8s ease-out 0.8s backwards' : 'none'};
        }

        .feature-card:nth-child(2) {
          animation: ${isLoaded ? 'fadeInUp 0.8s ease-out 0.9s backwards' : 'none'};
        }

        .feature-card:nth-child(3) {
          animation: ${isLoaded ? 'slideInRight 0.8s ease-out 1s backwards' : 'none'};
        }

        .feature-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 25px;
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.4s ease;
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }

        .icon-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s;
        }

        .feature-card:hover .icon-wrapper::before {
          left: 100%;
        }

        .feature-card:hover .icon-wrapper {
          transform: rotate(10deg) scale(1.1);
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
        }

        .icon-wrapper svg {
          color: white;
          width: 40px;
          height: 40px;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 15px;
          position: relative;
        }

        .feature-description {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.6;
          position: relative;
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: float 10s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 1024px) {
          .features {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 3rem;
          }

          .welcome-text {
            font-size: 1.5rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .btn {
            padding: 14px 30px;
            font-size: 1rem;
          }

          .cursor-glow,
          .cursor-particles {
            display: none;
          }
        }
      `}</style>

      <div className="container">
      
        <div 
          className="cursor-glow"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        />

       
        <div className="cursor-particles">
          {cursorParticles.map((particle) => (
            <div
              key={particle.id}
              className="cursor-particle"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
              }}
            />
          ))}
        </div>

        <div className="background-shapes">
          <div className="shape shape1"></div>
          <div className="shape shape2"></div>
          <div className="shape shape3"></div>
        </div>

        <div className="floating-particles">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>

        <div className="content">
          <div className="header">
            <div className="welcome-text">Welcome to</div>
            <h1 className="title">Volunteer Unite</h1>
            <p className="subtitle">
              Connect with meaningful volunteer opportunities that match your skills and passion.
              Make a difference in your community today.
            </p>
            <div className="button-group">
              <button className="btn btn-primary" onClick={handleGetStarted}>
                Get Started
                <span className="arrow">→</span>
              </button>
              <button className="btn btn-secondary" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
          </div>

          <div className="features">
            <div className="feature-card">
              <div className="icon-wrapper">
                <Users />
              </div>
              <h3 className="feature-title">Smart Matching</h3>
              <p className="feature-description">
                Our algorithm matches you with events that fit your skills, interests, and availability perfectly.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper">
                <Calendar />
              </div>
              <h3 className="feature-title">Easy Scheduling</h3>
              <p className="feature-description">
                Browse events, apply instantly, and manage your volunteer schedule all in one place.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper">
                <Award />
              </div>
              <h3 className="feature-title">Track Impact</h3>
              <p className="feature-description">
                Earn badges, track your contributions, and see the real impact you're making in your community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

