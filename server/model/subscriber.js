var mongoose=require('mongoose')

const subscribedetailsSchema=new mongoose.Schema({
    email:
    {
        type:String,
        required:true,
        unique:true
    }
},{collection:'Subscriber'})

module.exports=mongoose.model('Subscriber',subscribedetailsSchema);