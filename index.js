const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = "}bA29.QgXN#$8gh=7K4f";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "alya"
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error("Erreur lors de la connexion à la base de données:", err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Connecté à la base de données MySQL");
    }
  });

  db.on("error", (err) => {
    console.error("Erreur de base de données:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Connexion à la base de données perdue. Reconnexion...");
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

function hashPassword(password) {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const hashed = hash.digest("hex");
  return hashed;
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
}

app.post("/check-email", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "L'email est requis." });
  }

  const query = "SELECT * FROM user WHERE email = ?";
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Erreur lors de la vérification de l'email:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.length > 0) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  });
});

app.post("/register", (req, res) => {
  const { email, password, firstname, lastname, gender } = req.body;

  if (!email || !password || !firstname || !lastname || !gender) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const hashedPassword = hashPassword(password);

  const query = "INSERT INTO user (email, password, first_name, last_name, gender, status) VALUES (?, ?, ?, ?, ?, 'active')";

  db.query(query, [email, hashedPassword, firstname, lastname, gender], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion dans la base de données:", err);
      return res.status(500).json({ message: "Erreur serveur lors de l'enregistrement des données." });
    }

    const user = {
      id: result.insertId,
      email: email
    };

    const token = generateToken(user);
    res.status(200).json({ message: "Compte créé avec succès", token: token });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  const hashedPassword = hashPassword(password);

  const query = "SELECT * FROM user WHERE email = ? AND password = ?";
  
  db.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error("Erreur lors de la vérification de l'utilisateur:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.length > 0) {
      const user = results[0];
      const token = generateToken(user);
      return res.status(200).json({ success: true, token: token });
    } else {
      return res.status(400).json({ success: false, message: "Email ou mot de passe incorrect." });
    }
  });
});

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }

    req.user = user;
    next();
  });
}

app.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Accès au profil", user: req.user });
});

app.listen(port, "0.0.0.0", () => {
  console.log("Serveur app écoutant sur le port " + port);
});