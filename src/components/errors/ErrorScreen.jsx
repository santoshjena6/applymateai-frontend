"use client";
import React from 'react';
import Link from 'next/link';
import styles from './ErrorScreen.module.css';

const ERRORS = {
  404: {
    code: "404",
    title: "Oops! Page Not Found",
    message: "Looks like this page took a coffee break ☕.\nDon't worry, let's get you back on track.",
    primaryAction: { label: "Go to Home", href: "/" },
    secondaryAction: { label: "Go to Dashboard", href: "/dashboard" },
    image: "/404.png",
  },
  500: {
    code: "500",
    title: "Oops! Something went wrong.",
    message: "We're experiencing some technical difficulties on our end. Our team has been notified and is working to fix the issue.",
    primaryAction: { label: "Try Again", action: "retry" },
    secondaryAction: { label: "Go to Homepage", href: "/" },
    image: "/500.png",
    showBadge: true,
    badgeText: "Error Code: 500 Internal Server Error",
    showSupport: true,
  },
  network: {
    code: "503",
    title: "Backend Offline",
    message: "Cannot connect to the server. Make sure the backend is running.",
    primaryAction: { label: "Retry", action: "retry" },
    secondaryAction: { label: "Go Home", href: "/" },
    image: "/404.png",
  },
  session: {
    code: "401",
    title: "Session Expired",
    message: "Your session has expired. Please log in again to continue.",
    primaryAction: { label: "Log In Again", href: "/login" },
    image: "/404.png",
  },
  forbidden: {
    code: "403",
    title: "Access Denied",
    message: "You don't have permission to view this page.",
    primaryAction: { label: "Go Home", href: "/dashboard" },
    image: "/404.png",
  },
};

export default function ErrorScreen({ type = "404", title, message, onRetry }) {
  const err = ERRORS[type] || ERRORS["404"];
  const displayTitle = title || err.title;
  const displayMessage = message || err.message;

  const handlePrimary = () => {
    if (err.primaryAction.action === "retry" && onRetry) {
      onRetry();
    } else if (err.primaryAction.href) {
      window.location.href = err.primaryAction.href;
    } else if (err.primaryAction.action === "retry") {
      window.location.reload();
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logoContainer}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 12L21.5 2.5L12 21.5L10 14L2.5 12Z" fill="#6366f1" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.logoText}>ApplyMate</span>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <Link href="/applications" className={styles.navLink}>Applications</Link>
          <Link href="/resume" className={styles.navLink}>Resume</Link>
          <div className={styles.navDropdown}>
            AI Tools <span className={styles.dropdownArrow}>▾</span>
          </div>
        </nav>
        <Link href="/" className={styles.dashboardBtn}>
          <svg className={styles.dashboardIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Go to Homepage
        </Link>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.textContent}>
          <h1 className={styles.errorCode}>{err.code}</h1>
          <h2 className={styles.errorTitle}>
            {displayTitle.split(' ').map((word, i, arr) => 
              word === 'went' || word === 'wrong.' ? (
                <span key={i} style={{color: '#6366f1'}}>{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h2>
          <p className={styles.errorMessage}>{displayMessage}</p>
          
          {err.showBadge && (
            <div className={styles.errorBadge}>
              <span className={styles.infoIcon}>i</span>
              <span>{err.badgeText}</span>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button onClick={handlePrimary} className={styles.primaryBtn}>
              {err.primaryAction.action === "retry" ? (
                <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {err.primaryAction.label}
            </button>
            
            {err.secondaryAction && (
              <Link href={err.secondaryAction.href} className={styles.secondaryBtn}>
                <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {err.secondaryAction.label}
              </Link>
            )}
          </div>

          {err.showSupport && (
            <div className={styles.supportContainer}>
              <div className={styles.supportIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9h.01M15 9h.01M12 9h.01" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.supportText}>
                <div className={styles.supportTitle}>Still having trouble?</div>
                <Link href="/support" className={styles.supportLink}>
                  Contact our support team <span className={styles.supportArrow}>→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className={styles.imageContent}>
          <img src={err.image} alt={displayTitle} className={styles.illustration} />
        </div>
      </main>

      {/* Feature Banner */}
      <div className={styles.featureBanner}>
        <div className={styles.bannerItem}>
          <div className={styles.bannerIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#EEF2FF" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m9 12 2 2 4-4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className={styles.bannerText}>Secure & Private</div>
            <div className={styles.bannerTextSmall}>Your data is always safe</div>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.bannerItem}>
          <div className={styles.bannerIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#EEF2FF" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className={styles.bannerText}>Cancel Anytime</div>
            <div className={styles.bannerTextSmall}>No hidden charges</div>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.bannerItem}>
          <div className={styles.bannerIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="#EEF2FF" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className={styles.bannerText}>24/7 Support</div>
            <div className={styles.bannerTextSmall}>We're here to help</div>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.bannerItem}>
          <div className={styles.bannerIconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className={styles.bannerText}>Regular Updates</div>
            <div className={styles.bannerTextSmall}>New features, always</div>
          </div>
        </div>
      </div>

    </div>
  );
}

