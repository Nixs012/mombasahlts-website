// Import required modules
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

// Create an Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // change if you set a MySQL username
  password: "",// IMPORTANT: Replace with your MySQL password or use environment variables
  database: "mombasa_hamlets"  // we'll create this DB later
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

const JWT_SECRET = "your_jwt_secret_key"; // Replace with a strong, secret key

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
  return next();
};

// API route for user registration
app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)";
    db.query(query, [username, hashedPassword, role || 'user'], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: "Username already exists" });
        }
        console.error("Error registering user:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API route for user login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Error logging in:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  });
});

// Example of a protected route
app.get("/api/admin/dashboard", verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access denied" });
  }
  res.json({ message: `Welcome to the admin dashboard, ${req.user.username}!` });
});

// API route to get all players
app.get("/api/players", (req, res) => {
  const query = "SELECT * FROM players ORDER BY position, number";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching players:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// API route to get all products
app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// Setup route to create and populate the database
app.get("/setup/database", (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS players (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      number INT,
      position VARCHAR(255),
      nationality VARCHAR(255),
      age INT,
      height VARCHAR(50),
      weight VARCHAR(50),
      joined DATE,
      previousClub VARCHAR(255),
      image VARCHAR(255),
      appearances INT,
      goals INT,
      assists INT,
      yellowCards INT,
      redCards INT,
      bio TEXT,
      status VARCHAR(255),
      cleanSheets INT,
      saves INT,
      goalsConceded INT,
      tackles INT,
      interceptions INT
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return res.status(500).send("Error creating table.");
    }
    console.log("✅ 'players' table created or already exists.");

    const playersData = [
      {
        id: 1,
        name: "Ali Mwinyi",
        number: 10,
        position: "Midfielder",
        nationality: "Kenyan",
        age: 28,
        height: "178cm",
        weight: "72kg",
        joined: "2020-07-01",
        previousClub: "Tusker FC",
        image: "images/player1.jpg",
        appearances: 45,
        goals: 12,
        assists: 18,
        yellowCards: 8,
        redCards: 0,
        bio: "Team captain and creative midfielder. Known for his vision, passing accuracy, and leadership on the pitch. Former Kenyan Premier League Young Player of the Year.",
        status: "First Team"
      },
      {
        id: 2,
        name: "Jamal Abdi",
        number: 9,
        position: "Forward",
        nationality: "Kenyan",
        age: 24,
        height: "185cm",
        weight: "78kg",
        joined: "2023-01-15",
        previousClub: "Nairobi City Stars",
        image: "images/player2.jpg",
        appearances: 30,
        goals: 18,
        assists: 7,
        yellowCards: 3,
        redCards: 0,
        bio: "Clinical striker with excellent finishing ability. Top scorer last season with 18 goals. Known for his speed and aerial prowess.",
        status: "First Team"
      },
      {
        id: 3,
        name: "Joseph Omar",
        number: 1,
        position: "Goalkeeper",
        nationality: "Kenyan",
        age: 32,
        height: "192cm",
        weight: "85kg",
        joined: "2019-08-10",
        previousClub: "Bandari FC",
        image: "images/player3.jpg",
        appearances: 40,
        cleanSheets: 15,
        saves: 127,
        goalsConceded: 32,
        yellowCards: 2,
        redCards: 0,
        bio: "Experienced goalkeeper and vice-captain. Excellent shot-stopper with great command of the penalty area. Former national team call-up.",
        status: "First Team"
      },
      {
        id: 4,
        name: "David Kamau",
        number: 5,
        position: "Defender",
        nationality: "Kenyan",
        age: 26,
        height: "188cm",
        weight: "82kg",
        joined: "2021-06-20",
        previousClub: "Gor Mahia",
        image: "images/player4.jpg",
        appearances: 38,
        goals: 3,
        assists: 4,
        tackles: 89,
        interceptions: 67,
        yellowCards: 6,
        redCards: 1,
        bio: "Strong and reliable center-back. Excellent in aerial duels and organizing the defense. Known for his tough tackling and reading of the game.",
        status: "First Team"
      },
      {
        id: 5,
        name: "Hassan Mohammed",
        number: 7,
        position: "Midfielder",
        nationality: "Kenyan",
        age: 22,
        height: "175cm",
        weight: "68kg",
        joined: "2022-08-05",
        previousClub: "Kariobangi Sharks",
        image: "images/player5.jpg",
        appearances: 35,
        goals: 8,
        assists: 12,
        yellowCards: 4,
        redCards: 0,
        bio: "Young and energetic winger with incredible pace and dribbling skills. Provides width and creativity in attack. Future prospect for the national team.",
        status: "First Team"
      },
      {
        id: 6,
        name: "Samuel Okello",
        number: 6,
        position: "Midfielder",
        nationality: "Kenyan",
        age: 29,
        height: "182cm",
        weight: "76kg",
        joined: "2020-09-12",
        previousClub: "Sofapaka",
        image: "images/player6.jpg",
        appearances: 42,
        goals: 5,
        assists: 9,
        yellowCards: 10,
        redCards: 0,
        bio: "Defensive midfielder who provides stability and protection to the backline. Excellent ball winner and distributor. Team's engine room.",
        status: "First Team"
      },
      {
        id: 7,
        name: "Benard Mbugua",
        number: 3,
        position: "Defender",
        nationality: "Kenyan",
        age: 25,
        height: "180cm",
        weight: "75kg",
        joined: "2022-01-20",
        previousClub: "Wazito FC",
        image: "images/player7.jpg",
        appearances: 28,
        goals: 2,
        assists: 3,
        tackles: 56,
        interceptions: 45,
        yellowCards: 5,
        redCards: 0,
        bio: "Versatile defender who can play both center-back and left-back. Good technical ability and crossing range. Solid defensive contributions.",
        status: "First Team"
      },
      {
        id: 8,
        name: "Mike Adan",
        number: 11,
        position: "Forward",
        nationality: "Kenyan",
        age: 21,
        height: "177cm",
        weight: "70kg",
        joined: "2023-07-01",
        previousClub: "Youth Academy",
        image: "images/DSC_0051.jpg",
        appearances: 15,
        goals: 4,
        assists: 3,
        yellowCards: 1,
        redCards: 0,
        bio: "Promising young striker from the academy. Quick, agile, and composed in front of goal. Great potential for the future.",
        status: "First Team"
      }
    ];

    const insertQuery = "INSERT INTO players (name, number, position, nationality, age, height, weight, joined, previousClub, image, appearances, goals, assists, yellowCards, redCards, bio, status, cleanSheets, saves, goalsConceded, tackles, interceptions) VALUES ?";
    const values = playersData.map(p => [p.name, p.number, p.position, p.nationality, p.age, p.height, p.weight, p.joined, p.previousClub, p.image, p.appearances, p.goals, p.assists, p.yellowCards, p.redCards, p.bio, p.status, p.cleanSheets, p.saves, p.goalsConceded, p.tackles, p.interceptions]);

    // Clear the table before inserting to avoid duplicates on re-run
    db.query("TRUNCATE TABLE players", (err) => {
      if (err) {
        console.error("Error truncating table:", err);
        return res.status(500).send("Error clearing player data.");
      }
      
      db.query(insertQuery, [values], (err) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.status(500).send("Error inserting player data.");
        }
        console.log("✅ Player data has been inserted.");
        res.send("Database setup complete. 'players' table created and populated.");
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// =============================================
// API ROUTES FOR ADMIN PANEL
// =============================================

// NEWS API
app.get('/api/news', (req, res) => {
  db.query('SELECT * FROM news ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/news', (req, res) => {
  const { title, image_url, summary, category, is_breaking, status } = req.body;
  const query = 'INSERT INTO news (title, image_url, summary, category, is_breaking, status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [title, image_url, summary, category, is_breaking, status || 'draft'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const { title, image_url, summary, category, is_breaking, status } = req.body;
    const query = 'UPDATE news SET title = ?, image_url = ?, summary = ?, category = ?, is_breaking = ?, status = ? WHERE id = ?';
    db.query(query, [title, image_url, summary, category, is_breaking, status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'News article updated successfully' });
    });
});

app.delete('/api/news/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM news WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'News article deleted successfully' });
    });
});


// MATCHES API
app.get('/api/matches', (req, res) => {
  db.query('SELECT * FROM matches ORDER BY match_date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/matches', (req, res) => {
  const { match_date, home_team, away_team, competition, venue } = req.body;
  const query = 'INSERT INTO matches (match_date, home_team, away_team, competition, venue) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [match_date, home_team, away_team, competition, venue], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put('/api/matches/:id', (req, res) => {
    const { id } = req.params;
    const { match_date, home_team, away_team, competition, venue } = req.body;
    const query = 'UPDATE matches SET match_date = ?, home_team = ?, away_team = ?, competition = ?, venue = ? WHERE id = ?';
    db.query(query, [match_date, home_team, away_team, competition, venue, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Match updated successfully' });
    });
});

app.delete('/api/matches/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM matches WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Match deleted successfully' });
    });
});


// PLAYERS API (in addition to the public one)
app.post('/api/players', (req, res) => {
    // NOTE: This assumes you handle file uploads separately and get an image path
    const { name, number, position, nationality, age, height, weight, joined, previousClub, image, bio, status } = req.body;
    const query = 'INSERT INTO players (name, number, position, nationality, age, height, weight, joined, previousClub, image, bio, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, number, position, nationality, age, height, weight, joined, previousClub, image, bio, status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});

app.put('/api/players/:id', (req, res) => {
    const { id } = req.params;
    const { name, number, position, nationality, age, height, weight, joined, previousClub, image, bio, status } = req.body;
    const query = 'UPDATE players SET name = ?, number = ?, position = ?, nationality = ?, age = ?, height = ?, weight = ?, joined = ?, previousClub = ?, image = ?, bio = ?, status = ? WHERE id = ?';
    db.query(query, [name, number, position, nationality, age, height, weight, joined, previousClub, image, bio, status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Player updated successfully' });
    });
});

app.delete('/api/players/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM players WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Player deleted successfully' });
    });
});


// SHOP (PRODUCTS) API (in addition to the public one)
app.post('/api/products', (req, res) => {
    const { name, price, originalPrice, category, image, description, sizes } = req.body;
    const query = 'INSERT INTO products (name, price, originalPrice, category, image, description, sizes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, price, originalPrice, category, image, description, sizes], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, originalPrice, category, image, description, sizes } = req.body;
    const query = 'UPDATE products SET name = ?, price = ?, originalPrice = ?, category = ?, image = ?, description = ?, sizes = ? WHERE id = ?';
    db.query(query, [name, price, originalPrice, category, image, description, sizes, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product updated successfully' });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted successfully' });
    });
});

// Setup route for shop products
app.get("/setup/shop", (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      originalPrice DECIMAL(10, 2),
      category VARCHAR(255),
      image VARCHAR(255),
      description TEXT,
      sizes VARCHAR(255)
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating products table:", err);
      return res.status(500).send("Error creating products table.");
    }
    console.log("✅ 'products' table created or already exists.");

    const productsData = [
      {
        id: 1,
        name: "Home Jersey 2025",
        price: 2500,
        originalPrice: 3000,
        category: "jerseys",
        image: "images/product-home-jersey.jpg",
        description: "Official home jersey for the 2025 season. Made from high-quality breathable fabric with team crest and sponsor logos.",
        sizes: "S,M,L,XL"
      },
      {
        id: 2,
        name: "Away Jersey 2025",
        price: 2500,
        originalPrice: null,
        category: "jerseys",
        image: "images/product-away-jersey.jpg",
        description: "Official away jersey for the 2025 season. Made from high-quality breathable fabric with team crest and sponsor logos.",
        sizes: "S,M,L,XL"
      },
      {
        id: 3,
        name: "Training Jacket",
        price: 1800,
        originalPrice: null,
        category: "training",
        image: "images/product-training-jacket.jpg",
        description: "Premium training jacket with moisture-wicking technology and team branding.",
        sizes: "S,M,L,XL"
      },
      {
        id: 4,
        name: "Team Scarf",
        price: 800,
        originalPrice: 1200,
        category: "accessories",
        image: "images/product-scarf.jpg",
        description: "Official team scarf made from warm acrylic wool blend. Features team colors and crest.",
        sizes: "One Size"
      },
      {
        id: 5,
        name: "Team Cap",
        price: 600,
        originalPrice: null,
        category: "accessories",
        image: "images/product-cap.jpg",
        description: "Adjustable team cap with embroidered logo and curved visor.",
        sizes: "One Size"
      },
      {
        id: 6,
        name: "Official Match Ball",
        price: 1500,
        originalPrice: null,
        category: "equipment",
        image: "images/product-football.jpg",
        description: "Official match ball used in league games. FIFA approved for professional play.",
        sizes: "Size 5"
      },
      {
        id: 7,
        name: "Training Top",
        price: 1200,
        originalPrice: null,
        category: "training",
        image: "images/product-training-top.jpg",
        description: "Lightweight training top with moisture management technology.",
        sizes: "S,M,L,XL"
      },
      {
        id: 8,
        name: "Third Jersey 2025",
        price: 2200,
        originalPrice: null,
        category: "jerseys",
        image: "images/product-third-jersey.jpg",
        description: "Special edition third jersey for the 2025 season. Limited availability.",
        sizes: "S,M,L,XL"
      }
    ];

    const insertQuery = "INSERT INTO products (name, price, originalPrice, category, image, description, sizes) VALUES ?";
    const values = productsData.map(p => [p.name, p.price, p.originalPrice, p.category, p.image, p.description, p.sizes]);

    db.query("TRUNCATE TABLE products", (err) => {
      if (err) {
        console.error("Error truncating products table:", err);
        return res.status(500).send("Error clearing product data.");
      }
      
      db.query(insertQuery, [values], (err) => {
        if (err) {
          console.error("Error inserting product data:", err);
          return res.status(500).send("Error inserting product data.");
        }
        console.log("✅ Product data has been inserted.");
        res.send("Shop setup complete. 'products' table created and populated.");
      });
    });
  });
});
