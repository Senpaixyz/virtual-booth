const jwt = require('jsonwebtoken');
const secret = 'HappyBirthdayJhino';

const authenticateToken = (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.token;
    if (!token) return res.redirect('/');

    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.redirect('/');
        req.user = decoded;
        next();
    });
}

module.exports = {
    authenticateToken,
    secret
};