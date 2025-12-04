# 1) Base image
FROM node:18

# 2) Create working directory inside container
WORKDIR /app

# 3) Copy package files to install dependencies
COPY package.json package-lock.json ./

# 4) Install dependencies
RUN npm install

# 5) Copy rest of backend files
COPY . .

# 6) Expose port
EXPOSE 3000

# 7) Start server
CMD ["node", "app.js"]
