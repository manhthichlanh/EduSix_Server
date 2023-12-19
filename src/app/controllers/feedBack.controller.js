import { ReS } from '../../utils/util.service';
import FeedBackModel from "../models/feedBack.model";
import UserModel from '../models/user.model';

export async function createFeedbackRateAndComment(req, res, next) {
    try {
        const { rate, content } = req.body;
        const user_id = req.params.user_id;
        const course_id = req.params.course_id;
        const createdFeedback = await FeedBackModel.create({
            user_id: user_id,
            course_id: course_id,
            content: content,
            rate: rate || 5
            , include: [{
                model: UserModel,
            }]
        })
        return ReS(res, {
            createdFeedback
        }, 200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  
export async function AverageRate(req, res, next) {
    try {
        const course_id = req.params.course_id;
        const feedbacks = await FeedBackModel.findAll({
            where: { course_id: course_id }
            , include: [{
                model: UserModel,
            }],
            order: [['created_at', 'DESC']]
        });
        if (feedbacks.length === 0) {
            return res.status(404).json({ error: 'No feedback found for the specified course_id' });
        }
        const totalRates = feedbacks.reduce((sum, feedback) => sum + feedback.rate, 0);
        const averageRate = totalRates / feedbacks.length;
        // Count feedbacks for each rating from 1 to 5
        const ratingByCounts = {};
        let totalRatesCount = 0;
        for (let i = 1; i <= 5; i++) {
            const count = await FeedBackModel.count({
                where: { course_id: course_id, rate: i }
            });
            ratingByCounts[i] = count;
            totalRatesCount = totalRatesCount + count;
        }

        return ReS(res, {
            feedbacks: feedbacks,
            averageRate: averageRate,
            ratingByCounts: ratingByCounts,
            totalRatesCount: totalRatesCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}
