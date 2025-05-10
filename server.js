const express=require('express');
const bcrypt=require('bcryptjs');
const bodyParser=require('body-parser');
const users=require('./users');
const jwt=require('jsonwebtoken');

const app= express();

const secretKey='your-secret-key'

app.use(bodyParser.json());


//register
app.post('/register', async(req,res)=>{
    const {username,password}=req.body;
    console.log(req.body)

    const userExists=users.find(u=>u.username===username);

    if(userExists){
        return res.status(400).json({message:"User already exists"})
    }

    const hashedPass=await bcrypt.hash(password,10);
    users.push({username, password:hashedPass})
    console.log(users);

    res.status(201).json({message:"User registered successfully"})
});

//login
app.post('/login', async(req,res)=>{
    const {username,password}=req.body;

    const user = users.find(u=>u.username===username);

    if(!user){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const isMatch= await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"})
    }

    const token= jwt.sign({username}, secretKey, {expiresIn:'1h'});
    console.log(token);
    res.json({token})
});

//middleware to authenticate
function authenticateToken(req,res,next){
    const authHeader=req.headers['authorization'];
    console.log(authHeader);

    const token=authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err,user)=>{
        if(err)return res.sendStatus(403);
        req.user=user;
        next();
    })

}

app.get('/profile', authenticateToken, (req,res)=>{
    res.json({message:`welcome user ${req.user.username}`});
})

const port=3000;
app.listen(port, ()=>console.log(`Server running on http://localhost:${port}`))