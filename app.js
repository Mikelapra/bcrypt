const express = require('express');
const jwt = require('jsonwebtoken'); 
const session = require('express-session');
const {router} = require("./routes/users.js")
const hashedSecret = require("./crypto/config.js")

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: hashedSecret,
      resave: false, 
      saveUninitialized: true, 
      cookie: { secure: false }, 
    })
  );

app.use("/", router)

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
  