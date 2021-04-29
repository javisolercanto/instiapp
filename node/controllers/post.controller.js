const { Op } = require("sequelize");
const Models = require('../models');
const User = Models.user;
const Post = Models.post;
const Category = Models.category;

module.exports = {
    async get(req, res) {
        const post = await Post.findByPk(req.params.post,
            {
                include: [
                    {
                        model: User, as: 'users',
                        through: { attributes: ['userId', 'postId'] }
                    },
                    { model: User, as: 'user' },
                    { model: Post, as: 'parent' },
                    Category
                ]
            });
        if (!post) {
            return res.status(404).send({ error: `Post with id ${req.params.post} not found` });
        }

        return res.status(200).send(post);
    },
    async getReplies(req, res) {
        const post = await Post.findByPk(req.params.post, { include: [User, { model: Post, as: 'parent' }, Category] });
        if (!post) {
            return res.status(404).send({ error: `Post with id ${req.params.post} not found` });
        }

        return Post.findAll({ where: { parentId: post.id }, include: [User, Category] })
            .then(replies => res.status(200).send(replies))
            .catch(error => res.status(400).send(error))
    },
    async create(req, res) {
        const user = await User.findByPk(req.currentUser);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const validation = Post.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        return Post.create(validation.post)
            .then(async post => {
                await post.setUser(user);
                if (validation.post.category) {
                    const category = await Category.findByPk(validation.post.category);
                    if (!category) {
                        return res.status(400).send({ error: `Category not found` });
                    }
                    await post.setCategory(category);
                }

                if (validation.post.post) {
                    const postParent = await Post.findByPk(validation.post.post);
                    if (!postParent) {
                        return res.status(400).send({ error: `Post not found` });
                    }
                    await post.setParent(postParent);
                }

                await post.save();
                return res.status(200).send(post);
            })
            .catch(err => res.status(400).send({ error: err }));
    },
    async update(req, res) {
        const post = await Post.findByPk(req.params.post, { include: [{ model: Post, as: 'parent' }] });
        if (!post) {
            return res.status(404).send({ error: `Post with id ${req.params.post} not found` });
        }

        if (post.userId !== req.currentUser || (post.parent && post.parent.userId !== req.currentUser)) {
            return res.status(404).send({ error: `You are not the owner of this post` });
        }

        const validation = Post.validate(req.body);
        if (validation.response !== 200) {
            return res.status(validation.response).send({ error: validation.error });
        }

        if (validation.post.category) {
            const category = await Category.findByPk(validation.post.category);
            if (!category) {
                return res.status(400).send({ error: `Category not found` });
            }

            await post.setCategory(category);
            await post.save();
        }

        Post.update(validation.post, { where: { id: req.params.post } })
            .then(async () => {
                Post.findByPk(req.params.post, { include: [User, { model: Post, as: 'parent' }, Category] })
                    .then(async updatedPost => {
                        if (!updatedPost.parentId || post.resolved === updatedPost.resolved) {
                            return res.status(200).send(updatedPost)
                        }

                        if (req.currentUser !== updatedPost.parent.userId) {
                            return res.status(404).send({ error: `You can't mark as resolved if you are not the owner of this post` });
                        }

                        if (updatedPost.resolved) {
                            await Post.update({ resolved: true }, { where: { id: updatedPost.parentId } });
                            await Post.update({ resolved: false },
                                { where: { parentId: updatedPost.parentId, id: { [Op.not]: updatedPost.id } } });
                        }

                        if (!updatedPost.resolved) {
                            await Post.update({ resolved: false }, { where: { id: updatedPost.parentId } });
                        }

                        return res.status(200).send(updatedPost);
                    })
            })
            .catch(err => {
                return res.status(400).send({ error: err });
            });
    },
    async delete(req, res) {
        const post = await Post.findByPk(req.params.post);
        if (!post) {
            return res.status(404).send({ error: `Post with id ${req.params.post} not found` });
        }

        if (post.userId !== req.currentUser) {
            return res.status(404).send({ error: `You are not the owner of this post` });
        }

        if (post.parentId && post.resolved) {
            await Post.update({ resolved: false }, { where: { id: post.parentId } });
        }

        return Post.destroy({ where: { id: req.params.post } })
            .then(post => res.status(200).send({ deleted: post }))
            .catch(error => res.status(400).send({ error: error }))
    },
    async toogleReaction(req, res) {
        const post = await Post.findByPk(req.params.post,
            {
                include: [
                    {
                        model: User, as: 'users',
                        through: { attributes: ['userId', 'postId'] }
                    }
                ]
            });

        if (!post) {
            return res.status(404).send({ error: `Post with id ${req.params.post} not found` });
        }

        const user = await User.findByPk(req.currentUser);
        if (!user) {
            return res.status(404).send({ error: `User with id ${req.currentUser} not found` });
        }

        let hasReacted = false;
        if (post.users) post.users.map(reactedUser => {
            if (reactedUser.id === user.id) {
                hasReacted = true;
            }
        });

        if (hasReacted) {
            post.removeUser(user);

        } else {
            post.addUser(user);
        }

        post.save();
        return res.status(200).send({ reaction: post })
    },
    findByName(req, res) {
        return Post.findAll({ include: [User, Location], where: { name: { $like: `%${req.params.post}%` } } })
            .then(post => res.status(200).send(post))
            .catch(error => res.status(400).send(error))
    },
    findAll(_, res) {
        return Post.findAll({
            include: [
                {
                    model: User, as: 'users',
                    through: { attributes: ['userId', 'postId'] }
                },
                { model: User, as: 'user' },
                { model: Post, as: 'parent' },
                Category
            ]
        })
            .then(post => res.status(200).send(post))
            .catch(error => res.status(400).send(error))
    }
};