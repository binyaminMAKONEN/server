const model = require('../models/model')
const bcrypt = require('bcrypt');


const create_Categories = async(req,res)=>{
    create = new model.categories({
        type:'Investment',
        color:'#FCBE44'
    })
 await   create.save(err =>{
        if(!err) return res.json(create);
        return res.status(400).json({message : `Error while creating categories ${err}`})
    })
}
const get_Categories = async(req,res)=>{
  let data = await  model.categories.find({})
  let dataFilter = await  data.map(v=>Object.assign({},{type:v.type,color:v.color}))
  return res.json(dataFilter)
}

const create_Transaction = async(req,res)=>{
    if(!req.body)return res.status(400).json('Post HTTP Data not Provided')
    create =await new model.transaction({
        type:req.body.type,
        name:req.body.name,
        username:req.body.username,
        amount:req.body.amount,

        date:new Date(),
    })
 await   create.save(err =>{
        if(!err) return res.json(create);
        return res.status(400).json({message : `Error while creating categories ${err}`})
    })
}

const get_Transaction = async(req,res)=>{
    let data = await  model.transaction.find({})
    return res.json(data)
  }

const delete_Transaction = async (req,res)=>{
  if(!req.body)return res.status(400).json('Request body not found ')
  await model.transaction.deleteOne(req.body,(err)=>{
    if(!err) return res.json(`Recover Deleted...!`)
  }).clone().catch(function(err){res.json('Error while deleting Transaction Record')})
} 

const get_Labels = async (req,res)=>{
  await  model.transaction.aggregate([
        {
            $lookup : {
                from: "categories",
                localField: 'type',
                foreignField: "type",
                as: "categories_info"
            }
        },
        {
            $unwind:{path:"$categories_info"} 
        }
    ]).then(result => {
        let data = result.map(v => Object.assign({}, { _id: v._id,username:v.username, name: v.name, type: v.type, amount: v.amount, color: v.categories_info['color']}));
       return res.json(data);
    }).catch(error => {
        res.status(400).json(`Looup Collection Error ${error}`);
    })
}

const create_User = async (req,res)=>{
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
        //create new user
        const newUser = new model.users({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });  
    
        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user._id);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
}
const login =async (req,res)=>{
 try {
    
    const user = await model.users.findOne({username:req.body.username});
    !user && res.status(400).json('Wrong username or password')
    
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    )
    !validPassword && res.status(400).json('Wrong username or password')

    res.status(200).json({_id:user._id,username:user.username})

  } catch (error) {
    res.status(500).json(error)
    
  }
}


module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels,
    create_User,
    login
}