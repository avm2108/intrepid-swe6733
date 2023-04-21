const { randomBytes } = require('crypto');

const generateCsrf = (req, res, next) => {
    // Generate a random token
    const token = randomBytes(64).toString('hex');
    // Store the token in the cookie
    res.cookie('csrfToken', token, {
        secure: (process.env.NODE_ENV === "production"),
        // signed: true, // This is required for the cookie to be signed, but I've had issues comparing it to the one sent in the request
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week,
        httpOnly: true,
        // sameSite: "strict"
    });
    console.log("CSRF token generated: " + token);
    // Assigning the token so it can be sent in the response for later verification
    req.csrfToken = token;

    // Pass the token to the next middleware
    next();
};

const verifyCsrf = (req, res, next) => {
    // Extract the token from the cookie
    const token = req.cookies.csrfToken;

    /*if (process.env.NODE_ENV === "development") {
        // Extract the token from the request body or headers
        const inboundToken = req.body.csrfToken ? req.body.csrfToken : (req.headers['x-csrf-token'] ? req.headers['x-csrf-token'] : undefined);
        console.log("Request inbound with CSRF token in body or header: " + inboundToken);
    }*/
    
    // Verify that the token passed in via a form field or via a header matches the one in the cookie
    if (req.body.csrfToken === token || req.headers['x-csrf-token'] === token) {
        // If the token is valid, pass the request to the next middleware
        console.log("CSRF token verified")
        next();
    } else {
        // If the token is invalid, return an error
        console.log("CSRF token invalid") 
        res.status(403).json({
            errors: {
                message: 'Invalid CSRF token. Make sure you\'re taking it from cookie.csrfToken and passing it in headers as X-CSRF-Token or in a hidden form field with name=\'csrfToken\''
            }
        });
    }
};

// Export the CSRF protection strategy and the CSRF token verification function
module.exports = {
    generateCsrf,
    verifyCsrf
};
