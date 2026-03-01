const express = require('express');
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(protect);

router.get('/', documentController.getMyDocuments);
router.post('/upload', upload.single('document'), documentController.uploadDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
