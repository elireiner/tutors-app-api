const path = require('path');
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const SubjectsService = require('./subjects-service')
const TutorsSubjectsService = require('./tutors_subjects-service')
const RouterHelpers = require('./router-helpers');

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
    student: user.student,
    fee: user.fee
})

const connectEachUserWithSubjects = (users, subjects) => {
    let i = 0
    users.forEach(user => {
        //subjects is a little messy, with a lot of nested arrays
        //Let's clean it up!
        let subjectsArray = []
        subjects[i].map(subject => {
            subjectsArray.push(subject[0].subject_name)
        })

        //Now that we have a clean array of subject names,
        //we can finally add it to the each user object

        //Beware, that the method of connecting a user with their correct subject array
        //works only because they are ordered in their respective array in parallel
        //meaning the first user's subjects is located in the first location of the 'subjects' array
        user.subjects = subjectsArray
        i++
    })
    return users
}

const testIt = (knexInstance, subjectsArray) => {

    return Promise.all(
        subjectsArray.map((id) => {

            return SubjectsService.getById(knexInstance, id.subjects_id);

        })).then(res => {
            return res
        })

    //return array of promises

}

const addSubjectsToEachUser = (knexInstance, users, res) => {

    Promise.all(
        users.reduce((accumulator, user) => {
            accumulator.push(TutorsSubjectsService.getAllSubjectsForATutor(knexInstance, user.user_id));
            return accumulator;
        }, [])

    ).then((userResults) => {
        //resolve all promises; userResult is an array of results from promises above
        //it includes the an array of subject ids

        //Since we want to return to the end user the name of the subjects
        //instead of the subject id, we need to get the names:
        Promise.all(userResults.reduce((acc, el) => {
            //for each user create array of promises given the subject list
            acc = acc.concat(testIt(knexInstance, el))
            return acc
        }, [])).then((results) => {
            //The previous promise resolves to an array of subject names
            //However, we need to return an array of user objects and add to each user
            //their subject
            return res.status(200).send(connectEachUserWithSubjects(users, results));
        }).catch((err) => {
            return res.status(500).end();
        })
    })
        .catch(err => {
            return res.status(500).end();
        })
}

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        //get all users
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                //since subjects for each user isn't returned, we need to add them
                return addSubjectsToEachUser(knexInstance, users, res)
            })
            .catch(next)

    })
    .post(jsonParser, (req, res, next) => {
        const { first_name, last_name, email, user_password, gender, tutor, student, fee, in_person, online_medium, subjects } = req.body;
        const userFields = { first_name, last_name, email, user_password, gender, tutor, student, fee, in_person, online_medium, subjects };
        const newUser = { first_name, last_name, email, user_password, gender, tutor, student, fee, in_person, online_medium };

        for (const [key, value] of Object.entries(userFields)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body` }
                })
            }
        }

        let user = []
        const tutorSubjectRelation = [{ subjects_id: null, user_id: null }]
        UsersService.insertUser(
            req.app.get('db'),
            newUser
        )
            .then(res => {
                user.push(res)
                tutorSubjectRelation[0].user_id = user[0].user_id

                subjects.map(subject => {
                    return SubjectsService.getBySubject(
                        req.app.get('db'),
                        subject
                    )
                        .then(res => {

                            if (typeof res === 'undefined') {

                                return SubjectsService.insertSubject(
                                    req.app.get('db'),
                                    subject
                                )
                            }
                            return res
                        })
                        .then(res => {
                            tutorSubjectRelation[0].subjects_id = res.subject_id
                            return TutorsSubjectsService.insertTutorSubject(
                                req.app.get('db'),
                                tutorSubjectRelation
                            )

                        })
                })
            })
            .then(function () {
                //till here we inserted the new user
                //now we will retrieve the new user and return them

                //get the user id through the unique email

                return UsersService.getByEmail(req.app.get('db'), email)

            })
            .then(function (userId) {

                UsersService.getById(
                    req.app.get('db'),
                    userId.user_id
                )
                    .then(user => {
                        if (!user) {
                            return res.status(404).json({
                                error: { message: `user does not exist` }
                            })
                        }
                        res.user = user;
                        res.user.subjects = []
                    })
                return userId.user_id
            })
            .then(function (userId) {
                return RouterHelpers.getSubjectId(userId, req.app.get('db'))
            })
            .then(function (subjectsIds) {

                return RouterHelpers.getMultipleSubjectsName(subjectsIds, req.app.get('db'))
            })
            .then(function (name) {

                const names = []
                name.map(subject => {
                    names.push(subject[0].subject_name)
                })

                return names
            })
            .then(function (results) {
                //Since xss removes the array and combines all elements into one,
                //We need to restore them 
                res.user.subjects = xss(results).split(",");

                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user[0].id}`))
                    .json({
                        id: res.user.user_id,
                        first_name: xss(res.user.first_name),
                        last_name: xss(res.user.last_name),
                        email: xss(res.user.email),
                        password: xss(res.user.password),
                        gender: xss(res.user.gender),
                        rating: res.user.rating,
                        tutor: res.user.tutor,
                        student: res.user.student,
                        subjects: res.user.subjects
                    })
            })
            .catch(next)
    })
    .delete(jsonParser, (req, res, next) => {
        TutorsSubjectsService.deleteAllTutorSubject(req.app.get('db'))
        UsersService.deleteAllUsers(req.app.get('db'))
            .then(numRowsAffected => {
                res.status(204).end()
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
        res.user.subjects = []
        let knexInstance = req.app.get('db')

        RouterHelpers.getSubjectId(res.user.user_id, knexInstance)
            .then(function (subjectsIds) {
                return RouterHelpers.getMultipleSubjectsName(subjectsIds, knexInstance)
            })
            .then(function (name) {
                const names = []
                name.map(subject => {
                    names.push(subject[0].subject_name)
                })
                return names
            })
            .then(function (results) {
                res.user.subjects
                //Since xss removes the array and combines all elements into one,
                //We need to restore them 
                res.user.subjects = xss(results).split(",");

                res.json({
                    id: res.user.user_id,
                    first_name: xss(res.user.first_name),
                    last_name: xss(res.user.last_name),
                    email: xss(res.user.email),
                    password: xss(res.user.password),
                    gender: xss(res.user.gender),
                    rating: res.user.rating,
                    tutor: res.user.tutor,
                    student: res.user.student,
                    subjects: res.user.subjects
                })
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