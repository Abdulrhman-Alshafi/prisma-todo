import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// GET all todos
app.get("/api/todos", async (req, res) => {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  res.json(todos);
});

// POST a new todo
app.post("/api/todos", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });
  const todo = await prisma.todo.create({ data: { title } });
  res.status(201).json(todo);
});

// PUT / DELETE routes ...
app.put("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { completed, title } = req.body;
  const updated = await prisma.todo.update({
    where: { id },
    data: { completed, title },
  });
  res.json(updated);
});

app.delete("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.todo.delete({ where: { id } });
  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
