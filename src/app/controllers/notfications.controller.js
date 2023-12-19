import NotificationModel from "../models/notification.model";
export const getNotifications = async (req, res) => {
    try {
        const { who, receiver } = req.query;

        let notifications;

        if (who === 'client') {
            // Lấy tất cả các thông báo có type là 2 hoặc 1 và có receiver là id của user, sắp xếp theo thời gian giảm dần
            notifications = await NotificationModel.findAll({
                where: {
                    type: [1, 2],
                    receiver,
                },
                order: [['created_at', 'DESC']],
            });
        } else if (who === 'admin') {
            // Lấy tất cả các thông báo có type là 2 hoặc 0 và có receiver là id của admin, sắp xếp theo thời gian giảm dần
            notifications = await NotificationModel.findAll({
                where: {
                    type: [0, 2],
                    receiver,
                },
                order: [['created_at', 'DESC']],
            });
        } else {
            return res.status(400).json({ error: 'Invalid value for "who" parameter' });
        }

        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const updateReadNotification = async (req, res) => {
    const { notification_id } = req.body;
    console.log({ notification_id })
    try {
        await NotificationModel.update({ is_read: true }, { where: { notification_id } })
        return res.status(200).json({message: "Thành công!"})
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const createNotification = async (req, res) => {
    try {
        const { link, receiver, message, type } = req.body;

        // Tạo thông báo mới trong database
        const newNotification = await NotificationModel.create({
            link,
            receiver,
            message,
            type,
        });

        return res.status(200).json(newNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
