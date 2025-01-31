Backend Setup Guide

Prerequisites

Ensure your system has the following installed:
Node.js (LTS)
MySQL Server
Git

1️⃣ Clone the Repository

git clone <your-repo-url> backend
cd backend

2️⃣ Create & Configure Environment Variables
Copy the environment config file:
cp .env.example .env

Edit .env and set up database credentials:

DATABASE_URL="mysql://root:<your-password>@localhost:3306/todo_db"
PORT=5000

If using MySQL Workbench or DBeaver, create a new database named todo_db.

3️⃣ Install Dependencies

npm install

4️⃣ Setup MySQL Database with Prisma

npx prisma migrate dev --name init
npx prisma generate

This will create the database and apply schema migrations.

5️⃣ Start MySQL Server (If Not Running)

Run the appropriate command based on your OS:

Windows:

net start MySQL80

Linux:

sudo systemctl start mysql

macOS:

brew services start mysql

6️⃣ Run the Backend Server

npm run dev

Your server should now be running at http://localhost:5000.