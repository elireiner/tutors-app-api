const UsersService = require('./users-service')
const SubjectsService = require('./subjects-service')
const TutorsSubjectsService = require('./tutors_subjects-service')

module.exports = {

    getMultipleSubjectsName(subjectsIds, knexInstance) {

        const allSubjectNames = subjectsIds.map(id => {
            return SubjectsService.getById(
                knexInstance,
                id.subjects_id
            )
        })
        return Promise.all(allSubjectNames)
        .catch((err) => {
            return res.status(400).json({
                error: { message: `This is the message: ${err.message}` }
            })
        })
    },

    getSubjectId(userId, knexInstance) {
        return TutorsSubjectsService.getAllSubjectsForATutor(
            knexInstance,
            userId
        )
    },

    handleTutorSubjectRelations(knexInstance, subject, res, tutorSubjectRelation) {
        if (typeof res === "undefined" || res.length === 0) {
            SubjectsService.getBySubject(
                knexInstance,
                subject
            ).then(res => {
                tutorSubjectRelation[0].subjects_id = res.subject_id
                return TutorsSubjectsService.insertTutorSubject(
                    knexInstance,
                    tutorSubjectRelation
                )
            })
            .catch((err) => {
                return res.status(400).json({
                    error: { message: `This is the message: ${err.message}` }
                })
            })
        }
        else {
            tutorSubjectRelation[0].subjects_id = res.subject_id
            return TutorsSubjectsService.insertTutorSubject(
                knexInstance,
                tutorSubjectRelation
            )
            .catch((err) => {
                return res.status(400).json({
                    error: { message: `This is the message: ${err.message}` }
                })
            })
        }

    },


}