const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.jh9c8vh.mongodb.net/?appName=Cluster0`;

app.use(cors());
app.use(express.json());

// MongoDB client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect client to DB
        await client.connect();

        // Create DB
        const db = client.db("pawMartDB");

        // Collections
        const listingsCollection = db.collection("listings");
        const ordersCollection = db.collection("orders");

        // ************ ALL APIs ************ //

        // -------------------------------------------- //
        // LISTINGS APIs
        // -------------------------------------------- //

        // POST — Add Listing
        app.post("/listings", async (req, res) => {
            const newListing = req.body;
            const result = await listingsCollection.insertOne(newListing);
            res.send(result);
        });

        // GET — All Listings
        app.get("/listings", async (req, res) => {
            const cursor = listingsCollection.find().sort({data:-1}).limit(6);
            const result=await cursor.toArray();
            res.send(result);
        });

        // GET — Listings by User Email (My Listings)
        app.get("/listings/user", async (req, res) => {
            const email = req.query.email;
            const result = await listingsCollection.find({ email }).toArray();
            res.send(result);
        });

        // GET — Listings by Category
        app.get("/listings/category/:category", async (req, res) => {
            const category = req.params.category;
            const result = await listingsCollection.find({ category }).toArray();
            res.send(result);
        });

        // GET — Listing by ID (it has to be at last)
        app.get("/listings/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await listingsCollection.findOne(query);
            res.send(result);
        });

        //update the liting by the id

    
app.patch("/listings/:id", async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const result = await listingsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
    );

    res.send(result);
});

//delete my list

// DELETE listing by ID
app.delete("/listings/:id", async (req, res) => {
    const id = req.params.id;

    const query = { _id: new ObjectId(id) };

    const result = await listingsCollection.deleteOne(query);

    res.send(result);
});



        // -------------------------------------------- //
        // ORDERS APIs
        // -------------------------------------------- //

        // POST — Add Order
        app.post("/orders", async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            res.send(result);
        });

        // GET — Orders by User Email (My Orders)
        app.get("/orders/user", async (req, res) => {
            const email = req.query.email;
            const result = await ordersCollection.find({ email }).toArray();
            res.send(result);
        });

        // -------------------------------------------- //

        // DB Ping
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. Connected to MongoDB!");

    } finally {
        // Keep connection open
    }
}
run().catch(console.dir);

// Root Route
app.get('/', (req, res) => {
    res.send('Hello World!')
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
