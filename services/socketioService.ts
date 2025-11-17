import { WS_API_URL } from "@/constants/settings";
import { io, Socket } from "socket.io-client";
import { tokenService } from "./tokenService";

class SocketIOService {
  private socket: Socket | null = null

  async connect(group_id: number) {
    const token = await tokenService.getToken()

    this.socket = io(WS_API_URL, {
      path: "/ws/socket.io",
      query: { token, group_id },
      transports: ["websocket"],
      reconnection: false,
    })

    this.socket.on("connect", () => console.log("Conectado ao WebSocket"))
    this.socket.on("disconnect", (reason) => console.log("Desconectado:", reason))
    this.socket.on("connect_error", (err) => console.error("Erro na conexão:", err))

    return this.socket
  }

  updateLocation(data: any) {
    if (!this.socket) return
    this.socket.emit("client_update_position", data)
  }

  stopSharing(data: any = null) {
    if (!this.socket) return
    this.socket.emit("client_stop_sharing", data)
  }

  disconnect() {
    if (!this.socket) return
    this.socket.disconnect()
    this.socket = null
  }

  onReceiveServerData(callback: (data: any) => void) {
    if (!this.socket) return
    this.socket.on("server_data", callback)
  }

  onUserUpdate(callback: (data: any) => void) {
    if (!this.socket) return
    this.socket.on("server_update_position", callback)
  }

  onUserDisconnect(callback: (data: any) => void) {
    if (!this.socket) return
    this.socket.on("client_disconnect", callback)
  }

  onWaypointUpdate(callback: (data: any) => void) {
    if (!this.socket) return
    this.socket.on("update_waypoint", callback)
  }

}

export const socketioService = new SocketIOService()
