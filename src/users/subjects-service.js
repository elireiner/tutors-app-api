const SubjectsService = {
    getAllSubjects(knex) {
        return knex.select('*').from('subjects')
    },

    insertSubject(knex, newSubject) {
        return knex
            .insert(newSubject)
            .into('subjects')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('subjects').select('subject_name').where('subject_id', id)
    },

    deleteSubject(knex, id) {
        return knex('subjects')
            .where({ id })
            .delete()
    },

    updateSubject(knex, id, newSubjectFields) {
        return knex('subjects')
            .where({ id })
            .update(newSubjectFields)
    },
}

module.exports = SubjectsService