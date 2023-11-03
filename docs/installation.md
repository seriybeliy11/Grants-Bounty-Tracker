# Руководство по установке и запуску проекта

Это руководство предоставляет пошаговую инструкцию по установке и запуску проекта "Grant's & Bounties Tracker" на вашем локальном компьютере. Проект включает в себя фронтенд, сервер API, и парсеры данных, работающие с GitHub и Redis.

## Требования

Перед началом установки убедитесь, что у вас установлены следующие компоненты:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Установка проекта

1. Склонируйте репозиторий проекта с GitHub:

   ```bash
   git clone https://github.com/seriybeliy11/Grants-Bounty-Tracker.git
   cd Grants-Bounty-Tracker
   ```

2. Создайте файл `.env` в корневой директории проекта и добавьте в него свой GITHUB токен (замените `YOUR_GITHUB_TOKEN` на свой токен):

   ```
   GITHUB_TOKEN=YOUR_GITHUB_TOKEN
   ```

3. Перейдите в корневой каталог проекта и выполните следующую команду для запуска проекта с использованием Docker Compose:

   ```bash
   docker-compose up
   ```

   Это запустит контейнеры с Redis, фронтендом и контейнером с парсерами. Парсеры будут начинать сбор данных с GitHub и сохранять их в Redis.

4. После успешного запуска, фронтенд будет доступен по адресу [http://localhost:5173](http://localhost:5173).

## Завершение работы

Для завершения работы проекта выполните следующую команду в корневой директории проекта:

```bash
docker-compose down
```

Это остановит контейнеры и освободит ресурсы.

## Использование API

API-сервер доступен на порту 3000 локального хоста. Вы можете взаимодействовать с ним, чтобы получить данные о GitHub контрибьюторах и другие метрики. Примеры доступных маршрутов:

- [http://localhost:3000/github_contributors](http://localhost:3000/github_contributors)
- [http://localhost:3000/issue_comments](http://localhost:3000/issue_comments)
- [http://localhost:3000/closed_issues](http://localhost:3000/closed_issues)
- [http://localhost:3000/approved_issues](http://localhost:3000/approved_issues)
- [http://localhost:3000/issue_type](http://localhost:3000/issue_type)
- [http://localhost:3000/issue_stats](http://localhost:3000/issue_stats)
- [http://localhost:3000/labels_stats](http://localhost:3000/labels_stats)
- [http://localhost:3000/issue_rewards](http://localhost:3000/issue_rewards)
- [http://localhost:3000/count_issues](http://localhost:3000/count_issues)

## Рекомендации

- Убедитесь, что у вас достаточно ресурсов на компьютере для работы Docker-контейнеров.
- Перед использованием проекта удостоверьтесь, что ваш GITHUB токен имеет доступ к необходимым данным.
- По окончании работы с проектом не забудьте завершить его, чтобы освободить ресурсы.

Это завершает установку и запуск проекта "Grant's & Bounties Tracker". Вы можете использовать его для отслеживания и визуализации метрик GitHub контрибьюторов и других данных.