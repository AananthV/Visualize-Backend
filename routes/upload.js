var express = require('express');
var uploadController = require('../controllers/uploadController');

var router = express.Router();

/* Check if uploaded file exists */
router.post('/', uploadController.checkFile, uploadController.saveFile, uploadController.uploadResult);

router.get('/', (req, res) => {
  res.render('upload');
});

module.exports = router;
