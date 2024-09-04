
## Description
Backend of Nillion passkey system

# Prerequisite
- Node LTS 20.x or higher

## Installation

```bash
$ npm install
```

## Running the app

```bash
# run Mysql DBdocker
$ docker run -dit --network=host --name mysql_local -p 3306:3306 -e MYSQL_DATABASE=nillion -e MYSQL_USER=root -e MYSQL_PASSWORD=YXHqtIXwGqYAF6E -e MYSQL_ROOT_PASSWORD=YXHqtIXwGqYAF6E -v $PWD/db_data:/var/lib/mysql:rw --name mysqldb mysql:8.0.30

# copy file .env.example to .env file
$ cp .env.example .env

# into your database create database name nillion
# run migration create tables
$ npm run migration:run

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
