import CertificateModel from "../models/certificate.model";
import SectionModel from "../models/section.model";
import LessonModel from "../models/lesson.model";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import sequelize from "../models/db";
import { generateRandomString } from "../../utils/util.helper";
export const getAllCertificateByUser = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const certificate_doc = await CertificateModel.findAll({
            where: {
                user_id
            },
        })
        const newCertificateJson = await Promise.all(certificate_doc.map(async item => {
            const certificate = item.toJSON();
            const { user_id, course_id } = certificate;
            const [user, course] = await Promise.all([
                UserModel.findOne({ where: { user_id } }),
                CourseModel.findOne({ where: { course_id } })
            ])
            certificate.user = user;
            delete certificate.user_id;
            certificate.course = course;
            delete certificate.course_id;
            return certificate;
        }))
        return res.status(200).json(newCertificateJson)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const getCertificateBySubId = async (req, res) => {
    const sub_id = req.params.sub_id;
    try {
        const certificate_doc = await CertificateModel.findOne({
            where: { sub_id }
        })
        if (!certificate_doc) return res.status(400).json({ message: "Không tìm chứng chỉ phù hợp!" });
        const certificateJson = certificate_doc.toJSON();
        const { user_id, course_id } = certificateJson;
        const [user, course] = await Promise.all([
            UserModel.findOne({ where: { user_id } }),
            CourseModel.findOne({ where: { course_id } })
        ])
        certificateJson.user = user;
        delete certificateJson.user_id;
        certificateJson.course = course;
        delete certificateJson.course_id;
        return res.status(200).json(certificateJson)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const createCertificate = async (req, res) => {
    const { course_progress_id, user_id, course_id } = req.body;
    try {
        await sequelize.transaction(async (t) => {
            const sub_id = generateRandomString(16);

            let total_duration = 0;
            const SectionDoc = await SectionModel.findAll({
                where: { course_id },
                include: [
                    {
                        model: LessonModel,
                    }
                ]
            });
            if (!SectionDoc) {
                console.log("loi ne");
            }
            SectionDoc.map(section => {
                section.lessons.map(lesson => {
                    total_duration += lesson.duration;
                });
            });

            const newCertificate = await CertificateModel.create({ sub_id, course_progress_id, user_id, course_id, total_duration }, { transaction: t })
            return res.status(200).json(newCertificate)
        }
        )
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

