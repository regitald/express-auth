const express = require ('express');
const userApp = require('../app/controller/userApp');
const auth = require('../middleware/auth')

const router = express.Router();

router.post('/register', userApp.register);
router.post('/login', userApp.login);
router.get("/", auth, userApp.index);

module.exports = router