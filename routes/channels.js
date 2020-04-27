const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { getUserToken, requireAuth } = require("../auth");
const db = require("../db/models");

const { Channel, User, Message, ChannelUser } = db;

const router = express.Router();
const { asyncHandler, handleValidationErrors } = require("../utils");

const userPermissionError = () => {
    const err = Error('You do not have permission to do this');
    err.title = "User alert.";
    err.status = 404;
    return err;
};

//returns all public channels
router.get('/', asyncHandler(async (req, res) => {
    const pubChannels = await Channel.findAll({ where: { isDM: false } });
    res.json(pubChannels);
}));
//returns all dms for specific user
// router.get('/dms', asyncHandler(async (req, res) => {
//     const { userId } = req.body
//     const dmChannels = await ChannelUser.findAll({
//         where: { userId: Number(userId) },
//         include: [{ model: Channel }]
//     })
//     res.json(dmChannels)
// }))

//returns list of members in a channel at particular channelId
router.get('/:channelId/members', asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.channelId, 10);
    const members = await Channel.findAll({
        include: [{ model: User, attributes: ["fullName", "id"] }],
        where: { id: channelId }
    });
    const [{ Users }] = members;
    res.json({ Users });
}));

//returns all messages in a given channel at channelId chronologically ordered
router.get('/:channelId/messages', asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.channelId, 10);
    const channelMessages = await Channel.findAll({
        include: [{
            model: Message, attributes: ["message", "userId", "createdAt"],
            include: [{ model: User, attributes: ["fullName"] }]
        }],
        where: { id: channelId },
        order: [[Message, 'createdAt']]
    });
    // const channelMessages = await Channel.findAll({
    //     include: [{ model: Message, attributes: ["message", "userId", "createdAt"] }],
    //     where: { id: channelId },
    //     order: [[Message, 'createdAt']]
    // });
    const [{ Messages }] = channelMessages;
    res.json({ Messages });
}));

//creates a new channel
router.post('/', requireAuth, asyncHandler(async (req, res) => {
    const { userId, name, isDM, } = req.body;
    const channel = await Channel.create({ userId, name, isDM });
    const channelUsers = await ChannelUser.create({ userId, channelId: channel.dataValues.id });
    const newMessage = await Message.create({ message: `I've created channel: ${name}!`, userId, channelId: channel.dataValues.id });
    res.status(201).json({ channel });
}));

//updates a channel name, checks to see if user's id matches with "owner" of channel
//userId get passed in from the fetch on front end via local storage
router.put('/:channelId', asyncHandler(async (req, res, next) => {
    const { userId, name } = req.body; //userId should be passed into the request
    const channelId = parseInt(req.params.channelId, 10);
    const channel = await Channel.findByPk(channelId);
    if (channel && (Number(userId) === channel.dataValues.userId)) {
        await channel.update({ name });
        res.json({ channel });
    } else {
        next(userPermissionError());
    }
}));

//deltes a channel, checks to see if user's id matches with "owner" of channel
//userId get passed in from the fetch on front end via local storage
router.delete('/:channelId', asyncHandler(async (req, res, next) => {
    const { userId } = req.body; //userId should be passed into the request
    const channelId = parseInt(req.params.channelId, 10);
    const channel = await Channel.findByPk(channelId);
    const channelUsers = await ChannelUser.findAll({ where: { channelId } });
    const messages = await Message.findAll({ where: { channelId } });
    if (channel && (Number(userId) === channel.dataValues.userId)) {
        for (let message of messages) {
            await message.destroy();
        }

        for (let channelUser of channelUsers) {
            await channelUser.destroy();
        }
        await channel.destroy();
        res.status(204).end();
    } else {
        next(userPermissionError());
    }
}));

module.exports = router;