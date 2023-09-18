var express=require('express')
const router=express.Router()
var mongoose=require('mongoose')
var blogdetailsmodel=require('../model/blog.js')
var userdetailsmodel=require('../model/user.js')

router.get('/',async(req,res)=>
{
    let blogs;
    try{
        blogs=await blogdetailsmodel.find();
    }
    catch(err)
    {
        return console.log('Error',err)
    }
    if(!blogs)
    {
        return res.status(404).json({message: "No Blogs currently!"})
    }
    return res.status(200).json({blogs})
})

router.post('/',async(req,res)=>
{
    const {title,description,image,user}=req.body;
    let check;
    try{
        check=await userdetailsmodel.findById(user);
    }
    catch(err)
    {
        return console.log('Error',err);
    }
    if(!check)
    {
        return res.status(400).json({message: "Unable to find the user"});
    }
    var blogData={
        title,description,image,user
    }
    
    const blog=await new blogdetailsmodel(blogData);

    try{
        // const session=await mongoose.startSession();
        // session.startTransaction();
        // await blog.save({session});
        // check.blogs.push(blog);
        // await check.save({session});
        // await session.commitTransaction();
        // session.endSession();
        await blog.save();
        check.blogs.push(blog);
        await check.save();
        }
        catch(err){
            return console.log('Error',err)
        }
            
        return res.status(200).json({blog});
})


//router.put('/update/:id',async (req,res)=>  for updation
router.post('/update/:id',async (req,res)=>
{
    var id=req.params.id;
    //console.log('print',id);
    const {  title, description} = req.body;
    let blogs;
    let views;
    var data={
        title,description
    }
    try{
        blogs=await blogdetailsmodel.findByIdAndUpdate(id,data);
    }
    catch(err)
    {
        return res.status(404).json('Error',err)
    }
    if(!blogs)
    {
        return console.log('Error');
    }
    const value=blogs.user.toString();
    //console.log('print',value);
    //return res.status(200).json(blogs);
    let blogvalues;
    try{
        blogvalues=await blogdetailsmodel.find({user:value.toString()});
    }
    catch(err)
    {
        return console.log('Error',err)
    }
    if(!blogvalues)
    {
        return res.status(404).json({message: "No Blog currently!"})
    }
    res.render('index', {blogs:blogvalues,user:value});
    //res.status(200).json({blogvalues,value});

})

router.get('/:id',async(req,res)=>
{
    var id=req.params.id;
    let blogs;
    try{
        blogs=await blogdetailsmodel.findById(id);
    }
    catch(err)
    {
        return console.log('Error',err)
    }
    if(!blogs)
    {
        return res.status(404).json({message: "No Blog currently!"})
    }
    return res.status(200).json({blogs})
})

router.post('/add/:id',async(req,res)=>
{
    const {title,description,image}=req.body;
    const user=req.params.id;
    //console.log('print',user)
    let check;
    try{
        check=await userdetailsmodel.findById(user);
    }
    catch(err)
    {
        return console.log('Error',err);
    }
    if(!check)
    {
        return res.status(400).json({message: "Unable to find the user"});
    }

    let check1;
try {
    // Check if a document with the same title, description, and image exists
    check1 = await blogdetailsmodel.findOne({ title, description, image });
    if (check1) {
        // Document with the same title, description, and image already exists
        return res.redirect('/login.html');
    }
    } 
    catch (err)
    {
    return console.log('Error', err);
    }
    //if not there, adding into the database!
    var blogData={
        title,description,image,user
    }
    
    const blog=await new blogdetailsmodel(blogData);

    try{
        // const session=await mongoose.startSession();
        // session.startTransaction();
        // await blog.save({session});
        // check.blogs.push(blog);
        // await check.save({session});
        // await session.commitTransaction();
        // session.endSession();
        await blog.save();
        check.blogs.push(blog);
        await check.save();
    }catch(err)
            {
                return console.log('Error',err)
            }
            // return res.status(200).json({blog});
          //console.log(user);
    let blogs;
    try{
        blogs=await blogdetailsmodel.find({user});
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
})

// router.delete('/:id',async(req,res)=>
// {
//     var id=req.params.id;
//     let blog;
//     try{
//         blog=await blogdetailsmodel.findByIdAndRemove(id).populate("user");
//         await blog.user.blogs.pull(blog);
//         await blog.user.save();
//     }
//     catch(err)
//     {
//         console.log('Error',err)
//     }
//     if(!blog)
//     {
//         return res.status(500).json({message: 'Not able to delete'})
//     }
//     return res.status(200).json({message: 'Successfully deleted'});
// })

router.get('/delete/:id',async(req,res)=>
{
    var id=req.params.id;
    let blog;
    try{
        blog=await blogdetailsmodel.findByIdAndRemove(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }
    catch(err)
    {
        console.log('Error',err)
    }
    //return res.status(200).json({message: 'Successfully deleted'});
     // Check if a document with the same title, description, and image exists
     if(!blog)
    {
        return res.redirect(`/relogin`);
    }
    const value=blog.user._id;
    let blogs;
    try{
        blogs=await blogdetailsmodel.find({user:value});
    }
    catch(err)
    {
        return console.log('Error',err)
    }
    if(!blogs)
    {
        return res.status(404).json({message: "No Blog currently!"})
    }
    res.render('index', {blogs,user:blog.user._id});
})

router.get('/user/:id',async(req,res)=>
{
    var id=req.params.id;
    let userblogs;
    try{
        userblogs=await userdetailsmodel.findById(id).populate("blogs");

    }
    catch(err)
    {
        return console.log('Error',err)
    }
    if(!userblogs)
    {
        return res.status(404).json({message:"No Blog message"});
    }
    return res.status(200).json({blogs:userblogs});
})

module.exports=router