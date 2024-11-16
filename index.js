const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "alya"
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
  } else {
    console.log("Connecté à la base de données MySQL");
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

function hashPassword(password) {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const hashed = hash.digest("hex");
  return hashed;
}

app.post("/register", (req, res) => {
  const { email, password, firstname, lastname, gender } = req.body;

  if (!email || !password || !firstname || !lastname || !gender) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const hashedPassword = hashPassword(password);

  const query = "INSERT INTO User (email, password, first_name, last_name, gender, status) VALUES (?, ?, ?, ?, ?, 'active')";

  db.query(query, [email, hashedPassword, firstname, lastname, gender], (err, result) => {
    if (err) {
      console.error("Erreur lors de l\"insertion dans la base de données:", err);
      return res.status(500).json({ message: "Erreur serveur lors de l\"enregistrement des données." });
    }

    res.status(200).json({ message: "Compte créé avec succès" });
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log("Serveur app écoutant sur le port " + port);
});