const tokenizer = require("jsonwebtoken");

const db = require("./db");

function register(request, response) {
  console.debug(request.body);
  const { email, password } = request.body;

  if (!email && !password) {
    return response.json({ success: false, err: "Eksik bilgi var!" });
  }

  const query =
    "INSERT INTO public.users (email, password) VALUES (lower($1), crypt($2, gen_salt('bf', 14))) RETURNING id";
  const values = [email, password];

  db.query(query, values)
    .then(res => {
      const data = res.rows[0].id;
      return response.json({ success: true, data });
    })
    .catch(err => response.json({ success: false, err }));
}

async function login(request, response) {
  console.debug(request.body);
  const { email, password } = request.body;

  const query =
    "SELECT id, email, is_admin, create_at FROM users WHERE email = lower($1) AND password = crypt($2, password)";
  const values = [email, password];

  db.query(query, values)
    .then(res => {
      if (res.rows.length === 0) {
        return response.json({ success: false });
      }

      const data = tokenizer.sign({ ...res.rows[0] }, "secret");

      return response.json({ success: true, data });
    })
    .catch(err => {
      return response.json({ success: false, err });
    });
}

module.exports.login = login;
module.exports.register = register;
