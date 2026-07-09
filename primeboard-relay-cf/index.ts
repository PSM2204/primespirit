import { PrimeBoardRoom } from "./room";

export { PrimeBoardRoom };

export interface Env {
  ROOMS: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check / friendly landing page for plain browser visits
    const match = url.pathname.match(/^\/room\/([A-Za-z0-9_-]+)\/?$/);
    if (!match) {
      return new Response(
        "PrimeBoard relay is running. Connect via wss://<this-host>/room/<ROOM_CODE>",
        { status: 200 }
      );
    }

    // Each unique room code maps to its own Durable Object instance —
    // this is what keeps every classroom's roster/messages isolated
    // from every other classroom, with no shared state between them.
    const roomCode = match[1].toUpperCase();
    const id = env.ROOMS.idFromName(roomCode);
    const stub = env.ROOMS.get(id);
    return stub.fetch(request);
  },
};
