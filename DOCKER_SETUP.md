# Docker Setup Guide - Дашборд выездов

Это руководство поможет вам развернуть проект на своем сервере с помощью Docker.

## Предварительные требования

- Docker (версия 20.10+)
- Docker Compose (версия 1.29+)
- Git

## Быстрый старт

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/kubiklibrika/trips-dashboard.git
cd trips-dashboard
```

### 2. Создайте файл `.env`

Скопируйте переменные окружения из примера и заполните их своими значениями:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл и установите необходимые значения:

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_DATABASE=trips_dashboard
MYSQL_USER=trips_user
MYSQL_PASSWORD=your_secure_password
DB_PORT=3306

# Application Configuration
NODE_ENV=production
PORT=3000
APP_URL=https://your-domain.com

# Manus OAuth Configuration
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login
JWT_SECRET=your_secure_jwt_secret

# Owner Configuration
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name

# Google Drive Configuration
GOOGLE_DRIVE_CREDENTIALS={"type":"service_account","project_id":"..."}

# Manus API Configuration
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://manus-analytics.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# Branding
VITE_APP_TITLE=Дашборд выездов
VITE_APP_LOGO=https://example.com/logo.png
```

### 3. Запустите контейнеры

```bash
docker-compose up -d
```

Приложение будет доступно по адресу `http://localhost:3000`

### 4. Инициализируйте базу данных

При первом запуске база данных будет автоматически инициализирована. Если нужно выполнить миграции вручную:

```bash
docker-compose exec app pnpm db:push
```

## Команды Docker Compose

### Запустить контейнеры в фоне
```bash
docker-compose up -d
```

### Остановить контейнеры
```bash
docker-compose down
```

### Просмотреть логи приложения
```bash
docker-compose logs -f app
```

### Просмотреть логи базы данных
```bash
docker-compose logs -f db
```

### Перестроить образ
```bash
docker-compose build --no-cache
```

### Выполнить команду внутри контейнера
```bash
docker-compose exec app pnpm <command>
```

## Конфигурация для Production

### 1. Используйте надежный пароль для MySQL

```env
MYSQL_ROOT_PASSWORD=very_secure_password_123!@#
MYSQL_PASSWORD=another_secure_password_456!@#
```

### 2. Установите правильный APP_URL

```env
APP_URL=https://your-domain.com
```

### 3. Используйте SSL/TLS

Рекомендуется использовать Nginx или другой reverse proxy с SSL сертификатом перед Docker контейнером.

### 4. Регулярно создавайте резервные копии БД

```bash
docker-compose exec db mysqldump -u trips_user -p trips_dashboard > backup.sql
```

### 5. Используйте volume для постоянного хранилища данных

Docker Compose уже настроен с volume `mysql_data` для сохранения данных БД.

## Масштабирование

Для запуска нескольких экземпляров приложения:

```bash
docker-compose up -d --scale app=3
```

Используйте load balancer (Nginx, HAProxy) для распределения трафика.

## Решение проблем

### Контейнер не запускается

```bash
docker-compose logs app
```

### Ошибка подключения к БД

Убедитесь, что:
- MySQL контейнер запущен: `docker-compose ps`
- Пароли совпадают в `.env` файле
- Контейнеры находятся в одной сети: `docker network ls`

### Очистить всё и начать заново

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## Дополнительные ресурсы

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [Node.js Docker Image](https://hub.docker.com/_/node)

## Поддержка

Если у вас возникли проблемы, откройте issue на GitHub: https://github.com/kubiklibrika/trips-dashboard/issues
