import multer from "multer";
import AppError from "../../utils/appError"
import path from "path"
const removeAccents = (str) => {
  const AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ", "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ"
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    const re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    const char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}
const fileFilter = (res, file, cb) => {
  if (file.mimetype.match(/video\/(mp4|ogg|webm)$/)) {
    console.log(file.originalname)
    // Nếu có, cho phép tải lên
    const fileExt = path.extname(file.originalname); // Get the original file extension
    const fileNameWithoutExt = Date.now() + '-' + file.originalname
      .replace(fileExt, '')
      .toLowerCase() // Chuyển tất cả thành chữ thường
      .normalize("NFD") // Loại bỏ dấu
      .replace(/[\u0300-\u036F]/g, "") // Loại bỏ các dấu
      .replace(/đ/g, "d") // Thay thế 'đ' thành 'd'
      .split(" ")
      .map(item => item.trim())
      .join(""); // Loại bỏ khoảng trắng
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
    console.log(file.originalname)

    cb(null, Date.now() + '-' + file.originalname)
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