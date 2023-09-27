import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const VideoModel = sequelize.define("video", {
  // Định nghĩa các trường trong bảng Users
  video_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  file_videos: {
    type: DataTypes.STRING(255), // Đặt độ dài cho varchar
  },
  youtube_id: {
    type: DataTypes.STRING, // Có thể sử dụng STRING hoặc INTEGER tùy theo cách bạn lưu trữ
    comment: "Đây là phần id của đường dẫn youtube ví ?v=...",
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: "Tính theo giây(s)",
    defaultValue: 0,
  },
  status: {
    type: DataTypes.BOOLEAN,
    comment: "True là hiện, false là ẩn",
    defaultValue: 0,
  },
  type: {
    type: DataTypes.INTEGER,
    comment: "0 là nhúng từ youtube, 1 là video trong của server => Dùng để query, read",
    defaultValue: 0,
  },
}, {
  createdAt: "created_at",
  updatedAt: "updated_at"
});
VideoModel.sync().then(() => {
  console.log('Video table created successfully!');
}).catch((error) => {
  console.error('Unable to create video : ', error);
});
export default VideoModel;
