# monopoly-banking

## Running App
### For Dev
Run the following command: `mvn spring-boot:run`

### For Prod
You must set the following environment variables before starting the production application:
- POSTGRES_URL
- POSTGRES_PORT
- MONOPOLY_APP_DB_USER
- MONOPOLY_APP_DB_PASSWORD

Once environment variables are set, run the following command: `mvn spring-boot:run -Pprod`
