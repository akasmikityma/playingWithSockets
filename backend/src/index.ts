import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';
import userRouter from './routers/user';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import prisma from './prisma';

const app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use('/user', userRouter);

const server = http.createServer(app);

interface clientType extends WebSocket {
  userId: number;
  roomId?: number;
}

const wss = new WebSocketServer({ server });
const clients: clientType[] = [];

wss.on('connection', (socket: WebSocket) => {
  console.log(`A client is connected`);

  // Type assertion to extend WebSocket to clientType
  const extendedSocket = socket as clientType;

  socket.on('message', async (msg) => {
    const parsedMessage = JSON.parse(msg.toString()); // Convert Buffer to string

    switch (parsedMessage.type) {
      case 'JOIN_ROOM':
        const newRoomName = parsedMessage.room;
        try {
          const foundRoom = await prisma.room.findFirst({
            where: {
              AND: [
                {
                  members: {
                    some: {
                      id: parsedMessage.clients[0],
                    },
                  },
                },
                {
                  members: {
                    some: {
                      id: parsedMessage.clients[1],
                    },
                  },
                },
              ],
            },
            include: {
              members: true,
            },
          });

          if (!foundRoom) {
            // Create the new room
            const newRoom = await prisma.room.create({
              data: {
                name: newRoomName,
              },
            });

            // Update the room to add members
            const updatedRoom = await prisma.room.update({
              where: {
                id: newRoom.id, // Use the ID from the newly created room
              },
              data: {
                members: {
                  //@ts-ignore
                  connect: parsedMessage.clients.map((clientId) => ({
                    id: clientId,
                  })),
                },
              },
            });

            // Associate this socket with the room
            extendedSocket.roomId = newRoom.id;

            // Add the client to the in-memory list if not already present
            if (
              !clients.some(
                (client) => client.userId === parsedMessage.clients[0]
              )
            ) {
              extendedSocket.userId = parsedMessage.clients[0];
              clients.push(extendedSocket);
            }

            extendedSocket.send(
              JSON.stringify({
                type: 'JOIN_ROOM',
                //@ts-ignore
                roomID: newRoom.id,
              })
            );
          } else {
            console.log('Room already exists');

            // Associate this socket with the found room
            extendedSocket.roomId = foundRoom.id;

            // Add the client to the in-memory list if not already present
            if (
              !clients.some(
                (client) => client.userId === parsedMessage.clients[0]
              )
            ) {
              extendedSocket.userId = parsedMessage.clients[0];
              clients.push(extendedSocket);
            }

            //send the room id to the clients
            extendedSocket.send(
              JSON.stringify({
                type: 'JOIN_ROOM',
                roomID: foundRoom.id,
              })
            );
          }
        } catch (err) {
          console.log(err);
        }
        break;

      case 'MESSAGE':
        const { roomID, message, senderId } = parsedMessage;

        // Store the message in the database
        await prisma.message.create({
          data: {
            data: message,
            senderId,
            roomId: roomID,
          },
        });

        // Broadcast the message to all clients in the same room
        clients.forEach((client) => {
          if (client.roomId === roomID && client.readyState === WebSocket.OPEN) {
            console.log(`Sending message to userId ${client.userId}`);
            client.send(
              JSON.stringify({
                senderId:senderId,
                type: 'MESSAGE',
                data: message,
                roomId: roomID,
              })
            );
          } else if (client.roomId === roomID) {
            console.log(`Client not open for userId ${client.userId}`);
          }
        });
        break;
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');

    // Remove the client from the in-memory list
    const index = clients.indexOf(extendedSocket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});
