
import express from 'express';
import apiRouter from './app.js';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(express.static('public'));

app.use('/api', apiRouter);

app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
    console.log(`Open http://localhost:${port}`);
});
