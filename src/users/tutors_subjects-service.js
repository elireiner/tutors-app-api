const TutorsSubjectsService = {
    getAllTutorSubjects(knex) {
        return knex.select('*').from('tutors_subjects')
    },

    insertTutorSubject(knex, newTutorSubject) {
        return knex
            .insert(newTutorSubject)
            .into('tutors_subjects')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    
    getAllSubjectsForATutor(knex, id) {
        return knex.from('tutors_subjects').select('subjects_id').where('user_id', id)
    },

    deleteTutorSubject(knex, id) {
        return knex('tutors_subjects')
            .where({ id })
            .delete()
    },

    updateTutorSubject(knex, id, newTutorSubjectFields) {
        return knex('tutors_subjects')
            .where({ id })
            .update(newTutorSubjectFields)
    },
}

module.exports = TutorsSubjectsService