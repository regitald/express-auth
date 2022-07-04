const express = require ('express');
const userApp = require('../app/controller/user-app');
const auth = require('../middleware/auth')

const router = express.Router();

router.post('/register', userApp.register);
router.post('/login', userApp.login);
router.get('/logout', userApp.logout);
router.get("/", auth, userApp.index);
router.get('/refresh-token', userApp.refreshToken);

module.exports = router