# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.1

################################################################################
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app


################################################################################
FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci


################################################################################
FROM deps as build

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL


COPY server .
COPY server/prisma ./prisma

RUN --mount=type=cache,target=/root/.npm \
    npm install


RUN prisma migrate deploy
RUN npm run build


################################################################################
FROM base as final

ENV NODE_ENV production

USER node

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY server/package.json .

EXPOSE 8080

# Copy entrypoint.sh to the container
CMD npm run start
