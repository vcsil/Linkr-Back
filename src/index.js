import express from "express";
import chalk from "chalk";
import cors from "cors";

import router from "./routes/router.js";

const server = express();
server.use(express.json());
server.use(cors());

server.use(router);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(chalk.magenta(`Server is listening on port ${PORT}.`));
});
