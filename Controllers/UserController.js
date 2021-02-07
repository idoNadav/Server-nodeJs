const express = require('express');
const router = express.Router();
const userService = require('../Services/UserService');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    try {
        res.status(201).send(await userService.addUser(req.body));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/users', async (req, res) => {
    try {
        res.status(200).send(await userService.getAllUsers());
    } catch (err) {
        res.send(err.message);
    }
});

router.get('/userById/:userId', async (req, res) => {
    try {
        res.status(200).send(await userService.getUserById(req.params['userId']))
    } catch (err) {
        res.status(400).send(err.message);
    }
})

router.get('/userByEmail/:userEmail', async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.params['userEmail']);
        const token =jwt.sign({_id: user._id}, process.env.TOKEN_SECRETE)
        res.status(200) && res.json({token:token ,details:user});
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/usersByCreatedTime/:createdTime', async (req, res) => {
    try {
        res.status(200).send(await userService.getUsersByCreatedTime(req.params['createdTime']));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/updateUser/:userEmail', async (req, res) => {
    try {
        res.status(201).send(await userService.updateUser(req.params['userEmail'], req.body));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/logIn', async (req, res) => {
    try {
        let token = await userService.logIn(req.body);
        let status = true;
        if(!token){
            status = false;
        }
        res.status(200) && res.json({token:token ,
        status:status});
    } catch (err) {
        res.status(401).send({error:err.message});
    }
});

router.delete('/deleteUser/:userEmail', async (req, res) => {
    try {
        res.status(200).res.send(await userService.delete(req.params['userEmail']));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put('/reset-password', async (req, res) => {
    try {
        res.status(201).send(await userService.resetPassword(req.body.token, req.body.newPassword));
    } catch (err) {
        res.status(400).send(err.message);
    }
})

router.get('/forgot-password/:userEmail', async (req, res) => {
    try {
        res.status(200).send(await userService.forgotPassword(req.params['userEmail']));
    } catch (err) {
        res.status(400).send(err.message);
    }
})

router.post('/verify-validation', async (req, res) => {
    try {
        res.send(await userService.verifyToken(req.body.token))
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
