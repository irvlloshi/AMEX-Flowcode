import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <svg viewBox="0 0 38 38" fill="none">
          <rect width="38" height="38" rx="8" fill="white"/>
          <text x="5" y="28" fontSize="20" fontWeight="900" fill="#016fd0" fontFamily="Arial">A</text>
        </svg>
        <div className="header-logo-text">
          <div className="header-logo-title">AMEX RCS Agent Builder</div>
          <div className="header-logo-sub">Powered by Vonage Messages API</div>
        </div>
      </div>
      <div className="header-right">
        <div className="header-badge">
          <div className="header-badge-dot" />
          Vonage Proxy Connected
        </div>
      </div>
    </header>
  );
}