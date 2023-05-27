import express from "express";
import { PrismaClient } from "@prisma/client"

const app = express();
app.use(express.json());

const prisma = new PrismaClient({
  log:["query"]
});

app.get("/", (request, response) => {
  return response.json({"teste": "Deu certo!"})
})

app.listen(3333);