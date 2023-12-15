import CertificateModel from "../models/certificate.model";
import CourseProgressModel from "../models/courseProgress.model";
import CourseModel from "../models/course.model";
import SectionModel from "../models/section.model";
import LessonModel from "../models/lesson.model";
import sequelize from "../models/db";
import { generateRandomString } from "../../utils/util.helper";
export const getAllCertificateByUser = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const certificate_doc = await CertificateModel.findAll({
            where: {
                user_id
            }
        })
        return res.status(200).json(certificate_doc)
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
        return res.status(200).json(certificate_doc)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const createCertificate = async (req, res) => {
    const { course_proccess_id, user_id, course_id } = req.body;
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

                const newCertificate = await CertificateModel.create({ sub_id, course_proccess_id, user_id, course_id, total_duration }, {transaction: t})
                return res.status(200).json(newCertificate)
            }
            )
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

