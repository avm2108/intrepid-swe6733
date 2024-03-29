const { body, validationResult } = require("express-validator");

// Validation rules for the various user input fields, organized by route
// These rules will be used by the validateWithRules middleware
// Within the arrays of validation rules we'll have access to request.body, which contains the user's input
// We can use the function of express-validator to validate the user's input, and return an error message if the input is invalid

// For fields that require a field to be both filled AND of a certain length/format, we'll use the if() function to check if the field is filled
// first, so we don't get an error message for the length/format if the field is empty
const rules = {
    name: [
        // Validate the user's credentials, taking them from the request body
        body('name', 'Name is required').notEmpty(),
        // Name should be at least 3 characters long, and no more than 50, and should only contain letters and spaces
        body('name', 'Name must be between 3 and 50 characters long').if(body('name').notEmpty()).isLength({ min: 3, max: 50 }),
    ],
    email: [
        body('email', 'Email is required').notEmpty(),
        // Email should be a valid email address
        body('email', 'Email is an invalid format').if(body('email').notEmpty()).isEmail(),
    ],
    password: [
        body('password', 'Password is required').notEmpty(),
        // Password should be at least 6 characters long, and no more than 50
        body('password', 'Password must be between 6 and 50 characters long').if(body('password').notEmpty()).isLength({ min: 6, max: 50 }),
        // Password should contain at least one number, one lowercase letter, one uppercase letter, and one special character
        body('password', 'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character').if(body('password').notEmpty()).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,50}$/),
    ],
    confirmPassword: [
        // confirmPassword should be equal to password
        body('confirmPassword', 'Password confirmation is required').notEmpty(),
        // Ensure that the password and confirmPassword fields match
        body('confirmPassword', 'Passwords do not match').if(body('confirmPassword').notEmpty()).custom((value, { req }) => value === req.body.password),
    ],
    dateOfBirth: [
        // Ensure that the date of birth is valid, and that the user is at least 18 years old
        body('dateOfBirth', 'Date of birth is required').notEmpty(),
        body('dateOfBirth', 'Date of birth is invalid').if(body('dateOfBirth').notEmpty()).isDate(),
        body('dateOfBirth', 'You must be at least 18 years old to register').if(body('dateOfBirth').notEmpty()).if(body('dateOfBirth').isDate()).custom((value, { req }) => {
            const today = new Date();
            const dateOfBirth = new Date(value);
            let age = today.getFullYear() - dateOfBirth.getFullYear();
            const m = today.getMonth() - dateOfBirth.getMonth();
            // If the user's birthday has not yet occurred this year, subtract 1 from their age
            if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
                age--; // Since they haven't had their birthday yet, they are not yet 1 year older
            }
            return age >= 18;
        }),
    ]
}

const validateWithRules = (req, res, next) => {
    // Determine the proper rules to use based on the request path
    // TODO: We could have a more robust way of determining which rules to use, like 
    // a centralized object that maps paths to rules
    let rulesToUse = [];
    if (req.path === '/register') {
        rulesToUse = [
            ...rules.name,
            ...rules.email,
            ...rules.password,
            ...rules.confirmPassword,
            ...rules.dateOfBirth,
        ]
    } else if (req.path === '/login' || req.path === '/test') {
        rulesToUse = [
            ...rules.email,
            ...rules.password,
        ]
    }

    // We want to run all the validation rules in rulesToUse, and then check if there are any errors
    // If there are errors, we'll return a 400 status code and the errors
    // If there are no errors, we'll call next() to move on to the next middleware
    return Promise.all(rulesToUse.map(validation => validation.run(req))).then(() => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        // We want to remove any duplicate error messages
        const uniqueErrors = errors.array().filter((error, index, self) => self.findIndex(e => e.msg === error.msg) === index);
        console.log("validateWithRules found validation errors: " + JSON.stringify(uniqueErrors));

        // Create our own representation of the errors, we want to go through uniqueErrprs
        // and create an object with the field name as the key and the error message as the value
        // This is stored in uniqueErrors like [{param: 'email', msg: 'Email is required'}, {param: 'password', msg: 'Password is required'}
        // We want to convert this to {email: 'Email is required', password: 'Password is required']
        // If there are multiple errors for one field, we want to store them in an array
        // So if we have [{param: 'email', msg: 'Email is required'}, {param: 'email', msg: 'Email is invalid'}]
        // We want to convert this to {email: ['Email is required', 'Email is invalid']}
        return res.status(400).json({
            errors: uniqueErrors.reduce((acc, error) => {
                if (!acc[error.param]) {
                    acc[error.param] = error.msg;
                } else if (Array.isArray(acc[error.param])) {
                    acc[error.param].push(error.msg);
                } else {
                    acc[error.param] = [acc[error.param], error.msg];
                }
                return acc;
            }, {})
        });
    });
}

module.exports = validateWithRules;
