# Day4 Structured API Project

This project is a simple **Node.js + Express + MongoDB (Mongoose)** API.

##  What I Did

* Set up a basic Node.js project
* Installed required packages: **express, mongoose, dotenv, nodemon, cors**
* Created a clean project folder structure:

  * `/config` — MongoDB connection file
  * `/routes` — API routes
  * `/controllers` — Logic for API
  * `/models` — Mongoose schema
* Connected MongoDB using **MONGO_URI** stored in `.env`
* Created a sample API (`/api/student`) to add and get student details
* Tested the API in **Postman**
* Successfully ran the backend on: `http://localhost:5000`

## How to Run the Project

1. Install dependencies:

   ```bash
   npm install
   ```
2. Run the server:

   ```bash
   npm run dev
   ```
##  Environment Variable (.env)

```
MONGO_URI=your_mongo_connection_string
PORT=5000
```


Backend API setup + MongoDB connection + Routing + Controller + Testing.

You can now upload this whole folder to GitHub.
