import multer from "multer";
import AppError from "../../utils/appError"
import path from "path"
const fileFilter = (res, file, cb) => {
  if (file.mimetype.match(/video\/(mp4|ogg|webm)$/)) {
    // Nếu có, cho phép tải lên
    const fileExt = path.extname(file.originalname); // Get the original file extension
    const fileNameWithoutExt = Date.now() + '-' + file.originalname.replace(fileExt, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036F]/g, "").replace(/đ/g, "d").split(" ").map(item => item.trim()).join(""); // Remove the extension

    // Add a new property 'originalname' without the extension
    file.originalname = fileNameWithoutExt;
    cb(null, true)
  } else {
    // Nếu không, từ chối tải lên
    const err = new AppError(404, 'fail', 'Chỉ được tải lên các tệp video có đuôi là mp4|ogg|webm!');
    cb(err);
  }
}

//Lưu trên đĩa cứng vật lý
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos')
  },
  filename: function (req, file, cb) {
    // console.log(file)
    cb(null, Date.now() + '-' + file.originalname.toLowerCase().split(" ").map(item => item.trim()).join(""))
  }
});
const uploadVideoOnDisk = multer({ storage: diskStorage, fileFilter });
//Lưu trên đĩa cứng vật lý

//Lưu trên ram
const memoryStorage = multer.memoryStorage(); // Lưu trữ tệp trong bộ nhớ tạm thời

const uploadVideoOnMemory = multer({ storage: memoryStorage, fileFilter });
//Lưu trên ram

export {
  uploadVideoOnDisk,
  uploadVideoOnMemory
} 