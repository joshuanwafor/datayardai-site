This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

The application requires password authentication to access the dashboard.


/////
- **Default Password**: `R9x!vT2z#Lm8@cQe`
- To customize, set the environment variable: `NEXT_PUBLIC_APP_PASSWORD`
- The password is stored in localStorage after successful login
- Click the "Logout" button in the dashboard header to sign out

### Routes

- `/` - Login page (home)
- `/app` - Protected dashboard (requires authentication)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_STREAM_URL=https://api.datayardai.com

# Authentication (optional - defaults to 'datayard2024')
NEXT_PUBLIC_APP_PASSWORD=your_custom_password_here
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Streaming Data

Realtime market data and arbitrage opportunities are streamed over WebSocket.

- Docs: see [`docs/streaming.md`](docs/streaming.md)
- Server base: `http://157.230.96.29`
- Client env: set `NEXT_PUBLIC_STREAM_URL` to your Socket.IO URL

