const express = require('express');
const cors=require('cors');
const app = express()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 

require('dotenv').config() 
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.jh9c8vh.mongodb.net/?appName=Cluster0`;


app.use(cors());
app.use(express.json());

//mongodb user and password
//  user:petdb
//pass:fBaPuu5dTwkdR64a

//create the mongodb client 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create the database

   const db = client.db("pawMartDB");

   //in this database make two collection one for listing and another for the order

const listingsCollection = db.collection("listings");
const ordersCollection = db.collection("orders");

//************add all the API here *********************//

//post API for the listing

app.post("/listings", async (req, res) => {
    const newListing = req.body;
    const result = await listingsCollection.insertOne(newListing);
    res.send(result);
});

//get all the listings 

app.get("/listings", async (req, res) => {
    const result = await listingsCollection.find().toArray();
    res.send(result);
});

// get the listing by the id

app.get("/listings/:id", async (req, res) => {
    const id = req.params.id;
    const query={ _id: new ObjectId(id) };
    const result = await listingsCollection.findOne(query);
    res.send(result);
});

//post API for the order

app.post("/orders", async (req, res) => {
    const newOrder = req.body;
    const result = await ordersCollection.insertOne(newOrder);
    res.send(result);
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
