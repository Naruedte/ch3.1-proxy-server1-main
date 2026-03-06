# ============================
# Stage 1: Build Quasar SPA
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# ก๊อปโปรเจกต์ทั้งหมดเข้าไป (ใช้ .dockerignore ช่วยกันไฟล์เกิน)
COPY . .

# ติดตั้ง dependencies
RUN npm ci --legacy-peer-deps

# รับค่า Build Argument และส่งต่อเป็น Environment Variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# build Quasar SPA (output จะอยู่ที่ dist/spa)
RUN npm run build

# ============================
# Stage 2: Serve ด้วย Nginx
# ============================
FROM nginx:1.27-alpine

# ใช้ default Nginx config ไปเลย (ไม่ต้องลบ default.conf)
# แค่เอา static files ไปวางแทนที่ที่ /usr/share/nginx/html
COPY --from=builder /app/dist/spa /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
