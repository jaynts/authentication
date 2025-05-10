const express=require('express');
const bcrypt=require('bcrypt');
const bodyParser=require('body-parser');
const users=require('./users');
const jwt=require('jsonwebtoken');

const app= express();

const secretKey='your-secret-key'

app.use(bodyParser.json());

app.post('/register', async(req,res)=>{
    const {username,passowrd}=req.body;

    const userExists=users.find(u=>u.username===username);

    if(userExists){
        
    }
})