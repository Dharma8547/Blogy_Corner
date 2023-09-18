var express=require('express')
const router=express.Router()
var bcryptjs=require('bcryptjs')
var userdetailsmodel=require('../model/user.js')
var subscribedetailsmodel=require('../model/subscriber.js')
var blogdetails=require('../model/blog.js')



// router.get('/email',async(req,res)=>
// {
//     try{
//     const data=await userdetailsmodel.find({ _id: id });
//     if(data)
//     {
//         res.status(200).json(data);
//     }
//     else
//     {
//         //console.log('couldnt able to fetch the data')
//         return res.status(404).json({message: "No Data Found."})
//     }
//     }
//     catch(err)
//     {
//         if(err)
//         {
//             console.log('Error',err)
//         }
//     }
// })


router.get('/:id',async(req,res)=>
{
    try{
    const data=await userdetailsmodel.find({ _id: id });
    if(data)
    {
        res.status(200).json(data);
    }
    else
    {
        //console.log('couldnt able to fetch the data')
        return res.status(404).json({message: "No Data Found."})
    }
    }
    catch(err)
    {
        if(err)
        {
            console.log('Error',err)
        }
    }
})

router.post('/subscribe',async(req,res)=>
{

    const {email}=req.body;
    let login;
    try{
        login=await subscribedetailsmodel.findOne({email});
    }
    catch(err)
    {
        console.log('Error',err);
    }
    if(login)
    {
        return res.redirect('/index.html?message=Subscriber already found');
    }
    const data=new subscribedetailsmodel({email:email})

    data.save().then(responses=>
        {
            //res.json(responses)
            return res.redirect('/index.html?message=Successfully%20registered');
        }).catch(err=>
        {
            if(err)
            {
                console.log('Error',err);
            }
        })
})

router.post('/sign_up',async(req,res)=>
{
    const {name,email,password}=req.body;
    let login;
    try{
        login=await userdetailsmodel.findOne({email});
        }
        catch(err)
            {
                if(err)
                {
                    console.log('Error',err)
                }
            }
        if(login)
        {
            return res.redirect(`/register.html?User already exists, please login!`);
        }
        const salt = bcryptjs.genSaltSync(10);
        const hashedpassword=bcryptjs.hashSync(password,salt);
        const user=new userdetailsmodel({
            name,email,password:hashedpassword,blogs:[]
        });
        user.save().then(responses=>
            {
                //res.json(responses);
               return res.redirect('/login.html');
            }).catch(err=>
                {
                    if(err)
                    {
                        console.log('Error',err);
                    }
                })
})

router.post('/login',async(req,res)=>
{
    const {email,password}=req.body;
    let data;
    try{
        data=await userdetailsmodel.findOne({email});
    }
    catch(err)
    {
        console.log('Error',err);
    }
    if(!data)
    {
        return res.redirect(`/login.html?User Not Exists, please register!`);
    }
    const newpassword=bcryptjs.compareSync(password,data.password);
    if(!newpassword)
    {
        return res.status(400).json({message: 'Incorrect password'});
    }
    //return res.status(200).json({id:data._id})
    //console.log('id',id);
    // return res.redirect(`/user.html?email=${email}&id=${data._id}`)
    
     const user=data._id;
    let blogs;
    try{
        blogs=await blogdetails.find({user});
    }
    catch(err)
    {
        return console.log('Error',err)
    }
    if(!blogs)
    {
        return res.status(404).json({message: "No Blog currently!"})
    }
    res.render('index', {blogs,user});
    //return res.status(200).json({blogs:blogs});  
})

router.post("/logout",(req,res)=>{
    return res.redirect('/index.html')
})

router.delete('/:id',async(req,res)=>
{
    var id=req.params.id;
    let users;
    try{
        users=await userdetailsmodel.findByIdAndDelete(id);
    }
    catch(err)
    {
        console.log('Error',err)
    }
    if(!users)
    {
        return res.status(404).json({message: 'Not able to delete'})
    }
    return res.status(200).json({message: 'Successfully deleted'});
})


module.exports=router