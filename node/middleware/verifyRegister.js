const Models = require('../models');
const User = Models.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({ where: { username: req.body.username } })
        .then(user => {
            if (user) {
                return res.status(400).send({ error: `Username ${req.body.username} has already been used` });
            }

            User.findOne({ where: { email: req.body.email } })
                .then(user => {
                    if (user) {
                        return res.status(400).send({ error: `Email ${req.body.email} has already been used` });
                    }
                    next();
                });
        });
};

const VerifyRegister = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = VerifyRegister;