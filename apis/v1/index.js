const router = require('express').Router();
const templatesRoutes = require('./templates.v1.routes');
const responseRoutes = require('./response.v1.routes');

router.get('/', (req, res) => {
    res.send('API LIVE!');
});
router.use('/templates', templatesRoutes);
router.use('/response', responseRoutes);

module.exports = router;