const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;




// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     //console.log("Token received:", token);  // Log token received

//     if (!token) {
//         //console.log('No token provided');
//         return res.status(401).json({ message: 'No token provided, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         //console.log("Decoded token:", decoded);  // Log decoded token
//         req.user = { id: decoded.userId };  // Ensure this matches your JWT token payload
//         next();
//     } catch (err) {
//         //console.log('Invalid token:', err.message);
//         return res.status(401).json({ message: 'Invalid token, authorization denied' });
//     }
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.user);
//     if (!user) 
//      return res.status(401).json({ message: 'User not found' });

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// exports.authMiddleware = async (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'Unauthorized' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         if (!req.user) return res.status(404).json({ message: 'User not found' }); 
//         next();
//     } catch (error) {
//         res.status(403).json({ message: 'Invalid token' });
//     }
// };
// module.exports = authMiddleware;