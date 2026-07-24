const express = require("express");
const router = express.Router();
const visitorController = require('../controllers/visitor.controller');

router.get('/visitors', visitorController.getAll);
router.post('/visitors', visitorController.create);
router.get('/visitors/:id', visitorController.getById);
router.delete('/visitors/:id', visitorController.delete);
router.get('/ai-summary', visitorController.getAiSummary);
router.get("/stream", visitorController.subscribeStream);

module.exports = router;