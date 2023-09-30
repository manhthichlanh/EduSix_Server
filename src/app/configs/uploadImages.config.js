import multer from "multer";
import AppError from "../../utils/appError";
const fileFilter = (res, file, cb) => {
  if (file.mimetype.match(/image\/(png|jpg|jpeg|webp)$/)) {
    // Nếu có, cho phép tải lên
    cb(null, true)
  } else {
    // Nếu không, từ chối tải lên
    const err = new AppError(404, 'fail', 'Chỉ được tải lên các tệp hình ảnh có đuôi là png|jpg|webp!');
    cb(err);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const uploadImageOnDisk = multer({ storage: storage, fileFilter });

//Lưu trên ram
const memoryStorage = multer.memoryStorage(); // Lưu trữ tệp trong bộ nhớ tạm thời

const uploadImageOnMemory = multer({ storage: memoryStorage, fileFilter });
//Lưu trên ram

export {
  uploadImageOnDisk,
  uploadImageOnMemory
};