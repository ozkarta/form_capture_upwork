module.exports = function (express) {
    let router = express.Router();
    let UserModel = require('../../model/user.model').model;
    let jwt = require('jsonwebtoken');
    let bcrypt = require('bcryptjs');
    let config = require('../../shared/config/config');
    let MSG = require('../../shared/messages/messages');
    let util = require('../../shared/util/util');
    let mailer = require('../../shared/mailer');

    router.get('/', (req, res) => {
        let zip;

        if (req.query && req.query.zip) {
            zip = req.query.zip;
        }

        if (zip) {
            UserModel.find({'zipCodes': zip})
                .select('updatedAt createdAt firstName lastName email address role lookingFor')
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

    router.get('/distinct-zip-codes', (req, res) => {
        let usersByZip = {};
        let array = [];
        UserModel.find({role: 'buyer'})
            .lean()
            .select('updatedAt createdAt firstName lastName email role lookingFor zipCodes')
            .exec()
            .then(users => {
                users.forEach(user => {
                   if (user && user['zipCodes'] && user['zipCodes'].length) {
                       user['zipCodes'].forEach(zip => {
                            if (usersByZip[zip]) {
                                usersByZip[zip].push(user);
                            } else {
                                usersByZip[zip] = [];
                                usersByZip[zip].push(user);
                            }
                       });
                   }
                });

                Object.keys(usersByZip).forEach(zip => {
                    array.push({zipCode: zip, user: usersByZip[zip]});
                });
                return res.status(200).json({usersByZip: array});
            });


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

                console.log('Message Body');
                let mailBody =
                    '<table>'+
                      '<tr>'+
                        '<th>FirstName</th>'+
                        '<th>LastName</th>'+
                        '<th>Email</th>'+
                        '<th>LookingFor...</th>'+
                        '<th>Zip Codes</th>'+
                      '</tr>'+
                      '<tr>'+
                        `<td>${user['firstName']}</td>`+
                        `<td>${user['lastName']}</td>`+
                        `<td>${user['email']}</td>`+
                        `<td>${user['lookingFor']}</td>`+
                        `<td>${user['zipCodes'].join()}</td>`+
                      '</tr>'+
                    '</table>';


                console.dir(mailBody);
                mailer.sendMail(config.admin_email, 'New User Registered', `New User Registered`, mailBody);
            });
        })
        .catch(err => {
                return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, err);
        });

    });

    router.post('/register-temp-user', (req, res) => {

        UserModel.findOne({ phone: req.body.phone })
            .lean()
            .exec()
            .then(result => {
                if (result) {
                    return res.status(200).send({auth: true, user: result});
                }

                let user = new UserModel(req.body);
                user.role = 'temporary';
                user.save((err, user) => {
                    if (err) {
                        return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, err);
                    }

                    //mailer.sendMail(config.admin_email, 'New Visitor Registered', ``, `<h3>Name: ${user.firstName} ${user.lastName}</h3>Phone: ${user.phone}`);
                    return res.status(200).send({auth: true, user: user});

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

                mailer.sendMail(user.email, 'New Sign In', `You just signed In`);
        })
        .catch(err => {
            return util.sendHttpResponseMessage(res, MSG.serverError.internalServerError, err);
        });

    });

    router.get('/log-out', function(req, res) {
        res.status(200).send({ auth: false, token: null });
    });

    router.put('/', (req, res) => {
        UserModel.findOneAndUpdate({'_id': req.body.user['_id']}, req.body.user, {new: true})
            .then(updatedUser => {
                return res.status(200).json({updatedUser: updatedUser});
            });
    });

    return router;
};