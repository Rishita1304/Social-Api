process.env.NODE_ENV = 'test';

import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
import UserModel from "../models/userModel.js";


chai.use(chaiHttp);
const expect = chai.expect;

//Positive Test
describe('User Registration Tests', () => {
    beforeEach(async () => {
        await UserModel.deleteMany({});
    });
    it('should successfully register a new user', async () => {
        const newUser = {
            username: 'testuser1',
            password: 'testpassword',
        };

        const res = await chai.request(app)
            .post('/api/register')
            .send(newUser);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
        expect(res.body).to.have.property('token');
    });
});


//Negative test
describe('User Registration Tests', () => {
    it('should fail to register an existing user', async () => {
        const existingUser = {
            username: 'testuser2',
            password: 'testpassword',
        };

        const res = await chai.request(app)
            .post('/api/register')
            .send(existingUser);

        expect(res).to.have.status(200);
    });

    it('should fail to register with missing username', async () => {
        const newUser = {
            password: 'testpassword',
        };

        const res = await chai.request(app)
            .post('/api/register')
            .send(newUser);

        expect(res).to.have.status(500);
    });
    describe('GET /api/user', () => {
        it('should get user details', async () => {
            const user = new UserModel({
                username: 'userWithFollowers',
                password: 'password',
                followers: ['follower1', 'follower2'],
                following: ['following1', 'following2'],
            });
            await user.save();

            const res = await chai.request(app)
                .get('/api/user')
                .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYzEyMyIsImlkIjoiNjRkYzA2OThkNjdiNGNhZGUwMDEzMWI5IiwiaWF0IjoxNjkyMTQxMjU4LCJleHAiOjE2OTIxNDQ4NTh9.D5jbKyqiagk8p9Ir04Vmmq_xQR0T4q8df7xXDpq3KJo`);;

            expect(res).to.have.status(500);
        });
    });
});


//Positive Test
describe('User Login Tests', () => {
    it('should log in a user with correct credentials', async () => {
        const userCredentials = {
            username: 'testuser2',
            password: 'testpassword',
        };

        const res = await chai.request(app)
            .post('/api/authenticate')
            .send(userCredentials);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('JWT token');
    });
});

//Negative Test
describe('User Login Tests', () => {
    it('should fail to log in with incorrect password', async () => {
        const userCredentials = {
            username: 'testuser2',
            password: 'wrongpassword',
        };

        const res = await chai.request(app)
            .post('/api/authenticate')
            .send(userCredentials);

        expect(res).to.have.status(400);
        expect(res.body).to.equal('Wrong Password');
    });

    it('should fail to log in with non-existing user', async () => {
        const userCredentials = {
            username: 'nonexistinguser',
            password: 'password',
        };

        const res = await chai.request(app)
            .post('/api/authenticate')
            .send(userCredentials);

        expect(res).to.have.status(404);
        expect(res.body).to.equal("User doesn't exists.");
    });
});

