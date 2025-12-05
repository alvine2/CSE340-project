const multer = require('multer');
const path = require('path');

// memoryStorage lets us access file.buffer and store it in DB
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    if (allowed.test(ext) && allowed.test(mimetype)) cb(null, true);
    else cb(new Error('Only jpg, jpeg, png are allowed'));
  }
});

module.exports = upload;
