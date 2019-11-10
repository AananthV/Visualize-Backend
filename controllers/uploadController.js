const fs = require('fs');

const config = require('../config.js');

exports.checkFile = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No file uploaded.');
  }
  if (Object.keys(req.files).length !== 1) {
    return res.status(400).send('Upload one file at a time.');
  }
  const name = Object.values(req.files)[0].name;
  if (name.substring(name.length - 5) != '.gltf') {
    return res.status(400).send('Only .gltf files can be uploaded');
  }

  // If all the tests pass
  req.gltf = Object.values(req.files)[0];

  next();
}

exports.saveFile = (req, res, next) => {
  if (!req.gltf) {
    return res.status(500).send('Something went wrong');
  }
  const filePath = config.fileUploadPath + req.gltf.md5 + '.gltf';
  fs.access(filePath, fs.F_OK, (err) => {
    if (err) {
      req.gltf.mv(filePath, function(err) {
        return res.status(500).send('Something went wrong');
      });
    }
    req.filePath = filePath;
    next()
  });
}

exports.uploadResult = (req, res) => {
  if (!req.filePath) {
    return res.status(500).send('Something went wrong');
  }
  const result = {
    'result': 'SUCCESS',
    'filePath': config.domainName + 'files/' + req.gltf.md5 + '.gltf'
  }
  res.send(JSON.stringify(result));
}
