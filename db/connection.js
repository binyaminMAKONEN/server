const mongoose = require('mongoose')

const connect = mongoose.connect(process.env.ATLAS_URI).then(db=>{
    console.log('Database Connected')
    return db
}).catch(err =>{
    console.log('Database Error: ' + err);
})

module.exports= connect