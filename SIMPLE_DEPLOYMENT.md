# Упрощенное развертывание на Production сервере

Эта инструкция описывает быстрое развертывание проекта на production сервере без сборки Docker образов на сервере.

## Преимущества упрощенного подхода

- ✅ **Быстрое развертывание** - не требует сборки на сервере
- ✅ **Меньше ресурсов** - использует готовые образы и файлы
- ✅ **Надежнее** - сборка происходит локально, где все зависимости доступны
- ✅ **Простота** - минимум конфигурации

## Требования

### На локальной машине (перед развертыванием):

1. **Node.js и pnpm установлены**
2. **Проект собран локально:**
   ```bash
   pnpm install
   pnpm run build
   ```

### На production сервере:

1. **Docker установлен** (версия 20.10+)
2. **Docker Compose установлен** (версия 2.0+)
3. **Минимум 2GB свободной памяти**
4. **Минимум 5GB свободного места на диске**

## Пошаговое развертывание

### Шаг 1: Подготовка локально

Убедитесь, что проект собран:

```bash
cd /path/to/trips-dashboard
pnpm install
pnpm run build
```

Проверьте наличие необходимых папок:
- `dist/` - собранное backend приложение
- `client/dist/` - собранный frontend
- `drizzle/` - миграции БД

### Шаг 2: Загрузка на сервер

Скопируйте проект на сервер:

```bash
scp -r /path/to/trips-dashboard root@185.43.5.18:/root/
```

Или используйте git:

```bash
ssh root@185.43.5.18
cd /root
git clone https://github.com/kubiklibrika/trips-dashboard.git
cd trips-dashboard
```

### Шаг 3: Создание .env файла

На сервере создайте `.env` файл с необходимыми переменными:

```bash
ssh root@185.43.5.18
cd /root/trips-dashboard
nano .env
```

Скопируйте содержимое из `.env.example` и заполните значения:

```env
# Database
DB_ROOT_PASSWORD=your_secure_root_password
DB_NAME=trips_dashboard
DB_USER=trips_user
DB_PASSWORD=your_secure_db_password
DATABASE_URL=mysql://trips_user:your_secure_db_password@db:3306/trips_dashboard

# OAuth & Auth
JWT_SECRET=your_jwt_secret_key
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im

# Owner Info
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name

# APIs
BUILT_IN_FORGE_API_URL=https://forge.manus.ai
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai

# Google Drive
GOOGLE_DRIVE_CREDENTIALS={"type":"service_account",...}
GOOGLE_DRIVE_TOKEN=

# UI
VITE_APP_LOGO=https://your-logo-url.png
VITE_ANALYTICS_ENDPOINT=https://manus-analytics.com
VITE_ANALYTICS_WEBSITE_ID=your-analytics-id
```

### Шаг 4: Запуск развертывания

На сервере выполните:

```bash
cd /root/trips-dashboard
chmod +x deploy-simple.sh
./deploy-simple.sh
```

Скрипт:
1. Проверит наличие необходимых файлов
2. Создаст необходимые директории
3. Остановит старые контейнеры
4. Загрузит Docker образы
5. Запустит все сервисы

### Шаг 5: Проверка статуса

```bash
# Проверить статус контейнеров
docker-compose -f docker-compose-simple.yml ps

# Просмотреть логи
docker-compose -f docker-compose-simple.yml logs -f

# Проверить конкретный сервис
docker-compose -f docker-compose-simple.yml logs app
docker-compose -f docker-compose-simple.yml logs nginx
docker-compose -f docker-compose-simple.yml logs db
```

### Шаг 6: Проверить приложение

Откройте в браузере:
- `http://185.43.5.18` - основное приложение
- `http://185.43.5.18/health` - проверка здоровья

## Настройка HTTPS с Let's Encrypt

После успешного развертывания:

```bash
cd /root/trips-dashboard
./nginx/init-letsencrypt.sh paragurudash.blubs.ru zamchalov@gmail.com
```

Затем обновите nginx конфиг для HTTPS.

## Обновление приложения

Для обновления приложения на сервере:

```bash
# На локальной машине
pnpm run build
scp -r dist root@185.43.5.18:/root/trips-dashboard/
scp -r client/dist root@185.43.5.18:/root/trips-dashboard/

# На сервере
ssh root@185.43.5.18
cd /root/trips-dashboard
docker-compose -f docker-compose-simple.yml restart app
```

## Полезные команды

```bash
# Остановить все сервисы
docker-compose -f docker-compose-simple.yml down

# Перезагрузить приложение
docker-compose -f docker-compose-simple.yml restart app

# Очистить все данные (осторожно!)
docker-compose -f docker-compose-simple.yml down -v

# Просмотреть использование ресурсов
docker stats

# Подключиться к БД
docker exec -it trips-dashboard-db mysql -u trips_user -p trips_dashboard

# Просмотреть логи за последние 100 строк
docker-compose -f docker-compose-simple.yml logs --tail=100
```

## Решение проблем

### Контейнер не запускается

```bash
# Проверьте логи
docker-compose -f docker-compose-simple.yml logs app

# Убедитесь, что dist папка существует
ls -la dist/

# Убедитесь, что .env файл создан
cat .env
```

### Ошибка подключения к БД

```bash
# Проверьте статус БД контейнера
docker-compose -f docker-compose-simple.yml logs db

# Убедитесь, что DATABASE_URL правильный
grep DATABASE_URL .env

# Перезагрузите БД
docker-compose -f docker-compose-simple.yml restart db
```

### Nginx не может подключиться к приложению

```bash
# Проверьте, что приложение запущено
docker-compose -f docker-compose-simple.yml ps

# Проверьте логи nginx
docker-compose -f docker-compose-simple.yml logs nginx

# Убедитесь, что приложение слушает на порту 3000
docker exec trips-dashboard-app netstat -tlnp
```

## Безопасность

После развертывания:

1. **Смените пароль root:**
   ```bash
   passwd
   ```

2. **Настройте SSH ключи** вместо паролей

3. **Включите firewall:**
   ```bash
   ufw enable
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ```

4. **Регулярно обновляйте** Docker образы:
   ```bash
   docker-compose -f docker-compose-simple.yml pull
   docker-compose -f docker-compose-simple.yml up -d
   ```

## Мониторинг

Добавьте cron задачу для проверки здоровья приложения:

```bash
# Отредактируйте crontab
crontab -e

# Добавьте строку для проверки каждые 5 минут
*/5 * * * * curl -f http://localhost/health || docker-compose -f /root/trips-dashboard/docker-compose-simple.yml restart app
```

## Поддержка

Если у вас возникли проблемы:

1. Проверьте логи: `docker-compose -f docker-compose-simple.yml logs`
2. Убедитесь, что все переменные окружения установлены
3. Проверьте, что сервер имеет достаточно ресурсов
4. Попробуйте перезагрузить контейнеры: `docker-compose -f docker-compose-simple.yml restart`
