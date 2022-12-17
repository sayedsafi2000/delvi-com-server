const express = require("express");
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middleware
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Delvi.com")
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dywromh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db("delvicom").collection("services");
        const productsCollection = client.db("delvicom").collection("products");
        const usersCollection = client.db("delvicom").collection("users");

        app.get("/category", async (req, res) => {
            const query = {}
            const result = await serviceCollection.find(query).toArray();
            res.send(result)
        });
        app.get("/categories/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const categories = await serviceCollection.findOne(query);
            res.send(categories);
        });
        app.get("/products", async (req, res) => {
            const categoryName = req.query.category;
            const query = { category: categoryName };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });
        app.get("/category/:category", async (req, res) => {
            const category = req.params.category
            let query = { category };
            const cursor = productsCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });
        app.put("/users/:email", async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email };
            options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: user.name,
                    email: user.email,
                    userType: user.userType,
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        app.post("/category/allCategories", async (req, res) => {
            const query = req.body;
            const result = await productsCollection.insertOne(query);
            res.send(result)
        });
        // app.get("/service/:category", async (req, res) => {
        //     const category = req.params.category;
        //     const query = ({ category })
        //     const result = await serviceCollection.find(query).toArray();
        //     res.send(result)
        // });
        app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === "admin" });
        });
    }
    finally {
    }
}
run().catch(console.log)


app.listen(port, () => console.log(`Gadget-&-gears-running port ${port}`));