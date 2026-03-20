require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");

const { getInstagramPosts } = require("./services/InstagramService");

const app = express();
app.use(cors());

const cache = new NodeCache({ stdTTL: 60 * 10 });

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});
app.use(limiter);
app.get("/", (req, res) => {
  res.send("🚀 API da Casa da Batian está no ar!");
});

app.get("/instagram/posts", async (req, res) => {
  try {
    const cached = cache.get("instagram_posts");

    if (cached) {
      return res.json({ source: "cache", data: cached });
    }

    const posts = await getInstagramPosts();

    cache.set("instagram_posts", posts);

    res.json({ source: "instagram", data: posts });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    res.status(500).json({ error: "Erro ao buscar posts do Instagram" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
