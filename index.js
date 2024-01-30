const mongoose =require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/user_management_system")

const express=require("express")

const app= express();

const noCache=require('nocache')

app.use(noCache())

//for user Routes
const userRoute=require('./routes/userRoute')



app.use('/',userRoute);


//for admin Routes
const adminRoute=require('./routes/adminRoute')

app.use('/admin',adminRoute);



const port=5000
app.listen(port,()=>console.log(`server is running on port:${port}`))