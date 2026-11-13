# E-Pharmacist

E-Pharmacist provides a web interface and user-management API.

## Setup

1. Install dependencies with `npm install`.
2. Copy `config.env.example` to `config.env` and set the required values.
3. Start the server with `npm start`.

The application listens on port `4001` by default and requires MongoDB.

## User management API

Users can sign up with the `user`, `sme`, or `pharmacist` role. User-list and
user-management endpoints require an authenticated administrator. Bootstrap
the initial administrator through a trusted database operation; public signup
does not allow assigning the `admin` role.
