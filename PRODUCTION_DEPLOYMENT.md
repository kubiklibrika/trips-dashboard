# Production Deployment Guide - Trips Dashboard

Полное руководство по развертыванию проекта на production сервере с доменом **paragurudash.blubs.ru**.

## 📋 Предварительные требования

- Ubuntu 22.04+ сервер
- SSH доступ к серверу
- Docker и Docker Compose установлены
- Доменное имя, указывающее на IP сервера (185.43.5.18)

## 🚀 Шаг 1: Подготовка переменных окружения

На вашем локальном компьютере создайте файл с переменными окружения:

```bash
# Скопируйте этот файл на сервер в /root/trips-dashboard/.env

# Database Configuration
MYSQL_ROOT_PASSWORD=ParaguruDash2026!@#
MYSQL_DATABASE=trips_dashboard
MYSQL_USER=trips_user
MYSQL_PASSWORD=TripsUser2026!@#
DB_PORT=3306

# Application Configuration
NODE_ENV=production
PORT=3000
APP_URL=https://paragurudash.blubs.ru

# Nginx Configuration
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443

# Manus OAuth Configuration
VITE_APP_ID=Y478AcgKFLZ2Ut57UzHwjN
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im
JWT_SECRET=ntkwj3SspT2f3cjQdaanu9

# Owner Configuration
OWNER_OPEN_ID=8KtEeRSgQeMV3FBCJHMZPd
OWNER_NAME=Maxim Zamchalov

# Google Drive Configuration
GOOGLE_DRIVE_CREDENTIALS={"type":"service_account","project_id":"viezdpg2026","private_key_id":"0a7b527a333bcac881d4bce8088cfe3c069478af","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDZVkY9unZQiJxJ\nQrMBnK35Opj+zCMYoBbUVajjVXu1kApno1JXyV8bJXSUAXku4Zf5M92GDCHyucp+\nQcyaDpFFUp96mZu8zWiuw3rWutmg9NrWEQIs+SE6h/XEsOHJgdfey4S67qV1m2qD\n3DTgD5J1QzWus7y+IGltMUuYQ81ZJPmyIYb68sDyxeW4WTbqolwfVQ0M1ij6PNnN\nxAWdNAGPOEd8DuuxdqlkorD/c/MX7d3poLhdO2UquewluxGVBQcN/ZGp8zf0YO0F\nQj/2pPqhMcIbCtoDTB+UWAfcPqcjUmY+Enb2oB9+9ZsmXWa5UrYnMTtMOYUp+EnS\nV2CS15uzAgMBAAECggEAAkr2Gb3VdHsLlGBHJmS0JWAfYaIXzHhuHFZZc5svNMFQ\nUQJcPxT0DC5Sss0/nzO22FZaPMIROyxc7su4k8yZ4IPYdhZfGhFqPj/4PtdZrkv2\n/fF6jDsGKMX5MmS8bfHYHeMYGKcz+qjQPszf3ULSIOQC5yMzEERrKE+Ti4egeZNt\nlQLJHxlrrk54Fyx4pgDNC5iy/1JY/gyV4XnQM4nLrp08i8eRD9oRZU9a+OSMMJGe\n9p2NA/abiHrsV4pWS7vBVRhAQLE9fi93dE2SdUCsS9ShchkoP1CP1QAAZW5Gnc3F\nXi1KsPU0yTqlEYG7aT22jzBN+SGpK2S6STcedlpSZQKBgQD1JwFmFs3bCkaWDdJo\nnT9vfI5UkibFaHuMNM+MX1siUKF4jua7PanRqdb9gSeig1UGaC8gIYL5v/azjBrj\nn7j1q63Z7Tr53ce/ESeDjzEJUmYo8SkvBDa2BgMYAR7pu0kft8EBeg4ZaX/Y2pAr\nD1GwbVnoBveXzJml3CKJRgEpnwKBgQDi9C/bZ8zlg/mz5PxUTt2cCZRUSwocrjIj\nQuC41r+3Cr2LgslLY4WeQn0ZfjAaRbeviCo/sUwI7yEhLwuZAGgp1hJpkdUy7Oq7\nIcghiCxW0ml0+kOJtAKeRp92D/z6kvzua38x4bumhEH/C+F2th17y78oHeCJrjVu\n2WbYB9I9bQKBgEhXQT9p3UcUqi2fWIaMWGrCm5FzK0O3iDWgY9ptTQw8NNnJeWap\nVJJNBub5lMOM86sXVUiq+uZN8jObVVf0CvVbusqDCZMwEcBdBIb62yKAEStltpxs\nJuThs0oDEqcwH+zfIXIZHU38ZsCMBlzegWGJcy1X2PoPYwuhgQN3B+LLAoGAYlza\n8QjH8SGF88Xm5tNXkO1F8FKli1CkQkwWAYZxiO+KvxBsFdSIcNL4TTg3uOtGdTla\ntkgtYCHkBfHR4PogKyGw0Th3Yp70DS7TAlV2ghqnwh9FbkUqbVbGffDn/+H85YiJ\nlCD1p3Hi+Js5mK3NkX3413Y7fvCWD/kBbdfV8vECgYBEQAW+iSMSQie46noj3VND\nqQgMt8P4JtS8oXjt6fd+EKZ5iCNiI8gpkx9w7FiI3/0A96B8bNGS3ni4vIWQWmau\nOkOyd6Imp/1WpoUUrRYrKEPRSFbKRQ2CzpJCmOv7APgu263T5664STgrcJrmzeQP\nn0563/PDL6OZQRO1DA0eWQ==\n-----END PRIVATE KEY-----\n","client_email":"trips-dashboard@viezdpg2026.iam.gserviceaccount.com","client_id":"105328349620799230756","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/trips-dashboard%40viezdpg2026.iam.gserviceaccount.com","universe_domain":"googleapis.com"}

# Manus API Configuration
BUILT_IN_FORGE_API_URL=https://forge.manus.ai
BUILT_IN_FORGE_API_KEY=YCwCE34V8MASL8Axfu9sgF
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai
VITE_FRONTEND_FORGE_API_KEY=YCwCE34V8MASL8Axfu9sgF

# Analytics
VITE_ANALYTICS_ENDPOINT=https://manus-analytics.com
VITE_ANALYTICS_WEBSITE_ID=5331d75b-6d61-4eb4-804d-6b74306903eb

# App Branding
VITE_APP_TITLE=Дашборд выездов
VITE_APP_LOGO=https://files.manuscdn.com/user_upload_by_module/web_dev_logo/310519663200453583/muZQUlNuWwNYIZFn.png
```

## 🔧 Шаг 2: Копирование .env файла на сервер

```bash
# На локальном компьютере
scp .env root@185.43.5.18:/root/trips-dashboard/

# Или используя sshpass
sshpass -p "oJ3mL5kC5rbH" scp .env root@185.43.5.18:/root/trips-dashboard/
```

## 🚀 Шаг 3: Запуск развертывания на сервере

```bash
# Подключитесь к серверу
ssh root@185.43.5.18

# Перейдите в директорию проекта
cd /root/trips-dashboard

# Распакуйте скрипты развертывания (если еще не распакованы)
tar -xzf deploy-script.tar.gz

# Сделайте скрипты исполняемыми
chmod +x deploy-production.sh nginx/generate-cert.sh nginx/init-letsencrypt.sh

# Запустите развертывание
./deploy-production.sh
```

## 🔐 Шаг 4: Настройка Let's Encrypt SSL сертификата

После успешного развертывания настройте Let's Encrypt для HTTPS:

```bash
# На сервере
cd /root/trips-dashboard

# Инициализируйте Let's Encrypt
./nginx/init-letsencrypt.sh paragurudash.blubs.ru zamchalov@gmail.com
```

## 📊 Проверка статуса

```bash
# Просмотреть статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Просмотреть логи приложения
docker-compose -f docker-compose.prod.yml logs -f app

# Просмотреть логи Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Просмотреть логи БД
docker-compose -f docker-compose.prod.yml logs -f db
```

## 🌐 Доступ к приложению

После успешного развертывания приложение будет доступно по адресам:

- **HTTP**: http://paragurudash.blubs.ru (автоматически перенаправляет на HTTPS)
- **HTTPS**: https://paragurudash.blubs.ru (после настройки Let's Encrypt)

## 🔄 Обновление приложения

Для обновления приложения на production:

```bash
cd /root/trips-dashboard

# Получить последние изменения
git pull origin main

# Пересобрать Docker образы
docker-compose -f docker-compose.prod.yml build --no-cache

# Перезапустить контейнеры
docker-compose -f docker-compose.prod.yml up -d

# Применить миграции БД если необходимо
docker-compose -f docker-compose.prod.yml exec -T app pnpm db:push
```

## 🛠 Полезные команды

### Остановить приложение
```bash
docker-compose -f docker-compose.prod.yml down
```

### Перезагрузить Nginx
```bash
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Выполнить команду в контейнере приложения
```bash
docker-compose -f docker-compose.prod.yml exec app pnpm <command>
```

### Резервная копия БД
```bash
docker-compose -f docker-compose.prod.yml exec db mysqldump -u trips_user -p trips_dashboard > backup.sql
```

### Восстановление из резервной копии
```bash
docker-compose -f docker-compose.prod.yml exec -T db mysql -u trips_user -p trips_dashboard < backup.sql
```

## 🔒 Безопасность

### Смена пароля root после развертывания

```bash
# На сервере
passwd

# Введите новый пароль
```

### Обновление пароля MySQL

Если нужно изменить пароли MySQL, отредактируйте `.env` файл и пересоздайте контейнер БД:

```bash
# Отредактируйте .env
nano .env

# Пересоздайте контейнер БД
docker-compose -f docker-compose.prod.yml down
docker volume rm trips-dashboard_mysql_data  # Это удалит данные!
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Решение проблем

### Контейнеры не запускаются

```bash
# Проверьте логи
docker-compose -f docker-compose.prod.yml logs

# Проверьте конфигурацию
docker-compose -f docker-compose.prod.yml config
```

### Ошибка подключения к БД

Убедитесь, что:
- MySQL контейнер запущен: `docker-compose -f docker-compose.prod.yml ps`
- Пароли в `.env` совпадают с конфигурацией
- Контейнеры находятся в одной сети

### Nginx не работает

```bash
# Проверьте конфигурацию Nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Перезагрузите Nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## 📚 Дополнительные ресурсы

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Базовая Docker конфигурация
- [NGINX_SETUP.md](./NGINX_SETUP.md) - Nginx конфигурация

## ✅ Чек-лист развертывания

- [ ] Docker и Docker Compose установлены на сервере
- [ ] Проект клонирован в `/root/trips-dashboard`
- [ ] `.env` файл создан и скопирован на сервер
- [ ] Скрипты развертывания распакованы и сделаны исполняемыми
- [ ] Запущен `./deploy-production.sh`
- [ ] Контейнеры успешно запущены
- [ ] Приложение доступно по HTTP
- [ ] Let's Encrypt сертификат инициализирован
- [ ] Приложение доступно по HTTPS
- [ ] Пароль root сменен на новый

---

**Версия**: 1.0.0  
**Последнее обновление**: Март 2026
