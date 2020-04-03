const mongoose=require('mongoose');


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
         type:String,
         required:true

    },
    name: {
        type: String,
        required:true
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
        
    }]

},{
    timestamps:true
});




  

const user=mongoose.model('user',userSchema);

module.exports=user;