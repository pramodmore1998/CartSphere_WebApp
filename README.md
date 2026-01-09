CartSphere E-commerce Web App - 
A production-ready application built using Node.js, Express, MongoDB for backend and react for frontend, following MVC architecture, with secure authentication, modular structure, and scalable design.

Live Demo:- https://cartsphere-e-commerce.onrender.com/

Key Features:-
- User authentication (JWT)
- Role-based access (Admin / User)
- Product management (CRUD)
- Cart & checkout logic
- Order management
- PayPal payment gateway integration
- Secure API endpoints

Project Overview:- 
This project demonstrates how to build a clean, maintainable, and scalable backend using industry best practices such as:
- MVC architecture
- Role-based access & authentication
- Centralized middleware handling
- Environment-based configuration
- RESTful API design

Tech Stack:-
- Node.js
- Express.js
- MongoDB(Mongoose)
- JWT Authentication
- React.js

Project Structure:- 
Config/          → DB & environment config
controller/      → Business logic
middlewares/     → Auth & role protection
models/          → MongoDB schemas
routes/          → API routes
helpers/         → Reusable utilities
client/build/    → Production frontend build
server.js        → App entry point

API Endpoints:
Authentication: 
-POST   /api/v1/auth/register
-POST   /api/v1/auth/login
-POST   /api/v1/auth/

User(Protected):
-GET  /api/v1/auth/user-auth

Admin(Protected):
-GET /api/v1/auth/admin-auth

Orders:
-GET  /api/v1/auth/orders
-GET  /api/v1/auth/all-orders
-PUT  /api/v1/auth/order-status/:orderId

Cart:
-POST   /api/v1/cart/add
-GET    /api/v1/cart/get
-DELETE /api/v1/cart/remove/:pid
-PUT    /api/v1/cart/update

Category:
-POST   /api/v1/category/create-category
-PUT    /api/v1/category/update-category/:id
-GET    /api/v1/category/get-category
-GET    /api/v1/category/single-category/:slug
-DELETE /api/v1/category/delete-category/:id

Products:
-POST     /api/v1/product/create-product
-GET      /api/v1/product/get-product  
-GET      /api/v1/product/get-product/:slug
-GET      /api/v1/product/product-photo/:pid
-DELETE   /api/v1/product /delete-product/:pid
-PUT      /api/v1/product/update-product/:pid
-POST     /api/v1/product/product-filter
-GET      /api/v1/product /product-count
-GET      /api/v1/product /product-list/:page
-GET      /api/v1/product/search/:keyword
-GET      /api/v1/product /related-product/:pid/:cid
-GET      /api/v1/product /product-category/:slug
-GET      /api/v1/product/braintree/token
-POST     /api/v1/product/braintree/payment

Tools & Utilities:-
- Git & Github
- REST APIs
- Environment Variables
