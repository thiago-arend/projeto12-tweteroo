import express, { json } from "express";
import cors from "cors";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(json());

const usersArray = [];

const tweetsArray = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;
    usersArray.push({ username, avatar });

    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;
    if (!usersArray.find(u => u.username === username)) {
        return res.status(401).send("UNAUTHORIZED");
    }
    tweetsArray.push({ username, tweet });

    res.status(201).send("OK");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
