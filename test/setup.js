process.env.NODE_ENV = 'test'
process.env.TZ = 'UTC'

require('dotenv').config()

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || "postgresql://dunder_mifflin@localhost/tutors_app_test"
  
const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;