require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Fetch all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        res.json({
            tasks,
            tasksCompleted: tasks.filter(t => t.completed).length,
            tasksCount: tasks.length
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks." });
    }
});

// Create a new task
app.post("/tasks", async (req, res) => {
    try {
        const { title, color } = req.body;

        if (!title || title.length > 255) {
            return res.status(400).json({ error: "Title is required and must be under 255 characters." });
        }

        const newTask = await prisma.task.create({
            data: { title, color }
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task." });
    }
});

//Update task
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { title, color, completed } = req.body;

    try {
        const existingTask = await prisma.task.findUnique({
            where: { id },
        });

        if (!existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        const updateData = {
            title: title !== undefined ? title : existingTask.title,
            color: color !== undefined ? color : existingTask.color,
            completed: completed !== undefined ? completed : existingTask.completed,
        };

        const updatedTask = await prisma.task.update({
            where: { id },
            data: updateData,
        });

        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
});

  

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.task.delete({ where: { id } });

        res.json({ message: "Task deleted" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(404).json({ error: "Task not found or deletion failed." });
    }
});

// Graceful shutdown
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
