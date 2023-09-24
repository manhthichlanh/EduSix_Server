import multer from "multer"

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
const uploadVideoOnDisk = multer({ storage: diskStorage });
//Lưu trên đĩa cứng vật lý

//Lưu trên ram
const memoryStorage = multer.memoryStorage(); // Lưu trữ tệp trong bộ nhớ tạm thời

const uploadVideoOnMemory = multer({ storage: memoryStorage });
//Lưu trên ram

export {
  uploadVideoOnDisk,
  uploadVideoOnMemory
} 