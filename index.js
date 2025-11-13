const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

// fN5nJSlPuhbTzQZu
// TheBookHeaven
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("The Book Heaven Server Running");
});

async function run() {
  try {
    await client.connect();

    const database = client.db("bookDB");
    const bookCollection = database.collection("books");

    //Get all books
    app.get("/books", async (req, res) => {
      console.log(req.query);
      const query = {};
      if (req.query.userEmail) query.userEmail = req.query.userEmail;
      if (req.query.genre) query.genre = req.query.genre;
      if (req.query.genre) query.genre = req.query.genre;
      console.log(query);

      const sortQuery = {};
      if (req.query.sort == "asc") sortQuery.rating = 1;
      if (req.query.sort == "dsc") sortQuery.rating = -1;

      const cursor = bookCollection.find(query).sort(sortQuery);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Get latest 6 books
    app.get("/books/latest", async (req, res) => {
      const cursor = bookCollection.find({}).sort({ _id: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Get a single book
    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookCollection.findOne(query);
      res.send(result);
    });

    // Single Book insert
    app.post("/books", async (req, res) => {
      const newBook = req.body;
      const result = await bookCollection.insertOne(newBook);
      res.send(result);
    });

    // single uook update
    app.patch("/books/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBook = req.body;
      const query = {
        _id: new ObjectId(id),
      };
      const update = { $set: updatedBook };
      const option = {};
      const result = await bookCollection.updateOne(query, update, option);
      res.send(result);
    });

    // single book delete
    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    });

    // app.get("/books", async (req, res) => {
    //     const
    // });

    await client.db("admin").command({ ping: 1 });
    console.log("Your deployment successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`The Book Heaven Server Listening on port ${port}`);
});
