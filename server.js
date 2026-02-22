import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // necessário para usar fetch no Node.js

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 👑 Usuário premium (modo teste)
let users = {
  "miqueiasluna713@gmail.com": true
};

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// 🔐 Verificar premium
app.post("/check-premium", (req, res) => {
  const { email } = req.body;

  if (users[email]) {
    res.json({ premium: true });
  } else {
    res.json({ premium: false });
  }
});

// 🔥 Rota de chat
app.post("/chat", async (req, res) => {
  const { mensagem } = req.body;

  try {
    // Tenta DuckDuckGo primeiro
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(mensagem)}&format=json&no_html=1&skip_disambig=1`
    );
    const data = await response.json();

    let resposta = "";

    // Se DuckDuckGo não tiver AbstractText, usa fallback
    if (data.AbstractText && data.AbstractText.trim() !== "") {
      resposta = data.AbstractText;
    } else {
      resposta = `Não encontrei uma resposta exata, mas posso tentar explicar: "${mensagem}" é algo complexo, mas posso ajudar você a entender melhor!`;
    }

    res.json({ resposta });

  } catch (error) {
    console.log(error);
    res.json({ resposta: "Erro ao buscar resposta. Tente novamente." });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
