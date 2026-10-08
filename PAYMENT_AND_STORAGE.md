# Payment and Storage Integration

## Payment

The backend exposes a provider-neutral payment-session endpoint. The current implementation supports two modes:

- Stripe: set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`. The server creates a Stripe Checkout session and redirects the customer after an order is created.
- Demo: when Stripe credentials are absent, the application completes a local demo payment and displays a clear message. This mode must not be used for real customer transactions.

Before production release, configure the payment provider's webhook endpoint, verify signatures, and mark the order paid only after the provider confirms the payment.

## Image storage

The current upload endpoint validates PNG, JPEG and WebP files, limits them to 5 MB, and stores them locally in `server/src/uploads`. For production, replace this storage adapter with a managed object store such as Azure Blob Storage, AWS S3 or Cloudinary, and add a signed URL or authenticated download policy.

Do not store raw private keys in source control. Keep all provider credentials in environment variables and restrict the upload route to authenticated users.
