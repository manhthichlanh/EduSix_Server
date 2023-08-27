import userModel from "../models/user.model";
// const initUser = (app) => {
//     app.get("/user", async (req, res) => {
//         try {
//             const nhanvien = await userModel.findAll();
//             res.json(nhanvien)
//         } catch (error) {
//             console.log(error);
//             res.sendStatus(501)
//         }
//     })

//     app.post("/user", async (req, res) => {
//         try {
//             const { hoten, ngaysinh, phongban, chucvu, phone, email } = req.body
//             const user = await userModel.create(
//                 {
//                     hoten,
//                     ngaysinh,
//                     phongban,
//                     chucvu,
//                     phone,
//                     email
//                 })

//             res.status(201).json({
//                 status: "success",
//                 user,

//             });
//         } catch (error) {
//             console.log(error);
//             res.sendStatus(501)
//         }
//     })
//     app.put("/user/:id", async (req, res) => {
//         const userId = req.params.id;

//         try {
//             const { hoten, ngaysinh, phongban, chucvu, phone, email } = req.body;

//             const result = await userModel.update(
//                 {
//                     hoten,
//                     ngaysinh,
//                     phongban,
//                     chucvu,
//                     phone,
//                     email,
//                     updatedAt: Date.now()
//                 },
//                 {
//                     where: {
//                         id: userId,
//                     },
//                 }
//             );

//             if (result[0] === 0) {
//                 return res.status(404).json({
//                     status: "fail",
//                     message: "Không tìm thấy ID của người dùng",
//                 });
//             }
//             const user = await userModel.findByPk(userId);

//             res.status(200).json({
//                 status: "success",
//                 user
//             });
//         } catch (error) {
//             console.log(error);
//             res.sendStatus(501)
//         }
//     })
//     app.delete("/user/:id", async (req, res) => {
//         const userId = req.params.id;

//         try {
//             const result = await userModel.destroy({
//                 where: { id: userId },
//                 force: true,
//             });
//             if (result === 0) {
//                 return res.status(404).json({
//                     status: "Xóa người dùng thất bại! ID: " + userId,
//                     message: "Khồng tìm thấy ID người dùng",
//                 });
//             }
//             res.status(201).json({
//                 message: "Xóa người dùng thành công!",
//             });

//         } catch (error) {
//             console.log(error);
//             res.sendStatus(501)
//         }
//     })
// }
export const create = async (req, res) => {
    try {
        const { hoten, ngaysinh, phongban, chucvu, phone, email } = req.body
        const user = await userModel.create(
            {
                hoten,
                ngaysinh,
                phongban,
                chucvu,
                phone,
                email
            })

        res.status(201).json({
            status: "success",
            user,

        });
    } catch (error) {
        console.log(error);
        res.sendStatus(501)
    }
}
export const getAllUser = async (req, res) => {
    try {
        const nhanvien = await userModel.findAll();
        res.json(nhanvien)
    } catch (error) {
        console.log(error);
        res.sendStatus(501)
    }
}
export const updateUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const { hoten, ngaysinh, phongban, chucvu, phone, email } = req.body;

        const result = await userModel.update(
            {
                hoten,
                ngaysinh,
                phongban,
                chucvu,
                phone,
                email,
                updatedAt: Date.now()
            },
            {
                where: {
                    id: userId,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Không tìm thấy ID của người dùng",
            });
        }
        const user = await userModel.findByPk(userId);

        res.status(200).json({
            status: "success",
            user
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(501)
    }
}
// export default initUser;