require('dotenv').config();

const serverless = require("serverless-http");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const db = require("./db");
const isAuthenticated = require("./authorization");
const misc = require("./misc");
const { login, register } = require("./auth");
const { getPosts, getPost, createPost, updatePost, deletePost } = require("./posts");

const app = express();

app.use(cors());
app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/api/health", function(req, res) {
  res.json({ status: "working", version: "1.0.0" });
});

/** AUTH */
app.post("/api/login", login);
app.post("/api/register", register);

/** POSTS */
app.get("/api/posts", getPosts);
app.post("/api/posts/:post", isAuthenticated, getPost);
app.put("/api/posts", isAuthenticated, createPost);
app.patch("/api/posts/:post", isAuthenticated, updatePost);
app.delete("/apiposts/:post", isAuthenticated, deletePost);

app.get("/api/user/:id", isAuthenticated, function(req, res, next) {
  res.send("User Info");
});

app.get("/api/symbols", (request, response) => {
  const query = "SELECT id, image, content FROM public.symbols order by random() limit 8;";
  const values = [];

  db.query(query, values)
    .then(res => {
      return response.json({ success: true, data: res.rows });
    })
    .catch(err => {
      return response.status(500).json({ success: false, err: err.stack });
    });
});

app.post("/api/symbols", isAuthenticated, (request, response) => {
  const { p } = request.query;

  let page = 0;

  if (0 < p) {
    page = p;
  }

  const query = "SELECT * FROM public.symbols ORDER BY create_at DESC LIMIT 12 OFFSET 12 * $1";
  const values = [page];

  db.query(query, values)
    .then(res => {
      return response.json({ success: true, data: res.rows });
    })
    .catch(err => {
      return response.status(500).json({ success: false, err: err.stack });
    });
});

app.patch("/api/symbols/:id", isAuthenticated, (request, response) => {
  const { id } = request.params;
  const { start_date, end_date, content } = request.body;

  // Check empty fields
  if (!id || !start_date || !end_date || !content) {
    return response.status(400).json({ success: false, message: "Some fields are empty!" });
  }

  if (!misc.isValidUUID(id)) {
    response.status(400).json({ success: false, message: "Not valid id!" });
  }

  if (content.length === 0) {
    return response.status(400).json({ success: false, message: "Empty content!" });
  }

  const query = `UPDATE public.symbols SET start_date = $1, end_date = $2, content = $3 WHERE id = $4`;
  const values = [start_date, end_date, content, id];

  db.query(query, values)
    .then(res => {
      return response.json({ success: true });
    })
    .catch(err => {
      return response.status(500).json({ success: false, err: err.stack });
    });
});

app.delete("/api/symbols/:id", isAuthenticated, (request, response) => {
  const { id } = request.params;

  // Check empty fields
  if (!id) {
    return response.status(400).json({ success: false, message: "Some fields are empty!" });
  }

  if (!misc.isValidUUID(id)) {
    return response.status(400).json({ success: false, message: "Not valid id!" });
  }

  const query = `DELETE FROM public.symbols WHERE id = $1`;
  const values = [id];

  db.query(query, values)
    .then(res => {
      if (0 < res.rowCount) {
        return response.json({ success: true });
      }

      return response.status(400).json({ success: false, message: "Not found!" });
    })
    .catch(err => {
      return response.status(500).json({ success: false, err: err.stack });
    });
});

module.exports = app;
module.exports.handler = serverless(app);
