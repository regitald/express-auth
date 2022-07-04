const express = require ('express');
const roleApp = require('../app/controller/role-app');

const router = express.Router();

router.post('/', roleApp.store);
router.get('/', roleApp.index);

module.exports = router