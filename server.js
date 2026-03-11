const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "webapp", "model", "data.json");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "webapp")));

// Helper - read data.json
function readData() {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
}

// Helper - write data.json
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// GET all customers
app.get("/api/customers", (req, res) => {
    try {
        res.json(readData());
    } catch (e) {
        res.status(500).json({ error: "Failed to read data" });
    }
});

// POST - add customer
app.post("/api/customers", (req, res) => {
    try {
        const data = readData();
        const maxId = data.Customers.reduce((m, c) => Math.max(m, parseInt(c.id) || 0), 0);
        const newCustomer = Object.assign({ id: String(maxId + 1) }, req.body);
        data.Customers.push(newCustomer);
        writeData(data);
        res.status(201).json(newCustomer);
    } catch (e) {
        res.status(500).json({ error: "Failed to add customer" });
    }
});

// PUT - update customer
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

// DELETE - remove customer
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

// Serve index.html for all non-API routes (SPA fallback)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
