module.exports = function (express) {
    let router = express.Router();
    let UserModel = require('../../models/user.model').model;
    let jwt = require('jsonwebtoken');
    let bcrypt = require('bcryptjs');
    let config = require('../../shared/config/config');
    let MSG = require('../../shared/messages/messages');
    let util = require('../../shared/util/util');

    router.get('/', (req, res) => {
        let zip;

        if (req.query && req.query.zip) {
            zip = req.query.zip;
        }

        if (zip) {
            UserModel.find({'address.zip': zip})
                .select('updatedAt createdAt firstName lastName email address role')
                .then(users => {
                    return res.status(200).json({users: users});
                })
                .catch(err => {
                    return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, err);
                });
        } else {
            return res.status(200).json({users: []});
        }

    });

    router.post('/register', (req, res) => {

        UserModel.findOne({ email: req.body.email })
            .lean()
            .exec()
            .then(result => {
                if (result) {
                    return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'User Exists');
                }

                let user = new UserModel(req.body);
                user.passwordHash = bcrypt.hashSync(req.body.password, 8);
                user.save((err, user) => {
                    if (err) {
                        return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, err);
                    }

                    let token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                delete user['passwordHash'];
                res.status(200).send({ auth: true, token: token , user: user});
            });
        })
        .catch(err => {
                return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, err);
        });

    });

    router.post('/sign-in', (req, res) => {

        if (!req.body) {
            return res.status(400).json({});
        }

        UserModel.findOne({email: req.body.email})
            .lean()
            .exec()
            .then(user => {
                if (!user) {
                    return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'Email was not found');
                }

                let passwordIsValid = bcrypt.compareSync(req.body.password, user.passwordHash);
                if (!passwordIsValid) {
                    return util.sendHttpResponseMessage(res, MSG.clientError.badRequest, null, 'Password does not match');
                }

                let token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                delete user['passwordHash'];
                res.status(200).send({ auth: true, token: token, user: user });
        })
        .catch(err => {
            return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, err);
        });

    });

    router.get('/log-out', function(req, res) {
        res.status(200).send({ auth: false, token: null });
    });

    router.put('/', (req, res) => {
        return res.status(200).json({});
    });

    return router;
};