const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
var jwt = require('jsonwebtoken');
require('dotenv').config()
const port =process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.plsay.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("db connect");
  client.close();
});
async function run() {
    try {
      await client.connect();
      const blogsUser = client.db("Blogs").collection("user");

      app.put('/user/:email',async(req,res)=>{
          const email = req.params.email;
          const user = req.body;
          const filter = {email:email}
          const options = { upsert: true };
          const updateDoc = {
            $set: user,
          };

          const result = await blogsUser.insertOne(filter,updateDoc,options);
          const token = jwt.sign({ email:email }, process.env.JWT_TOKEN, 
            { expiresIn: '1h' }
          )

          res.send({result , token})
          
      })
     
    } finally {
    
    }
  }
  run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Blogs server");
  });
app.listen(port,()=>{
    console.log(`blog server running ${port}`);
})

