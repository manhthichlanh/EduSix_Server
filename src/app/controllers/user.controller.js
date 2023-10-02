import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import path from "path";
const privateKey = readFileSync("SSL/private-key.txt", "utf-8");
const publicKey = readFileSync("SSL/public-key.txt", "utf-8");
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
        const nhanvien = await UserModel.findAll({});
        res.json(nhanvien)
    } catch (error) {
        console.log(error);
        res.sendStatus(501)
    }

}

export const getCourseById = async (req, res) => {
    try {
        const record = await UserModel.findByPk(req.params.id);
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

    const { fullname, avatar, nickname, email, phone, address, password, active, role } = req.body;

    generatePassword(password)
        .then(
            (hashedPassword) => {
                const user = UserModel.create(
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



}
export const updateUser = async (req, res) => {
    const userId = req.params.id;

    const { fullname, avatar, nickname, email, phone, address, password, active, role } = req.body;

    generatePassword(password)
        .then(
            (hashedPassword) => {
                const result = UserModel.update(
                    {
                        fullname, avatar, nickname, email, phone, address, password: hashedPassword, active, role, update_at: Date.now()
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

        .then(
            async () => {
                const user = await UserModel.findByPk(userId);

                res.status(200).json({
                    status: "success",
                    user
                });
            }

        )
        .catch((err) => {
            console.log(err);
            res.sendStatus(501)
        })
}

export const deleteCourse = async (req, res) => {
    try {
        const record = await UserModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found ' });
        } else {
            await record.destroy();
            res.status(200).json({ message: 'User deleted successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ where: { email } });
        
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }

        // Create JWT
        const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, privateKey, {
            algorithm: 'RS256',
            expiresIn: "1h",
        });

        return res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi đăng nhập" });
    }
};
export const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, publicKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};