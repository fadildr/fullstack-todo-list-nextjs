# Menggunakan image Node.js resmi
FROM node:latest

# Mengatur working directory di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json
COPY package*.json ./

# Menginstall dependensi
RUN npm install

# Menyalin seluruh proyek ke dalam container
COPY . .

# Menjalankan aplikasi pada port 3000
CMD ["npm", "run", "dev"]
