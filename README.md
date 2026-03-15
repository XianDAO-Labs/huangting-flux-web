# Huangting-Flux Web

> **The public frontend for the Huangting-Flux Agent Network.**
> Built with Next.js 15 + TailwindCSS + Recharts.

[![Protocol](https://img.shields.io/badge/Protocol-Huangting%20v7.8-gold)](https://github.com/XianDAO-Labs/huangting-protocol)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](LICENSE)

**Live Site**: [https://huangting.ai](https://huangting.ai)

---

## Architecture

```
XianDAO-Labs/
├── huangting-protocol     (Public)  ← Protocol + SDK + Standards
├── huangting-flux-web     (Public)  ← This repo: Next.js Frontend
└── huangting-flux-hub     (Private) ← FastAPI Backend
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — protocol introduction, value proposition |
| `/live` | Real-time Live Dashboard — WebSocket signal stream, charts |
| `/network` | Network Explorer — optimization strategies, recent signals |
| `/docs` | Documentation — SDK quickstart, API reference |

## Development

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_HUB_API_URL and NEXT_PUBLIC_HUB_WS_URL

# Run development server
pnpm dev
# → http://localhost:3000
```

## Environment Variables

```bash
NEXT_PUBLIC_HUB_API_URL=https://api.huangting.ai   # Flux Hub API URL
NEXT_PUBLIC_HUB_WS_URL=wss://api.huangting.ai      # Flux Hub WebSocket URL
```

## Deployment

```bash
# Build for production
pnpm build

# Deploy to Vercel (recommended)
vercel deploy
```

## Author

**Meng Yuanjing (Mark Meng)** — [XianDAO Labs](https://github.com/XianDAO-Labs)

## License

Apache 2.0 — See [LICENSE](LICENSE)
