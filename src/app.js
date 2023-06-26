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

// descobre os indices da paginação
function splitIndex(array, n) {
    let count = 0;
    let start, end;

    if ((n - 1) * 10 > array.length) return null;
    if (array.length < 10) return { start: 0, end: array.length - 1 };

    for (let i = array.length - 1; i >= 0; i--) {
        count++;
        if (count === 10) {
            n--;
            count = 0;
            start = i;
        }

        if (n === 0) break;
    }

    end = start + 9;

    if (start < 9 && n > 0) {
        start = 0;
        end -= 9;
    }

    return { start, end }
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
    const tweet = req.body.tweet;
    const username = req.headers.user;

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

    let mergeArray = [];
    const {start, end} = splitIndex(tweetsArray, page);
    const rangeTweets = tweetsArray.slice(start, end);
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
