import React from 'react';
import './NotFoundPage.scss'; // Global SCSS import
import { NETWORKED_FRONTEND_URL } from '../helper/constants';

const NotFoundPage = () => {
  const handleGoHome = () => {
    window.location.href = `${NETWORKED_FRONTEND_URL}/courses`; // Redirect to the homepage
  };

  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button className="notfound-home-button" onClick={handleGoHome}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
