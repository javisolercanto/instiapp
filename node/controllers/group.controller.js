const { Op, where } = require("sequelize");
const Models = require('../models');
const User = Models.user;
const Location = Models.location;
const Group = Models.group;
const Belong = Models.belong;

const LocationController = require('./location.controller');

module.exports = {
    async get(req, res) {
        const group = await Group.findByPk(req.params.group,
            {
                include: [
                    { model: Belong, include: [{ model: User, required: true }], where: { confirmed: true } },
                    { model: User, as: 'user' },
                    Location
                ]
            });
        if (!group) {
            return res.status(404).send({ error: `Group ${req.params.group} not found` });
        }

        return res.status(200).send(group);
    },
    async create(req, res) {
        const user = await User.findByPk(req.currentUser);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const validation = Group.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        return Group.create(validation.group)
            .then(async group => {
                await group.setUser(user);

                const location = await LocationController.createIfNotExist(validation.group.location);
                if (location) {
                    await group.setLocation(location);
                }

                await group.save();
                return res.status(200).send(group);
            })
            .catch(err => res.status(400).send({ error: err }));
    },
    async update(req, res) {
        const group = await Group.findByPk(req.params.group);
        if (!group) {
            return res.status(404).send({ error: `Group with id ${req.params.group} not found` });
        }

        if (group.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this group` });
        }

        const validation = Group.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        Group.update(req.body, { where: { id: group.id } })
            .then(async () => {
                Group.findByPk(req.params.group, {
                    include: [
                        { model: User, as: 'user' },
                        Location
                    ]
                })
                    .then(async group => {
                        const location = await LocationController.createIfNotExist(validation.group.location);
                        if (location) {
                            await group.setLocation(location);
                        }

                        await group.save();
                        return res.status(200).send(group);
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    async delete(req, res) {
        const group = await Group.findByPk(req.params.group, { include: [User, Location] });
        if (!group) {
            return res.status(404).send({ error: `Group ${req.params.group} not found` });
        }

        if (group.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this group` });
        }

        return Group.destroy({ where: { id: req.params.group } })
            .then(group => res.status(200).send({ deleted: group }))
            .catch(error => res.status(400).send({ error: error }))
    },
    async notifications(req, res) {
        const group = await Group.findByPk(req.params.group,
            {
                include: [
                    { model: Belong, include: [{ model: User, required: true }], where: { confirmed: false } },
                ]
            });
        if (!group) {
            return res.status(404).send({ error: `Group ${req.params.group} not found` });
        }

        return res.status(200).send(group.belongs);
    },
    async sendRequest(req, res) {
        const group = await Group.findByPk(req.params.group);
        if (!group) {
            return res.status(404).send({ error: `Group ${req.params.group} not found` });
        }

        const invitationSent = await Group.findByPk(req.params.group,
            {
                include: [
                    { model: Belong, include: [{ model: User, required: true }], where: { userId: req.currentUser } },
                ]
            });
        if (invitationSent) {
            return res.status(404).send({ error: `You have already sent an invitation to this group` });
        }

        const user = await User.findByPk(req.currentUser);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        return Belong.create({ confirmed: false })
            .then(async belong => {
                await belong.setUser(user);
                await belong.setGroup(group);
                await belong.save();

                return res.status(200).send(belong);
            })
            .catch(error => res.status(400).send(error))
    },
    async acceptRequest(req, res) {
        const group = await Group.findByPk(req.params.group);
        if (!group) {
            return res.status(404).send({ error: `Group ${req.params.group} not found` });
        }

        if (group.userId !== req.currentUser) {
            return res.status(404).send({ error: `You don't have permissions on this group` });
        }

        const request = await Group.findByPk(req.params.group,
            {
                include: [
                    {
                        model: Belong, include: [{ model: User, required: true }],
                        where: { userId: req.params.user, confirmed: false }
                    },
                ]
            });
        if (!request) {
            return res.status(404).send({ error: `You have already confirmed this user or request doesn't exists` });
        }

        const user = await User.findByPk(req.params.user);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        return Belong.update({ confirmed: true }, { where: { groupId: group.id, userId: user.id } })
            .then(belong => res.status(200).send(belong))
            .catch(error => res.status(400).send(error))
    },
    async denyRequest(req, res) {
        const group = await Group.findByPk(req.params.group);
        if (!group) {
            return res.status(404).send({ error: `Group ${req.params.group} not found` });
        }

        if (group.userId !== req.currentUser) {
            return res.status(404).send({ error: `You don't have permissions on this group` });
        }

        const request = await Group.findByPk(req.params.group,
            {
                include: [
                    {
                        model: Belong, include: [{ model: User, required: true }],
                        where: { userId: req.params.user, confirmed: false }
                    },
                ]
            });
        if (!request) {
            return res.status(404).send({ error: `You have already denied this user or request doesn't exists` });
        }

        const user = await User.findByPk(req.params.user);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        return Belong.destroy({ where: { groupId: group.id, userId: user.id } })
            .then(belong => res.status(200).send({ deleted: belong }))
            .catch(error => res.status(400).send({ error: error }))
    },
    async removeUser(req, res) {
        const group = await Group.findByPk(req.params.group);
        if (!group) {
            return res.status(404).send({ error: `Group ${req.params.group} not found` });
        }

        if (group.userId !== req.currentUser) {
            return res.status(404).send({ error: `You don't have permissions on this group` });
        }

        const belongs = await Group.findByPk(req.params.group,
            {
                include: [
                    {
                        model: Belong, include: [{ model: User, required: true }],
                        where: { userId: req.params.user, confirmed: true }
                    },
                ]
            });
        if (!belongs) {
            return res.status(404).send({ error: `This user doesn't belong to this group` });
        }

        const user = await User.findByPk(req.params.user);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        return Belong.destroy({ where: { groupId: group.id, userId: user.id } })
            .then(belong => res.status(200).send({ deleted: belong }))
            .catch(error => res.status(400).send({ error: error }))
    },
    findByName(req, res) {
        return Group.findAll({ include: [User, Location], where: { name: { $like: `%${req.params.group}%` } } })
            .then(groups => res.status(200).send(groups))
            .catch(error => res.status(400).send(error))
    },
    findAll(_, res) {
        return Group.findAll({ include: [User, Location] })
            .then(groups => res.status(200).send(groups))
            .catch(error => res.status(400).send(error))
    }
};