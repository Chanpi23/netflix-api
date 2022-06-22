const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const PORT = 8000;

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = 'sample_nflix',
collection;

MongoClient.connect(dbConnectionStr).then((client) => {
  console.log("Connected to database");
  db = client.db(dbName);
  collection = db.collection("movies");
});

app.use(express.urlencoded)({ extended: true });
app.use(express.json());
app.use(cors());

app.use("/search", async (request, response)  => {
  try {
    let results = await collection.aggregate([
      {
        "$Search": {
          " autocomplete": {
            "query":`${request.query.query}`,
            "path": "title",
            "fuzzy": {
                "maxEdits":2,
                "prefixLength":3
            }
          },
        },
      },
    ]).toArray()
  } catch {}
});

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running ");
});
