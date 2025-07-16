import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db.json');

// --- Database ---
const readDB = () => {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            return JSON.parse(data);
        }
        return null; // Return null if file doesn't exist
    } catch (err) {
        console.error("Error reading db.json:", err);
        return null;
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("Error writing to db.json:", err);
    }
};

let siteContent = readDB();

if (!siteContent) {
    console.log("db.json not found or is empty. Please ensure it exists and is populated.");
    // In a real app, you might initialize it with default data here.
    // For now, we'll just log an error and the server will run but clients won't get data.
}

// --- WebSocket ---
const broadcast = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === 1) { // 1 is OPEN
            client.send(JSON.stringify(data));
        }
    });
};

wss.on('connection', ws => {
    console.log('Client connected');
    
    // Send initial content to the newly connected client
    if (siteContent) {
        ws.send(JSON.stringify({ type: 'INITIAL_CONTENT', payload: siteContent }));
    }

    ws.on('message', message => {
        try {
            const data = JSON.parse(message);
            console.log('Received message:', data.type);
            
            if (data.type === 'UPDATE_CONTENT') {
                // Update the content in memory and in the db.json file
                siteContent = data.payload;
                writeDB(siteContent);
                
                // Broadcast the updated content to all clients
                broadcast({ type: 'CONTENT_UPDATED', payload: siteContent });
            }
        } catch (error) {
            console.error('Failed to parse message or handle update:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.onerror = (error) => {
        console.error('WebSocket error on a client:', error);
    }
});

// --- Static File Serving ---
const frontendDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDistPath));

// For any other route, serve the index.html from the dist folder
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
