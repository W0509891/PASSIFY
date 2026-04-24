import React from 'react';
import { Link } from 'react-router-dom';
import './404.scss';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <h2>Oops! Page Not Found</h2>
            <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <Link to="/" className="home-link">Go Back Home</Link>
        </div>
    );
};

export default NotFound;
