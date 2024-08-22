"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const rooms = [];
const clients = [];
wss.on('connection', (socket) => {
    console.log(`A client is connected`);
    let currentClient = null;
    socket.on('message', (msg) => {
        const parsedMessage = JSON.parse(msg.toString()); // Convert Buffer to string
        switch (parsedMessage.type) {
            case "toDashboard":
                // Find or create the room
                let room = rooms.find(r => r.name === parsedMessage.room);
                if (!room) {
                    room = { name: parsedMessage.room, clients: [] };
                    rooms.push(room);
                }
                // Create a new client and associate it with the room
                const newClient = socket;
                newClient.name = parsedMessage.name;
                newClient.theRoom = room;
                // Add the client to the room and the global clients array
                room.clients.push(newClient);
                clients.push(newClient);
                currentClient = newClient;
                // Broadcast the updated client list
                broadcastClientList();
                break;
            case 'JOIN_ROOM':
                const newRoomName = parsedMessage.room;
                // Leave the current room if already in one
                if (currentClient && currentClient.theRoom) {
                    currentClient.theRoom.clients = currentClient.theRoom.clients.filter(client => client !== socket);
                }
                // Find or create the new room
                let newRoom = rooms.find(r => r.name === newRoomName);
                if (!newRoom) {
                    newRoom = { name: newRoomName, clients: [] };
                    rooms.push(newRoom);
                }
                // Set the client to the new room
                if (currentClient) {
                    currentClient.theRoom = newRoom;
                    newRoom.clients.push(currentClient);
                }
                console.log(`Client joined room: ${newRoomName}`);
                broadcastClientList();
                break;
            case 'MESSAGE':
                const messageToSend = parsedMessage.data;
                // Broadcast the message to all clients in the current room
                if (currentClient && currentClient.theRoom) {
                    currentClient.theRoom.clients.forEach(client => {
                        if (client !== socket && client.readyState === ws_1.WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'MESSAGE',
                                data: messageToSend
                            }));
                        }
                    });
                }
                break;
        }
    });
    socket.on('close', () => {
        console.log('Client disconnected');
        // Remove the client from the room and global list when they disconnect
        if (currentClient && currentClient.theRoom) {
            currentClient.theRoom.clients = currentClient.theRoom.clients.filter(client => client !== socket);
            clients.splice(clients.indexOf(currentClient), 1);
        }
        broadcastClientList();
    });
});
function broadcastClientList() {
    const clientList = clients.map(client => ({
        name: client.name,
        Roomname: client.theRoom.name
    }));
    clients.forEach(client => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'CLIENT_LIST',
                data: clientList
            }));
        }
    });
}
console.log('WebSocket server is running on ws://localhost:8080');
