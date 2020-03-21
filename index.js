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
    id = Math.random()
      .toString(36)
      .substring(7);
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

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
