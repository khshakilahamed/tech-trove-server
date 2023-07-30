require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lujialn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const database = client.db("tech-trove");
    const productCollection = database.collection("products");

    app.get("/products", async (req, res) => {
      const category = req.query.category;
      if (req.query.category) {
        const products = await productCollection
          .find({ category: category })
          .toArray();
        return res.send({ message: "success", status: 200, data: products });
      }

      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ message: "success", status: 200, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send({ message: "success", status: 200, data: result });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: ObjectId(id) });
      // console.log(result);
      res.send({ message: "success", status: 200, data: result });
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send({ message: "success", status: 200, data: result });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello PC Builder!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
