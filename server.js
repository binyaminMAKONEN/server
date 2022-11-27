const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config({path:'./config.env'})
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const connect =require('./db/connection')

app.use(require('./routes/route'))

connect.then(db =>{
    if(!db)return process.exit(1)
    app.listen(port, () => {
        console.log(`Server is running on port: http://localhost:${port}`)
    })
    app.on('error',err => console.log(`Failed To Connect wite HTTP Server:${err}`))
}).catch(error =>{
    console.log(`connection Failed ${error}`);
}) 