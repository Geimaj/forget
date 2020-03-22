const crypto = require('crypto');
const express = require("express");
const PORT = process.env.PORT || 40404;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const secrets = {};

app.get("/secret/:id", (req, res) => {
  const id = req.params.id;

  if (secrets[id]) {
    //check if we should delete
    if (secrets[id].expiry < Date.now()) {
      delete secrets[id];
      res.status(404);
      res.send({ error: "not found" });
    } else {
      res.send(secrets[id]);
    }
  } else {
    res.status(404);
    res.send({ error: "not found" });
  }
});

app.post("/secret", (req, res) => {
  const { secret, expiry } = req.body;
  //generate unique id
  let id;
  do {
    id = generateId()
  } while (secrets[id]);

  }
  //write secret to memory
  secrets[id] = { secret, expiry };

  res.send(
    JSON.stringify({
      url: req.protocol + "://" + req.get("host") + `/secret/${id}`,
      expiry
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
