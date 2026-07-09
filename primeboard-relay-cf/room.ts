interface ClientMeta {
  role: string;
  name: string;
}

// One instance of this class is created per unique room code (see index.ts).
// It holds the live WebSocket connections for everyone currently in that
// room and relays messages between them — this replaces the old Node/ws
// relay server that used to run on Render.
export class PrimeBoardRoom {
  state: DurableObjectState;
  clients: Map<WebSocket, ClientMeta>;

  constructor(state: DurableObjectState, _env: unknown) {
    this.state = state;
    this.clients = new Map();
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket upgrade", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    server.accept();
    this.clients.set(server, { role: "", name: "" });

    server.addEventListener("message", (event) => {
      this.handleMessage(server, event.data as string);
    });

    const cleanup = () => {
      this.clients.delete(server);
      this.broadcastRoster();
    };
    server.addEventListener("close", cleanup);
    server.addEventListener("error", cleanup);

    return new Response(null, { status: 101, webSocket: client });
  }

  private handleMessage(ws: WebSocket, raw: string) {
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return; // ignore malformed frames
    }

    if (data.type === "join") {
      this.clients.set(ws, { role: data.role ?? "", name: data.name ?? "" });
      this.broadcastRoster();
      return;
    }

    // Every other message type (scene-update, timer-update,
    // pages-structure, page-switch, spotlight-update) gets relayed
    // as-is to every other client currently connected to this room.
    const payload = JSON.stringify(data);
    for (const other of this.clients.keys()) {
      if (other !== ws) {
        try {
          other.send(payload);
        } catch {
          // Dead socket — it'll be cleaned up by its own close/error event
        }
      }
    }
  }

  private broadcastRoster() {
    const users = [...this.clients.values()].filter((u) => u.name);
    const payload = JSON.stringify({ type: "roster", users });
    for (const ws of this.clients.keys()) {
      try {
        ws.send(payload);
      } catch {
        // ignore
      }
    }
  }
}
