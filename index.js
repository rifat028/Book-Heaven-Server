const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

// fN5nJSlPuhbTzQZu
// TheBookHeaven
const uri =
  "mongodb+srv://TheBookHeaven:fN5nJSlPuhbTzQZu@module54.p4tcocf.mongodb.net/?appName=Module54";

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

    // Single Book insert
    app.post("/books", async (req, res) => {
      const newBook = req.body;
      const result = await bookCollection.insertOne(newBook);
      res.send(result);
    });

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
