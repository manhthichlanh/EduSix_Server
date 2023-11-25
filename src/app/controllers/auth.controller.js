import { promisify } from 'util';
import { sign, verify } from 'jsonwebtoken';
import sequelize from '../models/db';
import UserModel from "../models/user.model";
import AdminModel from '../models/admin.model';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import path from "path";
//middeware error để trace bug 
import AppError from '../../utils/appError';
import { errorCode, generateRandomNumberWithRandomDigits, generateRandomString } from '../../utils/util.helper';
import { getGoogleUser, getGoogleUserInfo, getOauthGooleToken } from '../../utils/googleAPI';
import { getFacebookUser, getOauthFacebookToken } from '../../utils/facebookAPI';
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
export const createUser = async (req, res) => {

    const { fullname, avatar, nickname, email, password } = req.body;
    let newNickname;
    if (!nickname) newNickname = fullname.split(" ").slice(-1)[0]
    const randomWord = generateRandomString(16);
    generatePassword(password)
        .then(
            (hashedPassword) => {
                const user = UserModel.create(
                    { sub_id: 'direct@email@login@' + randomWord, fullname, avatar, nickname: newNickname, email, password: hashedPassword, status: true }
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
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({
            where:
            {
                email,
                // sub_id: { [sequelize.Op.like]: "%direct@email@login@" }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }

        // Create JWT
        const token = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, privateKey, {
            algorithm: 'RS256',
            expiresIn: "7d",
        });

        return res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi đăng nhập" });
    }
};
export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await AdminModel.findOne({ where: { username } });
        if (!admin) {
            return res.status(404).json({ message: "Username không tồn tại" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mật khẩu không chính xác" });
        }
        if (admin.status == 0) return res.status(403).json({ message: "Tài khoản không khả dụng" })
        // Create JWT
        const token = jwt.sign({ adminId: admin.admin_id, username: admin.username, avatar: admin.avatar, role: admin.role }, privateKey, {
            algorithm: 'RS256',
            expiresIn: "7d",
        });

        return res.status(200).json({ token, admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi đăng nhập" });
    }
};
export const createAdmin = async (req, res) => {

    const { fullname, avatar, username, password, status, role } = req.body;

    generatePassword(password)
        .then(
            (hashedPassword) => {
                const admin = AdminModel.create(
                    { fullname, avatar, username, password: hashedPassword, status, role }
                )
                return admin
            }
        )

        .then(
            (admin) => {
                res.status(201).json({
                    status: "success",
                    admin,
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
export const googleAuth2 = async (req, res, next) => {
    try {
        const { code, state } = req.query
        const data = await getOauthGooleToken(code) // Gửi authorization code để lấy Google OAuth token
        const { id_token, access_token } = data // Lấy ID token và access token từ kết quả trả về
        const googleUser = await getGoogleUser({ id_token, access_token }) // Gửi Google OAuth token để lấy thông tin người dùng từ Google
        const { nicknames } = await getGoogleUserInfo(access_token, 'nicknames')
        const nickname = nicknames ? nicknames[0].value : null;
        // Kiểm tra email đã được xác minh từ Google
        if (!googleUser.verified_email) {
            return res.status(403).json({
                message: 'Google email not verified'
            })
        }
        const existUser = await UserModel.findOne({ where: { sub_id: googleUser.id } })
        if (!existUser) {
            const password = generateRandomString(11);
            const { id, email, name, picture, family_name, given_name, locale } = googleUser;

            const fullname = locale == 'vi' ? family_name + " " + given_name : name;
            const avatar = picture;
            const hashedPassword = await generatePassword(password)

            const user = await UserModel.create(
                { sub_id: id, fullname, avatar, nickname, email, password: hashedPassword, status: true }
            )
            console.log(user)
        } else {
            const userJson = await existUser.toJSON();
            const queryObject = []
            if (!userJson.nickname && !userJson.avatar) {
                queryObject.push({ nickname: nickname, avatar: googleUser.picture }, { fields: [`nickname`, `avatar`] })
            } else if (!userJson.nickname) {
                queryObject.push({ nickname: nickname }, { fields: [`nickname`] })

            } else if (!userJson.avatar) {
                queryObject.push({ avatar: googleUser.picture }, { fields: [`avatar`] })

            }
            await existUser.update(...queryObject)
            console.log(queryObject)
        }
        console.log({ sub_id: googleUser.id })
        // Tạo manual_access_token và manual_refresh_token sử dụng JWT (JSON Web Token)
        const manual_token = jwt.sign({ sub_id: googleUser.id }, privateKey, {
            algorithm: 'RS256',
            expiresIn: "7d",
        });

        // Redirect người dùng về trang login với access token và refresh token

        return res.redirect(
            `${state}?manual_token=${manual_token}`
        )
    } catch (error) {
        next(error)
    }
}
export const facebookAuth2 = async (req, res, next) => {
    const { code, state } = req.query
    try {
        const data = await getOauthFacebookToken(code) // Gửi authorization code để lấy Facebook OAuth token
        const { access_token } = data // Lấy ID token và access token từ kết quả trả về
        const { id, picture, short_name, name, email } = await getFacebookUser(access_token) // Gửi Facebook OAuth token để lấy thông tin người dùng từ Facebook
        const nickname = short_name;
        const avatar = picture.data.url;
        const fullname = name;

        const existUser = await UserModel.findOne({ where: { sub_id: id } })

        if (!existUser) {
            const password = generateRandomString(11);

            const hashedPassword = await generatePassword(password)

            const user = await UserModel.create(
                { sub_id: id, fullname, avatar, nickname, email, password: hashedPassword, status: true }
            )
            console.log(user)
        } else {
            const userJson = await existUser.toJSON();
            const queryObject = []
            if (!userJson.nickname && !userJson.avatar) {
                queryObject.push({ nickname: nickname, avatar }, { fields: [`nickname`, `avatar`] })
            } else if (!userJson.nickname) {
                queryObject.push({ nickname }, { fields: [`nickname`] })

            } else if (!userJson.avatar) {
                queryObject.push({ avatar: avatar }, { fields: [`avatar`] })

            }
            await existUser.update(...queryObject)
            console.log(queryObject)
        }
        console.log({ sub_id: id })
        // Tạo manual_access_token và manual_refresh_token sử dụng JWT (JSON Web Token)
        const manual_token = jwt.sign({ sub_id: id }, privateKey, {
            algorithm: 'RS256',
            expiresIn: "7d",
        });

        // Redirect người dùng về trang login với access token và refresh token

        return res.redirect(
            `${state}?manual_token=${manual_token}`
        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }


}
export const authenticateJWT = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next);
    }

    if (token) {
        jwt.verify(token, publicKey, (err, user) => {
            if (err) {
                return res.sendStatus(401);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
export const verifyUserToken = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next);
    }

    if (token) {
        jwt.verify(token, publicKey, async (err, user) => {
            if (err) {
                return res.sendStatus(401);
            }
            const { sub_id } = user;
            const userData = await UserModel.findOne({ where: { sub_id } })
            const userDataJson = await userData.toJSON();
            delete userDataJson.password;
            delete userDataJson.updated_at;
            return res.status(200).json({ user: userDataJson });
        });
    } else {
        res.sendStatus(401);
    }
}

export const verifyAdminToken = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next);
    }

    if (token) {
        jwt.verify(token, publicKey, async (err, admin) => {
            if (err) {
                return res.sendStatus(401);
            }
            const { adminId, username } = admin;
            const adminData = await AdminModel.findOne({ where: { admin_id: adminId, username } })
            const adminDataJson = await adminData.toJSON();

            return res.status(200).json({ profile: adminDataJson });
        });
    } else {
        res.sendStatus(401);
    }
}


export async function protect(req, res, next) {
    try {
        // 1) check if the token is there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next);
        }

        // 2)   
        const decode = await promisify(verify)(token, publicKey);

        // console.log("decode", decode)
        // 3) check if the user is exist (not deleted)
        // const user = await User.findByPk(decode.id);
        const user = await UserModel.findByPk(decode.userId, {
            raw: true,
            nest: true
            // include: ['role']
            // through: { attributes: ["title","description"] },
            // attributes: ['email'],
        });

        if (!user) {
            return next(new AppError(401, 'fail', 'This user is no longer exist'), req, res, next);
        }
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}