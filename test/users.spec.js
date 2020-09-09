const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest');
const { cleanTables } = require('./test-helpers')

describe('Tutors app', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    //before('cleanup', () => cleanTables(db))

    //afterEach('cleanup', () => cleanTables(db))
 

    describe('GET api/users', () => {
            it('returns 200', () => {
                return supertest(app)
                    .get('/api/users')
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}` })
                    .expect(200)
            })
    })

    describe('POST api/users', () => {
        context('When the email does not exist yet', () => {
            it('responds with 201', () => {
                const testUsers = {
                    first_name: "Eli",
                    last_name: "Reiner",
                    email: "goelyukim@g.com",
                    user_password: "plplplplokokok",
                    online_medium: true,
                    in_person: false,
                    student: false,
                    tutor: true,
                    gender: "male",
                    rating: null,
                    fee: 9,
                    subjects: []
                }

                return supertest(app)
                    .post('/api/users')
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}` })
                    .send(testUsers)
                    .expect(201)
            })
        })

        context('Given invalid fields it returns 400 and an error', () => {
            it('responds with 400', () => {
                const invalidTestUsers = {
                    name: "Eli"
                }

                return supertest(app)
                    .post('/api/users')
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}` })
                    .send(invalidTestUsers)
                    .expect(400)
            })
        })
    })

    describe('GET api/users/:user_id', () => {
        context('When there is a user in the db', () => {
            it('returns 200 and a user', () => {
                return supertest(app)
                    .get('/api/users/1')
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}` })
                    .expect(200)
            })
        })
    })

    describe('DELETE api/users/:user_id', () => {
        context('When there is a user in the db', () => {
            it('returns 204', () => {
                return supertest(app)
                    .delete('/api/users/1')
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}` })
                    .expect(204)
            })
        })
    })

    describe('PATCH api/users/:user_id', () => {

    })

})