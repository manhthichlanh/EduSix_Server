import { switchAction } from "../../utils/util.helper";
import NotificationModel from "../models/notification.model";
export default (io) => {
    // console.log(_initEmitter(123))
    // console.log(new )

    io.of("/").adapter.on("create-room", (room) => {
        console.log(`room ${room} was created`);
    });

    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });
    io.of("/").adapter.on("leave-room", (room, id) => {
        console.log(`socket ${id} has leaved room ${room}`);
    });
    io.of("/").adapter.on("delete-room", (room) => {
        console.log(`room ${room} was deleted`);
    });
    io.on("connection", (socket) => {
        let command;
        console.log("Có người kết nối", socket.id);

        console.log("socketSide id:" + socket.id)

        _initEmitter(socket.id).on("init_ffmpeg_command", (command) => {
            console.log("cóa")
            const selectedAction = switchAction(command);

            const process_info = {
                status: "in_progress",
                progress_percent: 0,
                actionId: 0,
                actionName: "",
                actionActive: false
            }

            command.on('progress', function (progress) {
                console.log('Processing: ' + progress.percent + '% done');
                process_info.progress_percent = progress.percent;
                // console.log(command)
                socket.emit("process_info", process_info)
            })

            socket.on("process-action", (action) => {
                const { actionId, actionName } = action;
                process_info.actionId = actionId;
                process_info.actionName = actionName;
                process_info.actionActive = true;
                switch (actionId) {
                    case 1:
                        selectedAction.Pause();
                        process_info.status = "stop_progress";
                        socket.emit("process_info", process_info);
                        break;
                    case 2:
                        selectedAction.Remuse();
                        process_info.status = "in_progress"
                        socket.emit("process_info", process_info);
                        break;
                    case 3:
                        selectedAction.Cancel();
                        break;
                    default:
                        break;
                }
            })

        })

        _initEmitter(socket.id).on("send-certificate-notification", async (certificate) => {
            const { user_id, sub_id, course_id } = certificate;
            console.log("cóa truy cập")
            try {
                const newNotificationCreate = {
                    link: `certification/${sub_id}`,
                    receiver: user_id,
                    message: "Chúc mừng bạn đã hoàn thành khóa học?course_id=" + course_id,
                    type: 1,
                }

                // Tạo thông báo mới trong database
                const newNotification = await NotificationModel.create(newNotificationCreate);

                socket.emit("learner-get-message", { readLoad: true })
                socket.emit("learner-get-certificate-message", newNotification.toJSON())

                console.log("thành công!")
            } catch (error) {
                console.error('Error creating notification:', error);
            }
        })

        socket.on("disconnect", function (userSocket) {
            console.log(`User: ${userSocket.id} ngắt kết nối`)
        });
    })
}

// console.log(_io)
