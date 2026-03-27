import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const __filename = path.join(__dirname, 'data', 'features.json');

const app = express();

axpp.use(cors());
app.use(express.json());

const loadFeatures = () => {
    try {
        const jsonFile = fs.readFileSync(__filename, 'utf-8');
        return JSON.parse(jsonFile);
    } catch (error) {
        return [];
    }
};

const saveFeatures = (features) => {
    fs.writeFileSync(__filename, JSON.stringify(features, null, 2));
};

app.get('/', (req, res) => {
    res.send('Pocketz suggest feature backend is running.');
});

// POST endpoint to submit a feature suggestion
app.post('/suggest-feature', (req, res) => {
    const { title, description, email, category } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const features = loadFeatures();
    const newFeature = {
        id: Date.now(),
        title,
        description,
        email: email || null,
        category: category || 'general',
        votes: 0,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    features.push(newFeature);
    saveFeatures(features);

    res.json({ message: 'Feature suggestion received', data: newFeature });
});

app.get('/suggested-features', (req, res) => {
    const features = loadFeatures();
    res.json(features);
});

app.post('/vote-feature/:id', (req, res) => {
    const featureId = parseInt(req.params.id);
    const features = loadFeatures();

    const feature = features.find(f => f.id === featureId);
    if (!feature) {
        return res.status(404).json({ error: 'Feature not found' });
    }

    feature.votes = (feature.votes || 0) + 1;
    saveFeatures(features);

    res.json({ message: 'Vote recorded', data: feature });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});