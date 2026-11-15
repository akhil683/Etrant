# ------------------------
# Base build stage
# ------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json ./

# Install deps
RUN pnpm install

# Copy rest of the app
COPY . .

# ---- RECEIVE ENV SECRETS FROM BUILD ARGS ----
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG AUTH_SECRET
ARG DATABASE_URL
ARG GEMINI_API_KEY
ARG GEMINI_API_KEY_MAIN
ARG NEXT_BASE_URL
ARG SMTP_HOST
ARG SMTP_PORT
ARG SMTP_USER
ARG SMTP_PASS
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ARG DODO_PAYMENTS_API_KEY
ARG DODO_PAYMENTS_WEBHOOK_KEY
ARG DODO_PAYMENTS_ENVIRONMENT
ARG DODO_PRODUCT_ID_PRO
ARG DODO_PRODUCT_ID_MAX
ARG DODO_PRODUCT_ID_PRO_STUDENT
ARG DODO_PRODUCT_ID_MAX_STUDENT

# ---- WRITE THEM TO .env.production ----
RUN echo "AUTH_GOOGLE_ID=$AUTH_GOOGLE_ID" >> .env.production
RUN echo "AUTH_GOOGLE_SECRET=$AUTH_GOOGLE_SECRET" >> .env.production
RUN echo "AUTH_SECRET=$AUTH_SECRET" >> .env.production
RUN echo "DATABASE_URL=$DATABASE_URL" >> .env.production
RUN echo "GEMINI_API_KEY=$GEMINI_API_KEY" >> .env.production
RUN echo "GEMINI_API_KEY_MAIN=$GEMINI_API_KEY_MAIN" >> .env.production
RUN echo "NEXT_BASE_URL=$NEXT_BASE_URL" >> .env.production
RUN echo "SMTP_HOST=$SMTP_HOST" >> .env.production
RUN echo "SMTP_PORT=$SMTP_PORT" >> .env.production
RUN echo "SMTP_USER=$SMTP_USER" >> .env.production
RUN echo "SMTP_PASS=$SMTP_PASS" >> .env.production
RUN echo "NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY" >> .env.production
RUN echo "NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST" >> .env.production
RUN echo "DODO_PAYMENTS_API_KEY=$DODO_PAYMENTS_API_KEY" >> .env.production
RUN echo "DODO_PAYMENTS_WEBHOOK_KEY=$DODO_PAYMENTS_WEBHOOK_KEY" >> .env.production
RUN echo "DODO_PAYMENTS_ENVIRONMENT=$DODO_PAYMENTS_ENVIRONMENT" >> .env.production
RUN echo "DODO_PRODUCT_ID_PRO=$DODO_PRODUCT_ID_PRO" >> .env.production
RUN echo "DODO_PRODUCT_ID_MAX=$DODO_PRODUCT_ID_MAX" >> .env.production
RUN echo "DODO_PRODUCT_ID_PRO_STUDENT=$DODO_PRODUCT_ID_PRO_STUDENT" >> .env.production
RUN echo "DODO_PRODUCT_ID_MAX_STUDENT=$DODO_PRODUCT_ID_MAX_STUDENT" >> .env.production

# Build Next.js
RUN pnpm build

# ------------------------
# Production runtime stage
# ------------------------
FROM node:20-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm

# Copy built output
COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]
