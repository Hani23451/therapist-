// middleware/auth.js
const providerValidation = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/provider/login');
  }
};

module.exports = providerValidation;
