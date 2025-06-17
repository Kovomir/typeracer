import {handleMessage} from './game/ws_handlers.js';
import {connectionMap} from './game/state.js';
import {removePlayer} from './game/logic.js';
import {WebSocketServer} from "ws";
import {createServer} from 'http';

const PORT = process.env.PORT || 3001;
const server = createServer();
let wss;

const startServer = (port) => {
    try {
        wss = new WebSocketServer({server});
        server.listen(port, () => {
            console.log(`🟢 WebSocket server running on ws://localhost:${port}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
                startServer(port + 1);
            } else {
                console.error('❗ Server error:', err);
            }
        });

        return wss;
    } catch (err) {
        console.error('❗ Failed to start server:', err);
        process.exit(1);
    }
};

wss = startServer(PORT);

wss.on('connection', (ws) => {
    console.log('🔌 New connection established');
    console.log(`👥 Total connections: ${wss.clients.size}`);

    ws.on('message', (msg) => {
        let data;
        try {
            data = JSON.parse(msg);
            console.log(`📨 Received message: ${data.type}`);
            handleMessage(ws, data, connectionMap);
        } catch (err) {
            console.error('⚠️ Error processing message:', {
                error: err.message,
                stack: err.stack,
                messageType: data?.type,
                timestamp: new Date().toISOString()
            });
            ws.send(JSON.stringify({
                type: 'error',
                message: `Error: ${err.message}`,
                details: {
                    type: data?.type,
                    timestamp: new Date().toISOString()
                }
            }));
        }
    });

    ws.on('close', () => {
        const player = connectionMap.get(ws);
        if (player) {
            removePlayer(player);
            connectionMap.delete(ws);
        }
        console.log('❎ Connection closed');
        console.log(`👥 Remaining connections: ${wss.clients.size}`);
    });

    ws.on('error', (err) => {
        console.error('❗ WebSocket error:', err);
    });
});

process.on('SIGINT', () => {
    console.log('\n� Shutting down server...');
    if (wss) {
        wss.close(() => {
            console.log('✅ WebSocket server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});
