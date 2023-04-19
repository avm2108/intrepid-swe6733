const { createProxyMiddleware } = require('http-proxy-middleware');

// Make calls to the /api endpoint on the frontend server proxy to the backend server
// This is used to avoid CORS issues during development especially as we're using
// cookies which need to be sent in between the frontend and backend servers
// for authentication purposes and CSRF protection
if (process.env.NODE_ENV === 'development') {
    module.exports = function (app) {
        app.use(
            '/api',
            createProxyMiddleware({
                target: process.env.REACT_APP_API_URL,
                changeOrigin: true,
            })
        );
    };
}
