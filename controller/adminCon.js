const User=require('../model/userModel')

const bcrypt=require('bcrypt')

const randomstring=require('randomstring')

const config=require('../config/config')

// for secure password
const securePassword=async(password)=>{
    try {

       const passwordHash =await bcrypt.hash(password, 10)
       return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
  }
//admin login page
const loadLogin=async(req,res)=>{
    try {
        res.render('login')

    } catch (error) {
        console.log(error.message);
    }
}
//admin data post
const verifyLogin=async(req,res)=>{
    try {
       
        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email:email})
          
         if (userData) {
            
            const passwordMatch=  await  bcrypt.compare(password,userData.password)
            if (passwordMatch) {
                
                if (userData.is_admin===0) {
                    res.render('login',{message:"email and password incorrect"})
                } else {
                   req.session.admin_id=userData._id 
                   res.redirect('/admin/home')
                }

            } else {
                res.render('login',{message:"email and password incorrect"})
            } 

         } else {
            res.render('login',{message:"email and password incorrect"})
         }


    } catch (error) {
        console.log(error.message);
    }
}
//load home
const loadDashboard=async(req,res)=>{
    try {
            const userData=  await User.findById({_id:req.session.admin_id});
            res.render('home',{admin:userData})

    } catch (error) {
        console.log(error.message);
    }
}
//logout
const  logout=async(req,res)=>{
    try {
        req.session.admin_id=null;
        //   req.session.destroy();
          res.redirect('/admin/home')        
    } catch (error) {
        console.log(error.message);
    }
}

const adminDasboard=async(req,res)=>{
    try {

        var search=''
        if(req.query.Search){
            search=req.query.Search
        }
      
        const usersData= await User.find({
            is_admin:0,
             $or:[
                    { name: {$regex:'.*'+search+'.*',$options:'i'} },
                    { email: {$regex:'.*'+search+'.*',$options:'i'} },
                    { mobile: {$regex:'.*'+search+'.*',$options:'i'} }
                ]
        })
        if(req.session.updateError)
 {
            var msg="the email id is exsisting please provide another mail"
            req.session.updateError=false
        }
         
      res.render('dashboard',{users:usersData,msg})

    } catch (error) {
        console.log(error.message);
    }
} 

// add new user by admin

const newUserLoad=async(req,res)=>{
    try {
        res.render('new-user')
    } catch (error) {
        console.log(error.message);
    }
}
//add user post method
const addUser=async(req,res)=>{
    try {

        const name=req.body.name
        const email=req.body.email
        const mobile=req.body.mobile
        const image=req.file.filename
        const password=req.body.password

        const spassword=await securePassword(password)

        const user=new User({
            name:name,
            email:email,
            mobile:mobile,
            image:image,
            password: spassword,
            is_admin:0
        })

        const userData=await user.save()

        if(userData)
        {
            res.redirect("/admin/dashboard")

        }
        else
        {
            res.render("/new_user",{message:"Something wrong"})

        }
        
    } catch (error) {
        console.log(error.message)
    }
}

  
//edit user 
const editUserLoad=async(req,res)=>{
    try {
        const id=req.query.id;
       const userData=await User.findById({_id:id})
       if(userData){
        res.render('edit-user',{user:userData})
       }else{
        res.redirect('/admin/dashboard')
       }
       
    } catch (error) {
        console.log(error.message);
    }
}
//update user 

const updateUser=async(req,res)=>{
    try {
        const email=req.body.email
        const exsistingUser=await User.findOne({email:email})

        if(exsistingUser){
          console.log('enterd here');
          req.session.updateError=true
           res.redirect('/admin/dashboard')
        }
     //  else{
        const userData=  await User.findByIdAndUpdate({_id:req.body.id},
            {$set:
            
                { name:req.body.name,
                    email:req.body.email,
                    mobile:req.body.mobile,
                    is_varified:req.body.verify
                } 
            })
            console.log('enterd here too');

      
        res.redirect('/admin/dashboard')
       //}
          
         
        } catch (error) {
        console.log(error.message);
    }
}


  



//delete user

const deleteUser=async(req,res)=>{
    try {
        const id=req.query.id;
          await User.deleteOne({ _id:id })
          res.redirect('/admin/dashboard')
        } catch (error) {
        console.log(error.message);
    }
}

  
module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDasboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUser,
    deleteUser
   
}