const express = require("express");
const PORT = process.env.PORT || 40404;
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyparser.json());

const secrets = {};

app.get("/secret/:id", (req, res) => {
  res.send("finding secret: " + req.params.id);
  const id = req.params.id;

  if (secrets[id]) {
    res.send(secrets[id]);
    //check if we should delete
    if (secrets[id].timeout === 0) {
      delete secrets[id];
    }
  }
});

app.post("/secret", (req, res) => {
  const { secret, option } = req.body;

  //generate unique id
  let id;
  do {
    id = Math.random()
      .toString(36)
      .substring(7);
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

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
