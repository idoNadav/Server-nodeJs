const nodemailer = require('nodemailer');
const dbService = require("./DbService");
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

exports.isEmailExist = async function (email) {
    return await dbService.isEmailExist(email);
}

exports.isIdExist = async function (id) {
    return await dbService.isIdExist(id);
}

exports.getAllUsers = async function () {
    try {
        return await dbService.getAllUsers();
    } catch (err) {
        return err;
    }
}

exports.getUserById = async function (userId) {
    if (!await this.isIdExist(userId)) {
        throw new Error("This id doesn't exist:" + " " + userId);
    }
    try {
        return await dbService.getUserById(userId);
    } catch (err) {
        return err;
    }
}

exports.getUserByEmail = async function (userEmail) {
    if (!await this.isEmailExist(userEmail)) {
        throw new Error("This email doesn't exist:" + " " + userEmail);
    }
    try {
        return await dbService.getUserByEmail(userEmail);
    } catch (err) {
        return err;
    }
}

exports.getUsersByCreatedTime = async function (createdTime) {
    try {
        return await dbService.getUsersByCreatedTime(createdTime);
    } catch (err) {
        return err;
    }
}

exports.addUser = async function (user) {
    if (await this.isEmailExist(user.email)) {
        throw new Error('User with this email already exist!')
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = {
        _id: uuid.v1(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword,
        phoneNumber: user.phoneNumber,
        createdTime: Date.now()
    }
    try {
        return await dbService.addUser(newUser)
    } catch (err) {
        return err;
    }
}

exports.updateUser = async function (userEmail, updateDetails) {
    if (!await this.isEmailExist(userEmail)) {
        throw new Error("This email doesn't exist:" + " " + userEmail)
    }
    const user = await this.getUserByEmail(userEmail);
    try {
        return await dbService.updateUser(user._id, updateDetails);
    } catch (err) {
        return err;
    }
}

exports.logIn = async function (data) {
    if (!await this.isEmailExist(data.email)) {
        throw new Error("This email doesn't exist:" + " " + data.email)
    }
    const user = await this.getUserByEmail(data.email);
    try {
        const isLogged = await dbService.logIn(data, user);
        if (isLogged) {
            return jwt.sign({_id: user._id}, process.env.TOKEN_SECRETE);
        }
        return false;
    } catch (err) {
        return err;
    }
}

exports.delete = async function (userEmail) {
    if (!await this.isEmailExist(userEmail)) {
        throw new Error("This email doesn't exist:" + " " + userEmail);
    }
    const user = await this.getUserByEmail(userEmail);
    try {
        return await dbService.delete(user._id);
    } catch (err) {
        return err
    }
}

exports.resetPassword = async function (token, newPassword) {
    const user = await this.verifyToken(token);
    if (!await this.isEmailExist(user.email)) {
        throw new Error("This email doesn't exist:" + " " + user.email);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
        return await dbService.resetPassword(user._id, hashedPassword)
    } catch (err) {
        return err;
    }
}

async function verify(token) {
    return await jwt.verify(token, process.env.TOKEN_SECRETE, (err, res) => {
        if (err) {
            return err;
        } else {
            return res;
        }
    });
}

exports.verifyToken = async function (token) {
    return await verify(token);
}

exports.forgotPassword = async function (userEmail) {
    if (!await this.isEmailExist(userEmail)) {
        throw new Error("This email doesn't exist:" + " " + userEmail);
    }
    const user = await this.getUserByEmail(userEmail);
    const {_id, email, password} = user;
    const token = jwt.sign({_id, email, password}, process.env.TOKEN_SECRETE);
    const url = process.env.CLIENT_URL + '/Reset_password/' + token;

    let mailOption = {
        from: "idomongodb@gmail.com",
        to: userEmail,
        subject: 'Verify user:' + "  " + user.email,
        html: ' <h2> :Please click on given link to verify your user </h2> \n' + url

    };
    try {
        const res = await transporter.sendMail(mailOption);
        console.log('Email has been sent to' + " " + userEmail + "," + "please activate your account" );
        return res.accepted;
    } catch (err) {
        return err;
    }
}






