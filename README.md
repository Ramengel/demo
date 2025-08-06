# TALEH SHAFIYEV EXAMPLE OF CODE

## EPL FORECAST - Telegram mini app

###### This project is not in production that is why i can share with some part of code

## Blockquotes

> Idea of the project user could try to forecast the result of the fixtures and earn crypto coins


### Modules

* Fixture module - in this module we can crud fixtures that in active contest
* contest module - this module create contest and assign fixtures to this contest
* prediction module - each user can create prediction on each fixture
* tg-user module - is module where user can login or authorize


### Packages

* inversifyJS / reflect-metadata - for Dependcy injection
* class-transformer & class validator to sanitize input data as DTO objects
* Prisma ORM
* express.js as HTTP server
* dotenv to read env file
* telegram-apps - to register or authorize users


## Database

Predictions table has combined unique key to prevent spam predictions on each fixture.
