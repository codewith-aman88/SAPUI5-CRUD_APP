/**
 * server.js — Simple Express backend for SAPUI5 CRUD App
 * Handles persistent read/write of webapp/model/data.json
 *
 * Start with:  node server.js
 * Then open:   http://localhost:3000
 */

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "webapp", "model", "data.json");

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, "webapp"))); // serve the UI5 app

// Helper — read data.json
function readData() {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
}

// Helper — write data.json (pretty-printed so it stays human-readable)
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ── REST API ───────────────────────────────────────────────────────────────

// GET all customers
app.get("/api/customers", (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: "Failed to read data" });
    }
});

// POST — add a new customer
app.post("/api/customers", (req, res) => {
    try {
        const data = readData();
        const customers = data.Customers;
        const maxId = customers.reduce((m, c) => Math.max(m, parseInt(c.id) || 0), 0);
        const newCustomer = Object.assign({ id: String(maxId + 1) }, req.body);
        customers.push(newCustomer);
        writeData(data);
        res.status(201).json(newCustomer);
    } catch (e) {
        res.status(500).json({ error: "Failed to add customer" });
    }
});

// PUT — update an existing customer by id
app.put("/api/customers/:id", (req, res) => {
    try {
        const data = readData();
        const idx = data.Customers.findIndex(c => c.id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Customer not found" });
        data.Customers[idx] = Object.assign({}, data.Customers[idx], req.body, { id: req.params.id });
        writeData(data);
        res.json(data.Customers[idx]);
    } catch (e) {
        res.status(500).json({ error: "Failed to update customer" });
    }
});

// DELETE — remove a customer by id
app.delete("/api/customers/:id", (req, res) => {
    try {
        const data = readData();
        const idx = data.Customers.findIndex(c => c.id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: "Customer not found" });
        const removed = data.Customers.splice(idx, 1)[0];
        writeData(data);
        res.json(removed);
    } catch (e) {
        res.status(500).json({ error: "Failed to delete customer" });
    }
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅  Server running at http://localhost:${PORT}`);
    console.log(`📂  Data file: ${DATA_FILE}`);
    console.log(`\n   Open http://localhost:${PORT}/index.html in your browser`);
});
