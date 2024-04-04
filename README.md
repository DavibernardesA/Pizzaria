## pizzeria API with typescript

# Pizzeria API🌐

Hello! My name is Davi Bernardes do Nascimento and this is my first project with [TypeScript](https://www.typescriptlang.org/) using Object Oriented Programming.

<div>
      <img src="https://github.com/DavibernardesA/sistema-bancario-backend/assets/133716733/c4b82294-d9b5-497c-9000-995573c08afe" style="width: 30%; height: auto;">
</div>

## Technologies Used🛠️

- Node.js
  -Express
- PostgreSQL (database)
- TypeScript
- Multer (for image upload)
- JWT (for authentication)
- Axios (for HTTP requests)
- Bcrypt (for password encryption)
- Dotenv (for setting environment variables)
- Nodemailer (for sending emails)
- Stripe (for credit card validation)
- TypeORM (for ORM)
- Prettier (for code formatting)
- EditorConfig (for code standardization)

## Environment Variable Settings✔️

Before running the code, make sure to correctly fill in the environment variables in the `.env` file.

```plaintext
# Serverport
PORT=3000

# Secure password
JWT_PASS=your_secure_password

# Data base
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=pizzeria_db

# Address of your pizzeria
ZIP_PIZZA=your_pizzeria_zip_code
# Google maps api key to calculate the distance from your pizzeria to the order location
API_KEY_MAPS=your_google_maps_api_key
# Distance from the motorcycle courier delivery area
ORDER_IN_KM=10

# File upload
ENDPOINT_BUCKET=your_bucket_endpoint
LOCATION_BUCKET=your_bucket_location

KEY_ID_BUCKET=your_bucket_key_id
KEY_NAME_BUCKET=your_bucket_key_name
APP_KEY_BUCKET=your_bucket_app_key

# Sending emails
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_NAME=Your Pizzeria Name
EMAIL_FROM=your_email@example.com

# Validation token for credit card charging
STRIPE_TOKEN=your_stripe_token
# Type of currency (need to be 'usd' | 'brl' | 'eur' | 'gbp' | 'jpy' | 'cad' | 'aud' | 'chf' | 'cny' | 'inr' | 'krw ' | 'mxn')
TYPE_CURRENCY=usd
```

## Database

This project uses PostgreSQL as the database. Make sure you have a PostgreSQL server configured and the correct credentials filled in the environment variables.

## Installation and Execution👆

To install dependencies, run:

```
npm install
```

To run the migrations and configure the database, run:

```
npm run migration:run
```

To start the server in development mode, run:

```
npm run dev
```

The server will be running on the port specified in the `PORT` environment variable.

## Author✍️

<a href=https://github.com/DavibernardesA>
<img src="https://github.com/DavibernardesA/sistema-bancario-backend/assets/133716733/6ba09c22-9eae-4601-980c-81533bd7b4f9" width="100px;" alt=""/>
<br>
<b>Davi Bernardes</b></a>
<br/>
Contact:

[![Linkedin Badge](https://img.shields.io/badge/-Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/davi-bernardes-do-nascimento-7b62a4274/)](https://www.linkedin.com/in/davi-bernardes-do-nascimento-7b62a4274/)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:davi.10bernardes@gmail.com)](mailto:davi.10bernardes@gmail.com)
