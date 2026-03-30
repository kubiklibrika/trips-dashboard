FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/nginx.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create directories for SSL certificates
RUN mkdir -p /etc/nginx/ssl /var/www/certbot

# Create health check script
RUN echo '#!/bin/sh\nwget --quiet --tries=1 --spider http://localhost/health || exit 1' > /health.sh && \
    chmod +x /health.sh

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /health.sh

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
