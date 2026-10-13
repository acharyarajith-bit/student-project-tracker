import express from 'express';
import * as db from './database.js';

const router = express.Router();

// Read all projects
router.get('/projects', (req, res) => {
    res.json(db.list());
});

// Create a project
router.post('/projects', (req, res) => {
    const { name, status } = req.body ?? {};

    if (
        typeof name !== 'string' ||
        !name.trim() ||
        !['Planned', 'In Progress', 'Completed'].includes(status)
    ) {
        return res.status(400).json({
            error: 'Valid project name and status are required.'
        });
    }

    const project = {
        id: String(Date.now()),
        name: name.trim(),
        status
    };

    db.create(project);

    res.status(201).json(project);
});

export default router;

