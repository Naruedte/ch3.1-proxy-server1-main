# Stage 1: Build Quasar SPA
FROM node:20-alpine AS builder

WORKDIR /app

# เอา source code ทั้งโปรเจกต์เข้าไปก่อน
COPY package*.json ./
# Install dependencies but ignore scripts (skips quasar prepare during install)
RUN npm ci --legacy-peer-deps --ignore-scripts

COPY . .

# Accept build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build Quasar using npx to ensure CLI usage
RUN npx quasar build

# Stage 2: Production - serve ด้วย Nginx
FROM nginx:1.27-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ static ที่ build แล้วไปไว้ในโฟลเดอร์ของ nginx
COPY --from=builder /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
