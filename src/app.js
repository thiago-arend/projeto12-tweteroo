import express, { json } from "express";
import cors from "cors";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(json());

const usersArray = [];

const tweet = {
    username: 'bobesponja',
    avatar: "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png"
}

app.post("/sign-up", (req, res) => {
    const {username, avatar} = req.body;
    usersArray.push({username, avatar});

    res.status(201).send("OK");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
