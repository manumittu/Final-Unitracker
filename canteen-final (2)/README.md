Canteen Pre-Booking Module (Final build)
----------------------------------------

This package contains a ready-to-run canteen module with a React + MUI frontend and an Express + MongoDB backend.

Setup steps:

1) Ensure MongoDB is running locally on mongodb://127.0.0.1:27017
   (if not installed, install MongoDB Community edition and run mongod)

2) Start backend:
   cd canteen-final/backend
   npm install
   node server.js
   -> Backend will run at http://localhost:5000

3) Start frontend:
   cd canteen-final/frontend
   npm install
   npm start
   -> Frontend will run at http://localhost:3000

If you see issues about 'react-scripts' not found, run inside frontend:
   npm install react-scripts@5.0.1 --save

If Windows complains about commands, use PowerShell or Git Bash.
