const crypto = require('crypto');
const express = require("express");
const PORT = process.env.PORT || 40404;
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyparser.json());

const secrets = {};

app.get("/secret/:id", (req, res) => {
  const id = req.params.id;

  if (secrets[id]) {
    res.send(secrets[id]);
    //check if we should delete
    if (secrets[id].timeout === 0) {
      delete secrets[id];
    }
  } else {
    res.status(404);
    res.send({ error: "not found" });
  }
});

app.post("/secret", (req, res) => {
  const { secret, option } = req.body;
  //generate unique id
  let id;
  do {
    id = generateId()
  } while (secrets[id]);

  let timeout = 0;
  //arrange delete
  if (option === "30 Minutes") {
    timeout = 1000 * 60 * 30;
    setTimeout(() => {
      delete secrets[id];
    }, timeout);
  }
  //write secret to memory
  secrets[id] = { secret, timeout };

  res.send(
    JSON.stringify({
      url: req.protocol + "://" + req.get("host") + `/secret/${id}`,
      timeout: timeout
    })
  );
});

// Generate a cryptographically-secure random ID in 'URL and filename safe' Base 64
// https://tools.ietf.org/html/rfc4648#section-5
function generateId() {
    return crypto.randomBytes(6).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
