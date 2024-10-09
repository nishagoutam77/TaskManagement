const express = require('express');
const EmailController = require('../controllers/emailController');
const router = express.Router();

router.post('/welcome', EmailController.sendWelcomeEmail);
router.post('/password-recovery', EmailController.sendPasswordRecoveryEmail);
router.post('/newsletter', EmailController.sendNewsletter);

module.exports = router;
