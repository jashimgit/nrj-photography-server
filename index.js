const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient}  = require('mongodb');

var {ObjectId} = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uri = "mongodb+srv://nodemongo:modemongo@cluster0.vewnd.mongodb.net/nrjPhotography?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if(err) throw err;

  const orderCollection = client.db("nrjPhotography").collection("orders");
  const userCollection = client.db("nrjPhotography").collection("users");
  // perform actions on the collection object

  // create an admin
  app.post("/add-admin", (req,res) => {
    const userDetails = req.body;
    userCollection.insertOne(userDetails)
    .then((result) => {
      res.send(result.insertedId);
    })
    .catch(err => console.log(err))
  })

  // get all orders
  app.get("/orders", (req, res) => {
    orderCollection.find({})
      .toArray((err, doc) => {
        res.send(doc);
      });
  });

  // add order 
  app.post("/add-order", (req, res) => {
    const orderDetails = req.body;
    // console.log(orderDetails);
    orderCollection.insertOne(orderDetails)
      .then((result) => { 
        res.send(result.insertedId);
      })
      .catch(err => console.log('err :' , err))
  })

  // change service status 

   app.put('/change-status', (req, res) => {
    console.log(req.body);
    const status = req.body.status;
    const id = req.body._id;
    
      orderCollection.updateOne({_id: ObjectId(id)},{$set: {status: status}})
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
   })

  // client.close();

  app.get("/", (req, res) => {
    res.send('<h1>server is working</h1>');
  })
  
  
  
  app.listen(PORT, () => {
    console.log(`server is runnning on port ${PORT}`);
  });
})


