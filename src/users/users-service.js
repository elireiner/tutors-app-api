const UsersService = {
    getAllUsers(knex) {
        return knex
            .from('users')
            .select()
    },

    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('users').select('*').where('user_id', id).first()
    },

    getByEmail(knex, email) {
        return knex.from('users').select('user_id').where('email', email).first()
    },

    deleteUser(knex, id) {
        return knex('users')
            .where({  'user_id': id })
            .delete()
            .then()
    },

    deleteAllUsers(knex) {
        return knex('users')
            .delete()
            .then(res => {
                db.raw(`ALTER SEQUENCE users minvalue 0 START WITH 1`)
            })
    },

    updateUser(knex, id, newUserFields) {
        return knex('users')
            .where({ 'user_id': id  })
            .update(newUserFields)
    },
}

module.exports = UsersService