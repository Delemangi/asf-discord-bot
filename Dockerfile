# Development stage
FROM --platform=${BUILDPLATFORM} node:20-alpine AS development
WORKDIR /app

RUN apk add --no-cache git openjdk17 nodejs

COPY package.json package-lock.json ./
RUN npm i --ignore-scripts

COPY . ./
RUN npm run build

CMD [ "npm", "run", "dev" ]

# Production stage
FROM --platform=${TARGETPLATFORM} node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache

COPY package.json package-lock.json start.sh ./

COPY --from=development /app/node_modules ./node_modules
RUN npm prune --production

COPY --from=development /app/dist ./dist

CMD [ "npm", "run", "start" ]
