const jwt = require('jsonwebtoken');
const secret = 'HappyBirthdayJhino';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.redirect('/');

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.redirect('/');
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken
};