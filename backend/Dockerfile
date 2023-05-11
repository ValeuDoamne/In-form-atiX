FROM nginx:latest

# Install PHP and Postgres driver for PHP
RUN apt-get update && \
    apt-get install -y php-fpm php-pgsql && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Configure PHP-FPM
RUN sed -i "s/^listen =.*/listen = 0.0.0.0:9000/" /etc/php/7.4/fpm/pool.d/www.conf && \
    sed -i "s/^listen\.allowed_clients =.*/listen.allowed_clients = 127.0.0.1/" /etc/php/7.4/fpm/pool.d/www.conf && \
    echo "clear_env = no" >> /etc/php/7.4/fpm/pool.d/www.conf && \
    echo "catch_workers_output = yes" >> /etc/php/7.4/fpm/pool.d/www.conf

# Copy Nginx configuration files
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the PHP files to the container
COPY src/* /var/www/html/

# Change ownership of the PHP files to the nginx user
RUN mkdir -p /var/www/html
RUN chown -R nginx:nginx /var/www/html

# Start PHP-FPM and Nginx
CMD ["sh", "-c", "service php7.4-fpm start && nginx -g 'daemon off;'"]
