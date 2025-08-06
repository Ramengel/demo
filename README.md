# TALEH SHAFIYEV EXAMPLE OF CODE

## EPL FORECAST - Telegram mini app

###### This project is not in production that is why i can share with some part of code

## Idea

> Idea of the project user can try to forecast the result of the fixtures and earn crypto coins

## Description

> This app allows to create contest and add football matches in contests.
> Then user can visit MY Telegram mini app and make prediction on the result of the match.
> The winner is the one who gave more accurate predictions

### Modules

- Fixture module - in this module we can crud fixtures that in active contest
- contest module - this module create contest and assign fixtures to this contest
- prediction module - each user can create prediction on each fixture
  - to Make prediction user request need pass TG middlewares to be sure credentials are valid
- tg-user module - is module where user can login or authorize

### Packages

- Typesript
- inversifyJS / reflect-metadata - for Dependcy injection
- class-transformer & class validator to sanitize input data as DTO objects
- Prisma.io ORM
- bull MQ
- express.js as HTTP server
- dotenv to read env file
- telegram-apps - to register or authorize users

## Database

Predictions table has combined unique key to prevent spam predictions on each fixture.
