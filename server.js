import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // necessário no Node

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 👑 Usuário premium fixo (você)
let users = {
  "miqueiasluna713@gmail.com": true
};

// 💡 Coloque sua API Key da OpenAI aqui
const OPENAI_API_KEY = "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";

// Rota para verificar usuário premium
app.post("/check-premium", (req, res) => {
  const { email } = req.body;
  res.json({ premium: users[email] || false });
});

// Rota de chat
app.post("/chat", async (req, res) => {
  const { mensagem } = req.body;

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Você é um assistente inteligente que responde de forma clara e educativa." },
          { role: "user", content: mensagem }
        ],
        max_tokens: 200
      })
    });

    const data = await resposta.json();

    let textResposta = "Não consegui gerar uma resposta.";

    if (data.choices && data.choices.length > 0) {
      textResposta = data.choices[0].message.content;
    }

    res.json({ resposta: textResposta });

  } catch (error) {
    console.log(error);
    res.json({ resposta: "Erro ao gerar resposta da IA." });
  }
});

app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
