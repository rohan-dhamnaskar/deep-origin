# Stage 1: Development
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app

# Install dependencies for development
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create docker-entrypoint.sh
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh&& chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port 3001
EXPOSE 3001

# Set environment variable for Next.js port
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]