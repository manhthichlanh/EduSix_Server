import multer from "multer"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname.toLowerCase().split(" ").map(item=>item.trim()).join("") )
  }
});
const uploadVideo = multer({ storage: storage});

export default uploadVideo;