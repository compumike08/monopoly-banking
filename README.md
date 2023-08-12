# monopoly-banking

## Running App
You must set the following environment variable prior to running:
- MONOPOLY_APP_JWT_SECRET (this value should be base64 encoded)

### For Dev
Run the following command: `mvn spring-boot:run`

### For Prod
You must also set the following environment variables before starting the production application:
- POSTGRES_URL
- POSTGRES_PORT
- MONOPOLY_APP_DB_USER
- MONOPOLY_APP_DB_PASSWORD

Once environment variables are set, run the following command: `mvn spring-boot:run -Pprod`

## References
- Monopoly [Board game]. Hasbro.
- [Monopoly Icon](https://www.softicons.com/game-icons/brain-games-icons-by-quizanswers/monopoly-icon) - 
Copyright 2013 [QuizAnswers](https://www.softicons.com/designers/quizanswers),
Licensed under [CC Attribution 2.5 Generic](https://creativecommons.org/licenses/by/2.5/)
