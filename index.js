const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());



const fs = require('fs');
const tasksFilePath = './tasks.json';
let tasks = JSON.parse(fs.readFileSync(tasksFilePath, 'utf-8'));

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== id);
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    res.status(204).send();
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
