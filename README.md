[![Coverage Status](https://coveralls.io/repos/github/WilliamsOhworuka/Banka-web-app/badge.svg?branch=develop)](https://coveralls.io/github/WilliamsOhworuka/Banka-web-app?branch=ft-signin-rest-endpoint-%23165203058)                  [![Build Status](https://travis-ci.org/WilliamsOhworuka/Banka-web-app.svg?branch=develop)](https://travis-ci.org/WilliamsOhworuka/Banka-web-app)
# BANKA

# Introduction
Banka is a light-weight core banking application that powers banking operations like account
creation, customer deposit and withdrawals. This app is meant to support a single bank, where
users can signup and create bank accounts online, but must visit the branch to withdraw or
deposit money.

### Features
```
Roles:
   - User: client
   - Staff: cashier or Admin
   ```
1. ```User can sign up.```
2. ```User can login.```
3. ``` User can create an account.```
4. ```User can view account transaction history.```
5. ```User can view a specific account transaction.```
6. ```User can reset password.```
7. ```cashier can debit user bank account.```
8. ```cashier can credit user bank account.```
9. ```Staff can view all user accounts.```
10. ```Staff can view a specific user bank account.```
11. ```Staff can activate or deactivate a bank account.```
12. ```Staff can delete a specific user bank account.```
13. ```Admin can create staff and admin user accounts.```

#### Screenshot of UI Template
![Alt text](./home%20page.JPG)
[Preview UI Template](https://williamsohworuka.github.io/Banka-web-app/UI/index.html)

### Getting Started
To get this app up and running on your system, git clone the repo and do ```npm install``` to install all the dependencies and develop dependencies required to adequately test ```npm test``` and run the app ```npm run start-dev```. You can also go to the Documentation to test out Routes. [Click here to view API Documentation](https://infinite-sea-96838.herokuapp.com/api/v1/swagger)

#### Prerequisites
- Install Postgressql
- Setup two separate database(test/develop database)

  N.B: Before running any test do ```npm run drop-table``` to drop previous test tables.

#### Technology Stack
 - Javascript(Node.js)
 - Javascript, HTML, CSS

#### Style guide
- Airbnb

### API Endpoints
  | Endpoint | Function | HTTP Method |
  | ----------- | ----------- |--------|
  | /api/v1/auth/signup | Sign up | POST |
  | /api/v1/auth/signin | Sign in | POST |
  | /api/v1/accounts | Bank account creation | POST |
  | /api/v1/accounts | View a list of all bank accounts | GET |
  | /api/v1/account/``<account-number>`` | Update bank account status | PATCH |
  | /api/v1/account/``<account-number>`` | Delete bank account | DELETE |
  | /api/v1/account/``<account-number>`` | View a specific bank account detail | GET |
  | /api/v1/accounts/``<account-number>``/transactions | View all transactions for a specific bank account | GET |
  | /api/v1/accounts?status=active | View all active bank accounts| GET |
  | /api/v1/accounts?status=dormant | View all dormant bank accounts | GET |
  | /api/v1/transactions/``<account-number>``/debit |debit bank account | POST |
  | /api/v1/transactions/``<account-number>``/credit | credit bank account | POST |
  | /api/v1/transactions/``<transaction-id>`` | View a specific transacxxxtion | GET |
  | /api/v1/user/``<user-email-address>``/accounts | View all accounts owned by specific user | GET |
  | /api/v1/auth/admin/create | Create user account| POST |

### Contributing
  To contribute to this codebase please go through the [Andela bestpractices wiki](https://github.com/andela/bestpractices)
