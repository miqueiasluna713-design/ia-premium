import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // necessário no Node

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 👑 Usuário premium (modo teste)
let users = {
  "miqueiasluna713@gmail.com": true
};

// 💡 Adicione sua API Key do OpenAI aqui
const OPENAI_API_KEY = "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";

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

// 🔥 Rota de chat com ChatGPT
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

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
