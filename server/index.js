require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const { body, param, validationResult } = require("express-validator");

const app = express();
app.use(express.json());

const path = require("path");
const raiz = path.join(__dirname, "..");
app.use("/css", express.static(path.join(raiz, "css")));
app.use("/js", express.static(path.join(raiz, "js")));
app.use("/img", express.static(path.join(raiz, "img")));
app.get("/", (req, res) => res.sendFile(path.join(raiz, "index.html")));
app.get("/privacidad", (req, res) =>
  res.sendFile(path.join(raiz, "legal", "privacidad.html")),
);
app.get("/terminos", (req, res) =>
  res.sendFile(path.join(raiz, "legal", "terminos.html")),
);

app.get("/manifest.json", (req, res) =>
  res.sendFile(path.join(raiz, "manifest.json")),
);
app.get("/sw.js", (req, res) => {
  res.set("Cache-Control", "no-cache");
  res.sendFile(path.join(raiz, "sw.js"));
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty())
    return res.status(400).json({ errores: errores.array() });
  next();
};

// Verificación de conexión con la base de datos
app.get("/api/salud", async (req, res) => {
  try {
    const [[fila]] = await pool.query(
      "SELECT VERSION() AS version, DATABASE() AS base",
    );
    res.json({ estado: "ok", ...fila });
  } catch (e) {
    res.status(500).json({ estado: "error", mensaje: e.message });
  }
});

app.get("/api/tareas", async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT t.id, t.titulo, t.completada, c.nombre AS categoria
       FROM tareas t LEFT JOIN categorias c ON c.id = t.categoria_id
       ORDER BY t.id`,
    );
    res.json(filas);
  } catch (e) {
    res.status(500).json({ mensaje: e.message });
  }
});

app.post(
  "/api/tareas",
  body("titulo")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage("El título es obligatorio (máx. 150)"),
  body("categoria_id").optional({ nullable: true }).isInt({ min: 1 }),
  validar,
  async (req, res) => {
    try {
      const { titulo, categoria_id = null } = req.body;
      const [r] = await pool.query(
        "INSERT INTO tareas (titulo, categoria_id) VALUES (?, ?)",
        [titulo, categoria_id],
      );
      res
        .status(201)
        .json({ id: r.insertId, titulo, completada: 0, categoria_id });
    } catch (e) {
      res.status(500).json({ mensaje: e.message });
    }
  },
);

app.put(
  "/api/tareas/:id",
  param("id").isInt({ min: 1 }),
  body("completada").isBoolean(),
  validar,
  async (req, res) => {
    try {
      await pool.query("UPDATE tareas SET completada = ? WHERE id = ?", [
        req.body.completada ? 1 : 0,
        req.params.id,
      ]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ mensaje: e.message });
    }
  },
);

app.delete("/api/tareas/completadas", async (req, res) => {
  try {
    await pool.query("DELETE FROM tareas WHERE completada = 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ mensaje: e.message });
  }
});

app.delete(
  "/api/tareas/:id",
  param("id").isInt({ min: 1 }),
  validar,
  async (req, res) => {
    try {
      await pool.query("DELETE FROM tareas WHERE id = ?", [req.params.id]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ mensaje: e.message });
    }
  },
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "127.0.0.1", () =>
  console.log(`API escuchando en http://127.0.0.1:${PORT}`),
);
