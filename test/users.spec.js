const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest');
const { makeUsersArray, makeMaliciousUser } = require('./users.fixtures')

describe('Tutors app', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    // ! they aren't working
    
    after('disconnect from db', () => db.destroy())

    before('clean the table', () => {
        knex.raw('TRUNCATE tutors_subjects, subjects, users')
    })

    afterEach('cleanup', () => {
        knex.raw('TRUNCATE tutors_subjects, subjects, users')
    })

    describe('GET api/users', () => {
        context('when the there are no users', () => {
            it('returns 200 and []', () => {
                return supertest(app)
                    .get('/api/users')
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}` })
                    .expect(200, [])

            })
        })

        context('When there are users in the db', () => {
            const testUsers = makeUsersArray();

            beforeEach('insert users in table', () => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it('returns expected users', () => {
                return supertest(app)
                    .get(`/api/users`)
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}` })
                    .expect(200)
                    .expect(res => {
                        console.log(res.body.email)
                        expect(res.body[0].email).to.eql(testUsers[0].email)
                        expect(res.body[0].tutor).to.eql(testUsers[0].tutor)
                    })
            })

        })

        context('Given an xxs attack', () => {
            const { maliciousUser, expectedUser } = makeMaliciousUser()
            beforeEach('insert users in table', () => {
                return db
                    .into('users')
                    .insert(maliciousUser)
            })

            it('returns a sanitized user', () => {

                return supertest(app)
                    .get(`/api/users`)
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}` })
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].email).to.eql(expectedUser.email)
                        expect(res.body[0].gender).to.eql(expectedUser.gender)
                    })
            })
        })
    })

})