import { WS_API_URL } from "@/constants/settings";
import { io, Socket } from "socket.io-client";
import { tokenService } from "./tokenService";

let socket: Socket | null = null;

export const socketioService = {
  connect: async (group_id: number) => {
    const token = await tokenService.getToken()

    socket = io(WS_API_URL, {
      path: "/ws/socket.io",
      query: {token: token, group_id: group_id},
      transports: ["websocket"],
      reconnection: false,
    });

    socket.on("connect", () => {
      console.log("Conectado ao WebSocket");
    });

    socket.on("disconnect", (reason) => {
      console.log("Desconectado:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Erro na conexão:", err);
    });

    return socket;
  },


  onUserUpdate: (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on("update_user", callback);
  },

  onWaypointUpdate: (callback: (data: any) => void) => {
    if (!socket) return;
    socket.on("update_waypoint", callback);
  },

  
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};
