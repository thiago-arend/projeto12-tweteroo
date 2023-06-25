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

// valida se a query page é inteira e positiva
function validPage(page) {
    return Number.isInteger(page) && page > 0;
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
    //const { username } = req.headers.user;

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
    const page = req.query.page;

    if (page === undefined) { // se a query não foi utilizada (undefined)
        const lastTweets = tweetsArray.slice(-10); // devolve vazio caso a lista esteja vazia

        let mergeArray = [];
        lastTweets.forEach(t => {
            const userObj = usersArray.find(u => u.username === t.username);
            mergeArray.push({ ...userObj, ...t }); // o campo repetido (username) é sobreescrito
        });

        return res.send(mergeArray);
    }

    // se a query foi utilizada
    if (!validPage(Number(page))) return res.status(400).send("Informe uma página válida!");

    const leftIndex = tweetsArray.length - page * 10;
    const rightIndex = tweetsArray.length - (page - 1) * 10;
    const rangeTweets = tweetsArray.slice(leftIndex, rightIndex);
    let mergeArray = [];
    rangeTweets.forEach(t => {
        const userObj = usersArray.find(u => u.username === t.username);
        mergeArray.push({ ...userObj, ...t }); // o campo repetido (username) é sobreescrito
    });

    return res.send(mergeArray);

});

app.get("/tweets/:USERNAME", (req, res) => {
    const { USERNAME } = req.params;
    const userObj = usersArray.find(u => u.username === USERNAME);
    const filteredTweets = tweetsArray.filter(t => t.username === USERNAME);

    let mergeArray = [];
    filteredTweets.forEach(t => mergeArray.push({ ...userObj, ...t }));

    res.send(mergeArray);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
