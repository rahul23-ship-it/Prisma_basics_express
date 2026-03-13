import "dotenv/config";
import express from "express";
const app = express();
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
app.use(express.json());
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});
const client = new PrismaClient({
    adapter
});
app.get("/users", async (req, res) => {
    const users = await client.user.findMany();
    res.json({
        users: users
    });
});
app.get("/todos/:id", async (req, res) => {
    const id = req.params.id;
    const user = await client.user.findFirst({
        where: {
            id: Number(id)
        },
        select: {
            todos: true,
            username: true,
            age: true
        }
    });
    res.json({
        user
    });
});
app.post("/users/todo", async (req, res) => {
    const username = req.body.username;
    const age = req.body.age;
    const password = req.body.password;
    const city = req.body.city;
    const description = req.body.description;
    const title = req.body.title;
    const done = req.body.done;
    const user = await client.user.create({
        data: {
            username: username,
            age: age,
            password: password,
            city: city,
            todos: {
                create: {
                    description: description,
                    title: title,
                    done: done
                }
            }
        }
    });
    res.json({
        message: "user added"
    });
});
app.listen(3000);
//# sourceMappingURL=index.js.map