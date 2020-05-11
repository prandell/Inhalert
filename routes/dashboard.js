var express = require('express');
var router = express.Router();

// Dashboard
router.get('/',  (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);

module.exports=router;