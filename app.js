const express = require("express");
const app = express();

const bancoV1 = require("./routes/v1/banco");
const bancoV2 = require("./routes/v2/banco");

app.use(express.json());

// VERSION 1
app.use("/api/v1/banco", bancoV1);

// VERSION 2
app.use("/api/v2/banco", bancoV2);

app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});