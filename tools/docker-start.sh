#!/bin/sh
HOST=${HOST:-localhost}
EMAIL=${EMAIL:-name@example.com}

cat << EOF > /etc/Caddyfile
$HOST
gzip

root /var/www/html

log stdout

errors {
    log stdout
    404 404.html
}
EOF

caddy --conf /etc/Caddyfile --agree --email $EMAIL