import { createServer } from "http";
import express from "express";
import { Server, Socket } from "socket.io";
import path from "path";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve(import.meta.dirname, "public")));

const allSockets: Socket[] = [];

const players: Record<string, { x: number, y: number }> = {};

io.on("connection", (socket) => {
	players[socket.id] = { x: 0, y: 0 };

	socket.on("disconnect", () => {
		delete players[socket.id];
		const i = allSockets.indexOf(socket);
		allSockets.splice(i, 1);
		io.emit("player-disconnected", socket.id);
	});

	socket.on("player-update", (position) => {
		players[socket.id] = position;
		allSockets.forEach(s => {
			if (s.id !== socket.id)
				s.emit("player-update", socket.id, position);
		});
	});

	socket.on("get-current-players", () => {
		const p = { ...players };
		delete p[socket.id];
		socket.emit("current-players", p);
	});

	allSockets.forEach(s => s.emit("player-connected", socket.id));

	allSockets.push(socket);

});

server.listen(10000, () => {
	console.log("server running at http://localhost");
});