# PrimeBoard Relay — Cloudflare Workers (free, no Render)

This replaces the old Node/`ws` relay server. It runs on Cloudflare's edge
network via Workers + Durable Objects, on your **own free Cloudflare
account** — no PartyKit account, no Render, no credit card.

## Why this instead of Render
- **No cold start / sleep.** Render's free web services spin down after
  ~15 min idle and take 30–50s to wake up. Cloudflare Workers don't sleep —
  every request is handled by edge compute that's already warm globally.
- **Free tier is generous enough for 100 students.** 100,000 requests/day,
  and only *incoming* WebSocket messages count toward that — broadcasting
  out to everyone else in the room is free. Even an hour of continuous
  drawing (throttled to ~20 updates/sec) is well under the daily cap.
- **One Durable Object per classroom room code**, so rooms are fully
  isolated from each other automatically — no shared state to worry about.

## 1. Prerequisites
- Node.js 18+ installed
- A free Cloudflare account (https://dash.cloudflare.com/sign-up) — no
  credit card required for this

## 2. Install dependencies
```bash
cd primeboard-relay-cf
npm install
```

## 3. Log in to Cloudflare
```bash
npx wrangler login
```
This opens a browser window to authorize the CLI against your Cloudflare
account.

## 4. Deploy
```bash
npx wrangler deploy
```
Wrangler will print a URL like:
```
https://primeboard-relay.<your-subdomain>.workers.dev
```
That `<your-subdomain>` is unique to your Cloudflare account — copy the
full hostname.

## 5. Point PrimeBoard at it
In `primeboard.html`, find:
```js
window.PRIMEBOARD_RELAY_BASE_URL = "wss://primeboard-relay.YOUR-SUBDOMAIN.workers.dev";
```
and replace `YOUR-SUBDOMAIN` with the actual subdomain Wrangler gave you in
step 4. That's the only edit needed — the client already builds the
room-specific WebSocket URL from this base automatically.

## 6. Test it
- Open the board in two browser tabs (or two devices).
- Enter the **same room code** in both — Teacher in one, Student in the
  other.
- Draw as the teacher → it should appear on the student's screen almost
  instantly.
- Close the student tab, reopen with the same room code → the board should
  already show the teacher's existing content (new-joiner resync).
- No delay on first connect, unlike the old Render setup — Cloudflare
  Workers don't need to "wake up."

## Scaling notes for 100 concurrent students
- Each classroom room code = one Durable Object instance, so 100 students
  in one room all connect to the same object, which fans messages out to
  all of them. This is exactly the coordination pattern Durable Objects
  are designed for.
- If you ever run many simultaneous classrooms (many different room
  codes at once), each gets its own isolated Durable Object automatically
  — there's no manual sharding to configure.
- If you outgrow the free tier (very unlikely for a single-institution
  use case), Cloudflare's Workers Paid plan is $5/month flat with no
  cold starts either way — same code, no rewrite needed.
