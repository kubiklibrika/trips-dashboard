# Nginx Reverse Proxy Setup Guide

Это руководство описывает настройку Nginx reverse proxy для улучшения безопасности и производительности.

## 📋 Что включено

- **Nginx Reverse Proxy** - балансировка нагрузки и кэширование
- **SSL/TLS поддержка** - HTTPS с самоподписанными или Let's Encrypt сертификатами
- **Security Headers** - защита от основных веб-уязвимостей
- **Gzip Compression** - сжатие трафика для быстрой передачи
- **Rate Limiting** - защита от DDoS атак
- **Health Checks** - мониторинг состояния сервисов
- **Certbot Integration** - автоматическое обновление SSL сертификатов

## 🚀 Быстрый старт

### 1. Разработка/Тестирование (с самоподписанным сертификатом)

```bash
# Сгенерировать самоподписанный сертификат
./nginx/generate-cert.sh

# Запустить контейнеры
docker-compose up -d
```

Приложение будет доступно:
- HTTP: http://localhost
- HTTPS: https://localhost (с предупреждением о сертификате)

### 2. Production (с Let's Encrypt)

```bash
# Клонируйте репозиторий и настройте .env
git clone https://github.com/kubiklibrika/trips-dashboard.git
cd trips-dashboard
cp .env.example .env
# Отредактируйте .env

# Инициализируйте Let's Encrypt сертификат
./nginx/init-letsencrypt.sh your-domain.com your-email@example.com

# Приложение уже запущено с действительным SSL сертификатом
```

## 🔒 Функции безопасности

### Security Headers

```
X-Frame-Options: SAMEORIGIN          # Защита от clickjacking
X-Content-Type-Options: nosniff       # Защита от MIME sniffing
X-XSS-Protection: 1; mode=block       # Защита от XSS атак
Strict-Transport-Security             # Принудительное HTTPS
Permissions-Policy                    # Контроль доступа к API браузера
```

### Rate Limiting

- **General endpoints**: 10 req/s (burst 20)
- **API endpoints**: 30 req/s (burst 50)
- **Возвращает**: 429 Too Many Requests

### SSL/TLS

- **Protocols**: TLSv1.2, TLSv1.3
- **Ciphers**: HIGH:!aNULL:!MD5
- **Session Cache**: 10m
- **HSTS**: 1 year (production)

## 📊 Производительность

### Gzip Compression

Включено для:
- text/plain, text/css, text/xml
- application/json, application/javascript
- font/truetype, font/opentype
- image/svg+xml

Уровень сжатия: 6 (оптимальный баланс)

### Caching

Статические ассеты кэшируются на 30 дней:
- JavaScript файлы
- CSS файлы
- Изображения (PNG, JPG, GIF, ICO, SVG)
- Шрифты (WOFF, WOFF2, TTF, EOT)

### Connection Pooling

- Upstream: least_conn балансировка
- Keep-alive: 32 соединения
- Worker connections: 1024

## 🔧 Конфигурация

### docker-compose.yml (Development)

```yaml
nginx:
  ports:
    - "80:80"
    - "443:443"
  environment:
    - NGINX_HTTP_PORT=80
    - NGINX_HTTPS_PORT=443
```

### docker-compose.prod.yml (Production)

```yaml
nginx:
  restart: always
  volumes:
    - ./nginx/ssl:/etc/nginx/ssl:ro
    - certbot_data:/var/www/certbot:ro

certbot:
  restart: always
  # Автоматическое обновление сертификата каждые 12 часов
```

## 📝 Команды

### Просмотр логов Nginx

```bash
docker-compose logs -f nginx
```

### Проверка конфигурации Nginx

```bash
docker-compose exec nginx nginx -t
```

### Перезагрузка Nginx

```bash
docker-compose exec nginx nginx -s reload
```

### Просмотр SSL сертификата

```bash
# Development
openssl x509 -in ./nginx/ssl/cert.pem -text -noout

# Production (Let's Encrypt)
docker-compose -f docker-compose.prod.yml exec certbot certbot certificates
```

### Обновление SSL сертификата вручную

```bash
docker-compose -f docker-compose.prod.yml exec certbot certbot renew --force-renewal
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## 🌐 Доменные имена

### Development

- localhost (HTTP/HTTPS)
- 127.0.0.1

### Production

Отредактируйте `nginx/nginx.conf` для вашего домена:

```nginx
server_name your-domain.com www.your-domain.com;
```

Или используйте переменную окружения в `docker-compose.prod.yml`:

```yaml
environment:
  - SERVER_NAME=your-domain.com
```

## 🔄 Балансировка нагрузки

Для масштабирования на несколько экземпляров приложения:

```bash
# Запустить 3 экземпляра приложения
docker-compose up -d --scale app=3
```

Nginx автоматически распределит трафик используя `least_conn` алгоритм.

## 📊 Мониторинг

### Health Check Endpoints

- Nginx: `/health` - проверка доступности приложения
- App: `http://localhost:3000/health` - прямая проверка приложения

Интервал проверки: 30 секунд
Timeout: 3 секунды
Retries: 3

### Метрики

Логи доступа сохраняются в:
- `/var/log/nginx/access.log` - запросы
- `/var/log/nginx/error.log` - ошибки

Просмотр логов:

```bash
docker-compose exec nginx tail -f /var/log/nginx/access.log
docker-compose exec nginx tail -f /var/log/nginx/error.log
```

## 🚨 Решение проблем

### HTTPS не работает

```bash
# Проверить сертификат
docker-compose exec nginx ls -la /etc/nginx/ssl/

# Сгенерировать новый сертификат
./nginx/generate-cert.sh
docker-compose restart nginx
```

### Nginx не запускается

```bash
# Проверить конфигурацию
docker-compose exec nginx nginx -t

# Просмотреть логи
docker-compose logs nginx
```

### Высокий трафик / Rate limiting

Если легитимные пользователи получают 429 ошибки, увеличьте лимиты в `nginx/nginx.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=20r/s;  # Было 10r/s
limit_req_zone $binary_remote_addr zone=api:10m rate=60r/s;      # Было 30r/s
```

### SSL сертификат истекает

Certbot автоматически обновляет сертификат, но можно проверить:

```bash
docker-compose -f docker-compose.prod.yml exec certbot certbot certificates
```

## 📚 Дополнительные ресурсы

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Certbot](https://certbot.eff.org/)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)

## 🔐 Best Practices

1. **Регулярно обновляйте Nginx** - используйте последние версии для безопасности
2. **Мониторьте логи** - проверяйте на подозрительную активность
3. **Используйте HTTPS** - всегда в production
4. **Ограничивайте доступ** - используйте firewall и rate limiting
5. **Резервные копии** - регулярно сохраняйте конфигурацию и сертификаты
6. **Тестируйте** - используйте SSL Labs для проверки конфигурации

## 📞 Поддержка

Если у вас возникли проблемы:
- Проверьте логи: `docker-compose logs nginx`
- Откройте issue на GitHub: https://github.com/kubiklibrika/trips-dashboard/issues
