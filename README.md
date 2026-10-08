# ThreadForge — Custom T-Shirt MERN Store

ThreadForge is a full-stack custom T-shirt clothing brand built with MongoDB, Express.js, React.js and Node.js. It includes a responsive storefront, design studio, cart, checkout, order tracking, secure authentication and an administrator dashboard.

## Requirements

- Node.js 20+ and npm 10+
- MongoDB 7+
- The project is manually authored. Its source files must not contain copied or adapted AI-generated code.

## Quick start

1. Copy `.env.example` to `.env` and set `MONGODB_URI` plus `JWT_SECRET`.
2. Run `npm install`.
3. Run `npm run seed -w server`.
4. Run `npm run dev`.
5. Open `http://localhost:5173`.

The API runs at `http://localhost:5000/api`.

## Commands

- `npm run dev` — start API and Vite client
- `npm run build` — build the client and syntax-check the server
- `npm test` — run client and server tests
- `npm run seed -w server` — seed the product catalog

## Architecture

- `client/` — React storefront and customisation UI
- `server/src/models/` — Mongoose schemas
- `server/src/routes/` — Express REST API
- `server/src/services/` — payment integration adapter
- `server/src/middleware/` — authentication and error handling

## Product flow

1. Browse and filter products.
2. Choose a size and colour.
3. Open the customiser and preview text or artwork.
4. Add the custom item to the cart.
5. Complete delivery and payment details.
6. View the order in order history and admin dashboards.

## Configuration

- MongoDB: set `MONGODB_URI` and use a managed service in production.
- Authentication: set a long `JWT_SECRET`; use HTTPS and secure cookies in production.
- Payments: configure Stripe with `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`. Without credentials, the application runs a clearly labelled demo payment flow.
- Images: uploaded artwork is stored locally under `server/src/uploads`; use a managed object store such as Azure Blob Storage, AWS S3 or Cloudinary for production.

## Security notes

- Passwords are hashed with bcrypt.
- JWT tokens protect authenticated endpoints.
- Admin routes require the admin role.
- Server-side product prices, stock, custom-design constraints and order totals are validated.
- Production deployments should use a payment gateway provider, HTTPS, secure cookies, environment-specific secrets and a managed MongoDB service.

See `HUMAN_WRITTEN_CODE_DECLARATION.md` for the required manual-authorship declaration and `PAYMENT_AND_STORAGE.md` for integration details.
