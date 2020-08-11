const UsersService = require('./users-service')
const SubjectsServes = require('./subjects-service')
const TutorsSubjectsService = require('./tutors_subjects-service')

module.exports = {

    getMultipleSubjectsName(subjectsIds, knexInstance) {

        const allSubjectNames = subjectsIds.map(id => {
            return SubjectsServes.getById(
                knexInstance,
                id.subjects_id
            )
        })
        return Promise.all(allSubjectNames)
    },

    getSubjectId(userId, knexInstance) {
        return TutorsSubjectsService.getAllSubjectsForATutor(
            knexInstance,
            userId
        )
    }
}