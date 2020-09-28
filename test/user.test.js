// const request = require('supertest');
const request=require('supertest');
const app = require('../app.js');

describe('All Validation Checks', () => {
    it("Should authorize the user", async function (){
        const output = await request(app)
            .get('/v1/user/checkFunc')
            .set('Authorization', 'Basic '+Buffer.from("Admin@gmail.com:Admin@1234").toString("base64"))
            .expect(200)
    });

    it("Should not authorize the user as no credentials", async function () {
        const output = await request(app)
            .get('/v1/user/checkFunc')
            .set('Authorization', 'Basic '+Buffer.from(":").toString("base64"))
            .expect(401)   
    });

    it("Should not authorize the user as no password ", async function (){
        const output = await request(app)
            .get('/v1/user/checkFunc')
            .set('Authorization', 'Basic '+Buffer.from("Admin@gmail.com:").toString("base64"))
            .expect(401) 
    });

    it("Should not authorize the user as no username", async function () {
        const output = await request(app)
            .get('/v1/user/checkFunc')
            .set('Authorization', 'Basic '+Buffer.from(":Admin@1234").toString("base64"))
            .expect(401) 
    });

    it("Should not authorize the user as invalid username", async function () {
        const output = await request(app)
            .get('/v1/user/checkFunc')
            .set('Authorization', 'Basic '+Buffer.from("Adminrandom:Admin@1234").toString("base64"))
            .expect(401) 
    });
});

describe('Hashing Check', ()=>{
    it('Should generate password hash', async function (){
        let user = {
            first_name: "Admin",
            last_name: "Admin",
            email_address: "Admin@gmail.com",
            password: "Admin@1234"
        }
        const  output = await request(app)
            .post('/v1/user/checkHashFunction')
            .send(user)
            .set('Accept','application/json')
            .expect(201)
    })
});


describe('Valid User Details Check',()=>{
    it("Should create a User", async function () {
        let user = {
            first_name: "Admin",
            last_name: "Admin",
            email_address: "Admin@gmail.com",
            password: "Admin@1234"
        }
        let outp = await request(app)
            .post('/v1/user/testUserCreate')
            .send(user)
            .set('Accept','application/json')
            .expect(201);
          
    });

    it("Should not create a User as not all details provided", async function () {
        let user = {
            first_name: "Admin",
            last_name: "Admin",
            password: "Admin@1234"
        }
        let outp = await request(app)
            .post('/v1/user/testUserCreate')
            .send(user)
            .set('Accept','application/json')
            .expect(400);
    });

});
