const knex = require('knex')
const app = require('../src/app')
const { expect } = require('chai')
const supertest = require('supertest');

describe('Tutors app', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => {
        knex.raw('TRUNCATE TABLE tutors_subjects, subjects, users, CASCADE')
    })

    afterEach('cleanup', () => {
        knex.raw('TRUNCATE TABLE tutors_subjects, subjects, users, CASCADE')
    })

    describe('GET api/users', () => {
        context('when the there are no users', () => {
            it('returns 200 and []', () => {
                return supertest()
                    .get('/api/users')
                    .set({ "Authorization": `Bearer ${process.env.API_TOKEN}`})
                    .expect(200, [])

            })
        })
    })

})