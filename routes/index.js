const router = require('express').Router();

router.use('/blog', require('./blogRoutes'));
router.use('/user', require('./userRoutes'));
router.use('/comment', require('./commentRoutes') )

module.exports = router;