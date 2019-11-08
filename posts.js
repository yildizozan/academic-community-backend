const tokenizer = require("jsonwebtoken");

const pool = require("./db");

async function getPosts(request, response) {
  const query = `SELECT t.* FROM public.posts t ORDER BY create_at DESC LIMIT 12`;

  const values = [];

  pool
    .query(query, values)
    .then(res => {
      return response.json({ success: true, data: res.rows });
    })
    .catch(err => {
      return response.json({ success: false, err: err.toString() });
    });
}

async function getPost(request, response) {
  return response.json({ success: false, data: "" });
}

async function createPost(request, response) {
  // console.log(request.body);
  const { image, title, content } = request.body;

  console.debug(request.body);

  // console.assert(0 < image.length, "image");
  // console.assert(0 < title.length, "title");
  // console.assert(0 < content.length, "content");

  if (!image || !title || !content) {
    return response.status(400).json({ success: false, message: "Empty field(s)!" });
  }

  // Token parse
  let user = null;
  try {
    console.assert(request.headers.authorization !== "", "Bearer token");
    const token = request.headers.authorization.split(" ")[1];
    user = tokenizer.verify(token, "secret");
  } catch (err) {
    return response.status(400).json({ success: false, message: "Invalid token!", err: err.toString() });
  }

  const query = `INSERT INTO public.posts (author_id, image, title, content) VALUES ($1, $2, $3, $4) RETURNING id`;
  const values = [user.id, image, title, content];

  pool
    .query(query, values)
    .then(res => {
      const uuid = res.rows[0].id;

      const innerQuery = `SELECT t.* FROM public.posts t WHERE id = $1`;
      const innerValues = [uuid];

      pool
        .query(innerQuery, innerValues)
        .then(res => {
          return response.json({ success: true, data: res.rows[0] });
        })
        .catch(err => {
          return response.json({ success: false, err: err.toString() });
        });
    })
    .catch(err => {
      return response.json({ success: false, err: err.toString() });
    });
}

async function updatePost(request, response) {
  return response.json({ success: false, data: "" });
}

async function deletePost(request, response) {
  return response.json({ success: false, data: "" });
}

module.exports.getPosts = getPosts;
module.exports.getPost = getPost;
module.exports.createPost = createPost;
module.exports.updatePost = updatePost;
module.exports.deletePost = deletePost;
