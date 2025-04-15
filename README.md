# 🛒 E-commerce Web Project

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://ecommerce-web-nu-six.vercel.app/)

## 📋 Overview

This is a modern e-commerce web application built with Next.js. The project features a clean, responsive UI with product listings, shopping cart functionality, user authentication and admin panel.

![E-commerce Website Screenshot](/example.png)

## ✨ Features

- 🏠 Responsive home page with featured products
- 🔍 Product search and filtering
- 🛍️ Product categories and detailed product pages
- 🛒 Shopping cart functionality
- 👤 User authentication and profile management
- 💳 Checkout process
- 🌙 Dark/Light mode toggle
- 📱 Mobile-friendly design
- 🔒 Admin panel

## 🚀 Tech Stack

- **Frontend**:
    - Next.js
    - React
    - Tailwind CSS
    - Shadcn UI Components

- **Backend**:
    - Next.js API Routes
    - PostegreSQL (Prisma)

- **Deployment**:
    - Vercel

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nosvemos/ecommerce-web.git
   cd ecommerce-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL= postegre_sql_database_connection_url
   
   NEXTAUTH_SECRET= nextauth_secret_key
   
   UPLOADTHING_TOKEN= uploadthing_api_token
   UPLOADTHING_SECRET= uploadthing_api_secret_key
   UPLOADTHING_APPID= uploadthing_api_app_id
   
   PAYPAL_CLIENT_ID= paypal_api_client_id
   PAYPAL_APP_SECRET= paypal_api_app_secret_key
   
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= stripe_api_public_key
   STRIPE_SECRET_KEY= stripe_api_secret_key
   STRIPE_WEBHOOK_SECRET= stripe_api_webhook_secret_key (Create webhook to listen type charge.succeeded)
    
   RESEND_API_KEY= resend_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
ecommerce-web/
├── src
│   ├── app/
│   │   ├── api/         # API routes
│   │   └── ...          # Pages
│   ├── components/      # Components
│   ├── db/              # Database connection pool and seeds
│   ├── email/           # Email function and template
│   ├── lib/             # Libaries folder
│   │   ├── actions/     # Server actions
│   │   ├── constants/   # Constant variables
│   │   └── ...          # Necessary lib files
│   ├── tests/           # Tests
│   ├── types/           # Typescript types
├── public/              # Static assets
├── prisma/              # Prisma schema and migrations
├── next.config.js       # Next.js configuration
├── .env.local           # Environment variables
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Creator: [Nosvemos](https://github.com/Nosvemos)

Project Link: [https://github.com/Nosvemos/ecommerce-web](https://github.com/Nosvemos/ecommerce-web)

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth](https://next-auth.js.org/)
- [Stripe API](https://docs.stripe.com/api/)
- [PayPal API](https://developer.paypal.com/api/rest/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)