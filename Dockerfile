# syntax=docker/dockerfile:1
# Web estática de alaCarta: se construye con Node y se sirve con nginx.
# Coolify detecta este Dockerfile y lo usa tal cual (ver docs/DESPLIEGUE.md).

# ---------- Build ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Las PUBLIC_* se hornean en el bundle durante el build. En Coolify se marcan como
# "Build Variable" para que lleguen aquí como build args.
ARG PUBLIC_FORM_ENDPOINT
ARG PUBLIC_ANALYTICS_PROVIDER
ARG PUBLIC_ANALYTICS_ID
ENV PUBLIC_FORM_ENDPOINT=$PUBLIC_FORM_ENDPOINT \
    PUBLIC_ANALYTICS_PROVIDER=$PUBLIC_ANALYTICS_PROVIDER \
    PUBLIC_ANALYTICS_ID=$PUBLIC_ANALYTICS_ID \
    ASTRO_TELEMETRY_DISABLED=1

RUN npm run build && node scripts/check-links.mjs

# ---------- Serve ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
