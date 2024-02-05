require('dotenv').config();
const express = require('express');
const Airtable = require('airtable');
const app = express();
const PORT = process.env.PORT || 4000;

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

app.use(express.static('public'));

app.get('/api/vrapps', (req, res) => {
    const vrApps = [];
    const { category } = req.query; // Extract the category from query parameters

    base('vr').select({
        // Optionally filter by category if one is specified
        filterByFormula: category ? `FIND("${category}", {categories})` : ""
    }).eachPage((records, fetchNextPage) => {
        records.forEach(record => {
            // Make sure the property names match your Airtable field names
            const videoAttachment = record.get('Video') && record.get('Video').length > 0 ? record.get('Video')[0] : null;
            vrApps.push({
                name: record.get('Name'),
                videoUrl: videoAttachment && videoAttachment.url ? videoAttachment.url : '',
                description: record.get('Description'),
                link: record.get('Link'),
                category: record.get('categories') // This should match the field name in Airtable
            });
        });
        fetchNextPage();
    }, (err) => {
        if (err) { console.error(err); return; }
        res.json(vrApps);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
