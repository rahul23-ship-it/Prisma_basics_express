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
async function main() {
    const result = await client.user.findFirst({
        where: {
            id: 1
        }, include: {
            todos: true
        }
    });
    console.log(result);
}
main();
app.listen(3000);
//# sourceMappingURL=index.js.map