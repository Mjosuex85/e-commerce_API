const { Router } = require('express');
const router = Router();

router.get('/', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

module.exports = router;