const { Client } = require("pg");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "Yuvaraj123@",
  database: "postgres",
});

client.connect();
app.get("/", (re, res) => {
  return res.json("From Backend Sihgde");
});

app.get("/customer", (req, res) => {
  const sql = "SELECT * FROM customer";

  client.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
