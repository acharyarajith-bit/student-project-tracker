import express from 'express';
import { db } from './database.js';

const router = express.Router();

// Get all projects
router.get('/projects', async (req, res, next) => {
    try {
        const projects = await db.list();
        res.json(projects);
    } catch (error) {
        next(error);
    }
});

// Create a new project
router.post('/projects', async (req, res, next) => {
    try {
        const { name, status } = req.body ?? {};

        if (
            typeof name !== 'string' ||
            name.trim().length < 1 ||
            name.trim().length > 80 ||
            !['Planned', 'In Progress', 'Completed'].includes(status)
        ) {
            return res.status(400).json({
                error: 'Valid project name and status are required.'
            });
        }

        const project = await db.create({
            name: name.trim(),
            status
        });

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
});

// Update an existing project
router.put('/projects/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { name, status } = req.body ?? {};

        if (
            !Number.isSafeInteger(id) ||
            id < 1 ||
            typeof name !== 'string' ||
            name.trim().length < 1 ||
            name.trim().length > 80 ||
            !['Planned', 'In Progress', 'Completed'].includes(status)
        ) {
            return res.status(400).json({
                error: 'Valid project ID, name and status are required.'
            });
        }

        const project = await db.update(id, {
            name: name.trim(),
            status
        });

        if (!project) {
            return res.status(404).json({
                error: 'Project not found.'
            });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
});

// Delete a project
router.delete('/projects/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({
                error: 'Valid project ID is required.'
            });
        }

        const removed = await db.remove(id);

        if (!removed) {
            return res.status(404).json({
                error: 'Project not found.'
            });
        }

        // Return HTTP 200 because the supplied test expects status 200.
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router;