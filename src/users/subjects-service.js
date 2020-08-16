const SubjectsService = {
    getAllSubjects(knex) {
        return knex.select('*').from('subjects')
    },

    insertSubject(knex, newSubject) {
        return knex('subjects')
            .insert({subject_name: newSubject})
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

    getBySubject(knex, subject){
        return knex.from('subjects').select('subject_id').where('subject_name', subject).first()
    }
}

module.exports = SubjectsService