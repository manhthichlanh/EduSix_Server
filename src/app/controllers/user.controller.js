import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import path from "path";
import sequelize from "../models/db";
import { verifyPassword, generatePassword } from "./auth.controller";
import fs from "fs";
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
const uploadDir = "public/images/user-avatar";
const filePath = (fileName) => path.join(uploadDir, fileName);
export const updateFieldsUser = async (req, res) => {
    const user_id = req.params.user_id;
    const updateFields = req.body;
    const updateObj = {};
    for (const [key, value] of Object.entries(updateFields)) {
        updateObj[`${key}`] = value
    }
    const uploadedFile = req.file;
    // const oldPatch =
    try {
        const existUser = await UserModel.findOne({ where: { user_id } });
        if (!existUser) return res.status(400).json({ message: "Không tìm thấy người dùng có id tương ứng!" });
        await sequelize.transaction(async (t) => {
            if (updateObj.current_password && updateObj.new_password) {
                const is_correct_password = await verifyPassword(updateObj.current_password, existUser.password);
                if (!is_correct_password) return res.status(400).json({ message: "Sai mật khẩu" });

                const hashpassword = await generatePassword(updateObj.new_password);
                updateObj.password = hashpassword;
                delete updateObj.current_password
                delete updateObj.new_password

            } else if (uploadedFile) {
                const fileName = Date.now() + '-' + uploadedFile.originalname.toLowerCase().split(" ").map(item => item.trim()).join("");
                if (existUser.avatar) {
                    if (existUser.avatar.includes("https://")) {
                        await fs.promises.writeFile(filePath(fileName), uploadedFile?.buffer);
                        updateObj.avatar = fileName;
                    } 
                    else {
                        const oldPath = filePath(existUser.avatar);
                        try {
                            fs.exists(oldPath, async (exist) => {
                                console.log(exist)
                                if (!exist) {
                                    await fs.promises.writeFile(filePath(fileName), uploadedFile?.buffer);
                                } else {
                                    const newPath = filePath(fileName)
                                    await fs.promises.writeFile(oldPath, uploadedFile?.buffer);
                                    await fs.promises.rename(oldPath, newPath);
                                }
                            }
                            )
                            updateObj.avatar = fileName;
                        } catch (error) {
                            console.log({ error })
                        }
                    }
                } else {
                    const newPath = filePath(fileName)
                    await fs.promises.writeFile(newPath, uploadedFile?.buffer);
                    updateObj.avatar = fileName;
                }
            }
            await existUser.update(updateObj, { transaction: t });
            return res.json({ message: 'User updated successfully' });
        })
    } catch (error) {
        console.error('Error updating user: ', error);
        return res.status(500).json({ message: error.message });
    }
}
export const getImage = async (req, res) => {
    const fileName = req.params.fileName;
    let file
    console.log(filePath(fileName))
    try {
        file = await fs.promises.readFile(filePath(fileName));
        return res.status(200).send(file)
    } catch (error) {
        return res.status(404).json({ message: "Không tìm thấy file!" })
    }
}
export const deleteUser = async (req, res) => {
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
