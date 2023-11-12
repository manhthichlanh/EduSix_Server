import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import path from "path";
export const getAllUser = async (req, res) => {
    try {
        const nhanvien = await UserModel.findAll();
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

export const updateUser = async (req, res) => {
    const userId = req.params.id;

    const { fullname, avatar, nickname, email, phone, password, active, role } = req.body;

    generatePassword(password)
        .then(
            (hashedPassword) => {
                const result = UserModel.update(
                    {
                        fullname, avatar, nickname, email, phone, password: hashedPassword, active, role, update_at: Date.now()
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
