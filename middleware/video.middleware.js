import LessonModel from "../src/app/models/lesson.model"
export const checkRequestVideo = async (req, res, next) => {
    const { lesson_id, youtube_id } = req.body;
    const uploadedFile = req.file;

    // Kiểm tra điều kiện 1: Chỉ có một trong hai được null
    if ((!uploadedFile && !youtube_id) || (uploadedFile && youtube_id)) {
        return res.status(400).json({ error: 'Bạn phải upload file video hoặc có youtube_id và chỉ được chọn 1 trong 2!' });
    }

    const record = await LessonModel.findByPk(lesson_id);
    
    if (record) {
        switch (record.type) {
            case 0:
                if (!youtube_id) return res.status(401).json({ message: "Vui lòng cung cấp dữ liệu youtube_id theo đúng yêu cầu kiểu khóa học là " + (record.type === 1 ? "<có phí>" : "<miễn phí>")})
                break;
            case 1:
                if (!uploadedFile) return res.status(401).json({ message: "Vui lòng cung cấp dữ liệu video_file theo đúng yêu cầu kiểu khóa học là " + (record.type === 1 ? "<có phí>" : "<miễn phí>") })
                break;
            default:
                return res.status(401).json({message:"Bài học không hỗ trợ đăng tải video!"})
                
        }

        req.body.tagetLessonRecord = record;

        next();

    } else {
        return res.status(401).json({ message: "Không tìm thấy lesson_id trùng khớp!" })
    }
}

export default checkRequestVideo;