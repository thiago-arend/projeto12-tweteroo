import express, { json } from "express";
import cors from "cors";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(json());

const usersArray = [];
const tweetsArray = [];

// valida se property é string
function isString(str) {
    return typeof str === "string";
}

// valida se property é válida (não nula, não indefinida e não vazia) && é string
function validProperty(entry) {
    return entry && isString(entry);
}

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (!validProperty(username) || !validProperty(avatar)) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    usersArray.push({ username, avatar });
    res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body;

    if (!validProperty(username) || !validProperty(tweet)) {
        return res.status(400).send("Todos os campos são obrigatórios!");
    }

    if (!usersArray.find(u => u.username === username)) {
        return res.status(401).send("UNAUTHORIZED");
    }

    tweetsArray.push({ username, tweet });
    res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
    const lastTweets = tweetsArray.slice(-10); // devolve vazio caso a lista esteja vazia

    let mergeArray = [];
    lastTweets.forEach(t => {
        const userObj = usersArray.find(u => u.username === t.username);
        mergeArray.push({ ...userObj, ...t, }); // o campo repetido (username) é sobreescrito
    });

    res.send(mergeArray);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
