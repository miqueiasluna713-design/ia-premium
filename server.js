import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 👑 "miqueiasluna713@gmail.com"
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
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(mensagem)}&format=json&no_html=1&skip_disambig=1`
    );

    const data = await response.json();

    let resposta = "Não encontrei uma resposta.";

    if (data.AbstractText) {
      resposta = data.AbstractText;
    }

    res.json({ resposta });

  } catch (error) {
    res.json({ resposta: "Erro ao buscar resposta." });
  }

});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
