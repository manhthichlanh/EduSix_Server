import userModel from "../models/user.model";
import bcrypt from "bcrypt";

const generatePassword = (password) => {
    return new Promise((resolve, reject) => {
        const saltRounds = 10; // Số lượng vòng lặp băm (tăng độ an toàn)

        bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
            if (err) {
                reject(err)
            } else {
                resolve(hashedPassword)
            }
        });
    }
    )
}

export const getAllUser = async (req, res) => {
    try {
        const nhanvien = await userModel.findAll({});
        res.json(nhanvien)
    } catch (error) {
        console.log(error);
        res.sendStatus(501)
    }

}

export const getCourseById = async (req, res) => {
    try {
        const record = await userModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createUser = async (req, res) => {
    try {
        const { fullname, avatar, nickname, email, phone, address, password, active, role } = req.body;


        generatePassword(password)
            .then(
                (hashedPassword) => {
                    const user = userModel.create(
                        { fullname, avatar, nickname, email, phone, address, password: hashedPassword, active, role }
                    )
                    return user
                }
            )

            .then(
                (user) => {
                    res.status(201).json({
                        status: "success",
                        user,

                    });
                }
            )
            .catch(
                (err) => {
                    res.sendStatus(501);
                    console.log(err);
                }
            )


    } catch (error) {
        res.sendStatus(501);
        console.log(error);
    }
}
export const updateUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const { fullname, avatar, nickname, email, phone, address, password, active, role } = req.body;

        generatePassword(password)
            .then(
                (hashedPassword) => {
                    const result = await userModel.update(
                        {
                            fullname, avatar, nickname, email, phone, address, password, active, role, update_at: Date.now()
                        },
                        {
                            where: {
                                user_id: userId,
                            },
                        },

                    );
                    return result
                }

            )
            .then(() => {
                if (result[0] === 0) {
                    return res.status(404).json({
                        status: "fail",
                        message: "Không tìm thấy ID của người dùng",
                    });
                }
            })
            .catch((err) => {
              console.log(err)
            }
            )



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

export const deleteCourse = async (req, res) => {
    try {
        const record = await userModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.destroy();
            res.status(200).json({ message: 'User deleted successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// export default initUser;