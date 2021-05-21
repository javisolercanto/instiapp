const { Op } = require("sequelize");
const Models = require('../models');
const User = Models.user;
const Location = Models.location;
const Group = Models.group;
const Belong = Models.belong;
const Mail = require('./email.controller');

const LocationController = require('./location.controller');

let mailOptions = {
    from: 'instiweb.help@gmail.com',
};

module.exports = {
    async get(req, res) {
        const group = await Group.findByPk(req.params.group,
            {
                include: [
                    { model: Belong, required: false, include: [{ model: User, required: false }], where: { confirmed: true } },
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

        Group.update(validation.group, { where: { id: group.id } })
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
                    { model: Belong, required: false, include: [{ model: User, required: true }], where: { confirmed: false } },
                ]
            });
        if (!group) {
            return res.status(404).send({ error: `Group ${req.params.group} not found` });
        }

        return res.status(200).send(group.belongs);
    },
    async sendRequest(req, res) {
        const group = await Group.findByPk(req.params.group, { include: [User] });
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

                mailOptions.to = group.user.email;
                mailOptions.subject = `Hi ${group.user.name}, you have a new request!`;
                mailOptions.text = `${user.name} has request to join your group
                \nYou can accept or deny this request from your group control panel`

                Mail.send(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(400).send({ error: error });
                    } else {
                        return res.status(200).send(belong);
                    }}
                );
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
            .then(belong => {
                mailOptions.to = user.email;
                mailOptions.subject = `Hi ${user.name}, your request has been accepted!`;
                mailOptions.text = `${user.name} your request to join ${group.name} has been accepted`

                Mail.send(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(400).send({ error: error });
                    } else {
                        return res.status(200).send(belong);
                    }}
                );
            })
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
            .then(belong => {
                mailOptions.to = user.email;
                mailOptions.subject = `Hi ${user.name}, your have request has been denied!`;
                mailOptions.text = `${user.name} your request to join ${group.name} has been denied`

                Mail.send(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(400).send({ error: error });
                    } else {
                        return res.status(200).send({ deleted: belong })
                    }}
                );
            })
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
                        model: Belong, required: false, include: [{ model: User, required: true }],
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
            .then(belong => {
                mailOptions.to = user.email;
                mailOptions.subject = `Hi ${user.name}, you have been removed from a route group!`;
                mailOptions.text = `${user.name} you have been removed from a route group ${group.name}`

                Mail.send(mailOptions, function (error, info) {
                    if (error) {
                        return res.status(400).send({ error: error });
                    } else {
                        return res.status(200).send({ deleted: belong })
                    }}
                );
            })
            .catch(error => res.status(400).send({ error: error }))
    },
    findAll(req, res) {
        const { page, size, name, location, price, days, owner, order, direction } = req.query;
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        
        const condition = {};
        if (name) {
            condition.name = { [Op.like]: `%${name}%` };
        }
        if (location) {
            condition.locationId = parseInt(location);
        }
        if (price) {
            condition.price = { [Op.lte]: price };
        }
        if (days) {
            condition.days = days;
        }
        if (owner) {
            condition.userId = parseInt(owner);
        }

        let orderQuery = [];
        if (order) {
            orderQuery.push([order, direction ? direction : 'ASC']);
        }

        return Group.findAndCountAll({ limit: limit, offset: offset, order: orderQuery, where: condition, 
                include: [
                    { model: Belong, required: false, include: [{ model: User, required: false }], where: { confirmed: true } },
                    { model: User, as: 'user' },
                    Location
                ]
            })
            .then(groups => {
                const { count: totalItems, rows: data } = groups;
                const currentPage = page ? +page : 0;
                const totalPages = Math.ceil(totalItems / limit);

                return res.status(200).send({data, currentPage, totalPages, totalItems});
            })
            .catch(error => res.status(400).send(error))
    }
};