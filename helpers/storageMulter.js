const multer = require('multer');

module.exports = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now(); // Tên file sẽ là thời gian hiện tại là duy nhất
      cb(null, `${uniqueSuffix}-${file.originalname}`); //  123123123123-abc.jpg
    }
  })
  return storage;
}