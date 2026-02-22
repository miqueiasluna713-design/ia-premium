import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // necessário no Node

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Usuário premium fixo
let users = {
  "miqueiasluna713@gmail.com": true
};

// Coloque sua **chave da OpenAI aqui**
const OPENAI_API_KEY = "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";

// Rota chat
app.post("/chat", async (req, res) => {
  const { mensagem } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return res.json({ resposta: data.choices[0].message.content });
    } else {
      return res.json({ resposta: "Não consegui gerar uma resposta." });
    }

  } catch (error) {
    console.error(error);
    return res.json({ resposta: "Erro ao gerar resposta da IA." });
  }
});

app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
