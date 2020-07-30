const path = require('path');
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serialize = user => ({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    password: user.password,
    gender: user.gender,
    rating: user.rating,
    tutor: user.tutor,
    student: user.student
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        UsersService.getAllUsers(knexInstance)
            .then(Users => {
                res.json(Users.map(serialize))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { first_name, last_name, email, user_password, gender, tutor, student } = req.body;
        const newUser = { first_name, last_name, email, user_password, gender, tutor, student };

        for (const [key, value] of Object.entries(newUser)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body` }
                })
            }
        }

        UsersService.insertUser(
            req.app.get('db'),
            newUser
        )

            .then(user => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(serialize(user))
            })
            .catch(next)
    })

usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.user_id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `user does not exist` }
                    })
                }
                res.user = user;
                next()
            })
            .catch(next)

    })
    .get((req, res, next) => {
        res.json({
            id: res.user.id,
            first_name: xss(res.first_name),
            last_name: xss(res.user.last_name),
            email: xss(res.user.email),
            password: xss(res.user.password),
            gender: xss(res.user.gender),
            rating: res.user.rating,
            tutor: res.user.tutor,
            student: res.user.student // sanitize title
        })
    })
    .delete(jsonParser, (req, res, next) => {
        UsersService.deleteUser(req.app.get('db'),
            req.params.user_id)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { first_name, last_name, email, user_password, gender, tutor, student } = req.body;
        const userToUpdate = { first_name, last_name, email, user_password, gender, tutor, student };

        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain valid value` }
            })
        }

        UsersService.updateUser(
            req.app.get('db'),
            req.params.user_id,
            userToUpdate
        )

            .then(numRowsAffected => {
                res.status(204).end()
            })

            .catch(next)
    })

module.exports = usersRouter