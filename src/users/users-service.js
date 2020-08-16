const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('users')
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
    },

    deleteAllUsers(knex) {
        return knex('users')
            .delete()
    },

    updateUser(knex, id, newUserFields) {
        return knex('users')
            .where({ 'user_id': id  })
            .update(newUserFields)
    },
}

module.exports = UsersService