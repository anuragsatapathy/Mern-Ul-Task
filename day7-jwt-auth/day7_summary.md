Day 7 - Auth Module Summary

1. Auth Routes
POST /api/auth/register

Creates a new user

Body → { name, email, password }

POST /api/auth/login

Checks email + password

Gives back a JWT token

GET /api/users (Protected)


2. Validation (Joi)
Register

name → required

email → must be a valid email

password → minimum length required

Login

email → required

password → required

3. Password Hashing

bcrypt.hash() → password becomes encrypted when registering

bcrypt.compare() → checks password during login

4. JSON Web Token (JWT)

Token created when user logs in

Signed using JWT_SECRET

5. Auth Middleware 

Checks token

If valid → user can access protected routes

If invalid → 401 error

6. User Service 

We created a separate service file:

createUser

findByEmail

findUserById

getAllUsers

7. Folder Structure Improved

We organized code into:

controllers

services

models

middleware

routes


8. Completed

Clean error handling

Proper Postman testing

All Auth + Task routes working