const TutorsSubjectsService = {
    getAllTutorSubjects(knex) {
        return knex.select('*').from('tutors_subjects')
    },


    insertTutorSubject(knex, newTutorSubject) {
        let insertObject = newTutorSubject[0]
        return knex('tutors_subjects')
            .insert(insertObject)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getAllSubjectsForATutor(knex, id) {
        return knex.select('subjects_id').from('tutors_subjects').where('user_id', id)
    },

    deleteTutorSubject(knex, id) {
        return knex('tutors_subjects')
            .where({ id })
            .delete()
    },

    deleteAllTutorSubject(knex) {
        return knex('tutors_subjects')
            .delete()
    },


    updateTutorSubject(knex, id, newTutorSubjectFields) {
        return knex('tutors_subjects')
            .where({ id })
            .update(newTutorSubjectFields)
    },
}

module.exports = TutorsSubjectsService