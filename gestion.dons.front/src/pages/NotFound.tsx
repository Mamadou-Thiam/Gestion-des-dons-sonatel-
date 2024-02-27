import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="/notFound.png" alt="Not Found" style={{ maxWidth: '40%', height: 'auto' }} />
            <div style={{ textAlign: 'center' }}>
                <h1>404 - Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        </div>
    );
};

export default NotFound;
