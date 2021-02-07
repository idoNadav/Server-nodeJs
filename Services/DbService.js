const mongoDb = require('../Controllers/DbConnection');
const userSchema = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');
mongoDb().then(r => console.log('Connected database...'));

exports.isEmailExist = async function (email) {
    const result = await userSchema.findOne({email: email})
    return !!result;
}

exports.isIdExist = async function (id) {
    const result = await userSchema.findOne({_id: id})
    return !!result;
}

exports.addUser = async function (user) {
    try {
        await new userSchema(user).save();
        return user;
    } catch (err) {
        return err;
    }
}

exports.getAllUsers = async function () {
    try {
        return await userSchema.find({});
    } catch (err) {
        return err;
    }
}

exports.getUserById = async function (userId) {
    try {
        return await userSchema.findById(userId);
    } catch (err) {
        return err;
    }
}

exports.getUserByEmail = async function (userEmail) {
    try {
        return await userSchema.findOne({email: userEmail});
    } catch (err) {
        return err;
    }
}

exports.getUsersByCreatedTime = async function (createdTime) {
    try {
        return await userSchema.findOne({createdTime: createdTime});
    } catch (err) {
        return err;
    }
}

exports.updateUser = async function (userId, updateDetails) {
    try {
        const options = {new: true};
        return await userSchema.findByIdAndUpdate(userId, updateDetails, options);
    } catch (err) {
        return err;
    }
}

exports.logIn = async function (data, user) {
    try {
        return await bcrypt.compare(data.password, user.password);
    } catch (err) {
        return err;
    }
}

exports.delete = async function (userId) {
    try {
        return await userSchema.findByIdAndDelete({_id: userId});
    } catch (err) {
        return err;
    }
}

exports.resetPassword = async function(userId , newPassword){
    try {
        const options = {new: true};
        return await userSchema.findByIdAndUpdate(userId, {password: newPassword}, options);
    }catch (err){
        return err;
    }
}




