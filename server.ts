import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase JSON payload limit for large base64 files (like 6MB PDFs)
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));
  app.use(cors());

  const DATA_FILE = path.join(process.cwd(), "site_data.json");

  // Load data from file or use defaults
  let siteData = {
    product: {},
    settings: {},
    clients: [],
    references: [],
    categories: ["은행 및 증권사", "보험 및 캐피탈", "금융 유관기관"],
    inquiries: []
  };

  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      siteData = JSON.parse(data);
    } catch (error) {
      console.error("Error loading data file:", error);
    }
  }

  const saveData = () => {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(siteData, null, 2));
    } catch (error) {
      console.error("Error saving data file:", error);
    }
  };

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/site-data", (req, res) => {
    res.json(siteData);
  });

  app.post("/api/site-data", (req, res) => {
    const { type, data } = req.body;
    if (type === "product") siteData.product = data;
    else if (type === "settings") siteData.settings = data;
    else if (type === "clients") siteData.clients = data;
    else if (type === "references") siteData.references = data;
    else if (type === "categories") siteData.categories = data;
    else if (type === "inquiries") siteData.inquiries = data;
    
    saveData();
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
