const express = require ('express');
const aes = require('../middleware/aes')

const userRoutes = require ('./auth');
const roleRoutes = require ('./role');
const configRoutes = require ('./testing/config');
const router = express.Router();

router.get('/',(req, res)=> res.send('welcome to express'));
router.use('/config', configRoutes);
router.use('/api/users', userRoutes);
router.use('/api/roles', aes, roleRoutes);

module.exports = router