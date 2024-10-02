const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100mb' })); // Increase the limit to handle larger payloads
app.use('/api', apiRoutes);
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve media files
app.use('/media', express.static(path.join(__dirname, 'media')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));