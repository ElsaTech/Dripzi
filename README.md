# Dripzi Store - Premium Fashion E-Commerce Platform

Modern e-commerce platform built with Next.js 16, React 19, MongoDB, and cutting-edge web technologies. Features neumorphic design, 3D animations, mobile OTP authentication, and complete shopping experience.

## Key Features

- **Modern UI/UX**: Neumorphic design with premium typography (Playfair Display + Inter)
- **3D Animations**: Interactive Three.js elements and Framer Motion animations
- **Mobile-First**: Optimized for mobile devices with touch-friendly interactions
- **OTP Authentication**: Secure phone number-based login system
- **Product Management**: Full CRUD with Cloudinary image uploads
- **Shopping Cart**: Real-time updates with persistent storage
- **Admin Panel**: Dashboard with analytics and order management
- **SEO Optimized**: Structured data, sitemaps, and mobile optimization

## Tech Stack

- **Framework**: Next.js 16 (React 19.2)
- **Database**: MongoDB
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, React Three Fiber
- **Language**: TypeScript
- **Images**: Cloudinary
- **Authentication**: OTP-based

## Quick Start

See [SETUP.md](./SETUP.md) for detailed installation instructions.

```bash
npm install
# Configure .env.local with MongoDB and Cloudinary
npm run dev
```

## Project Structure

```
app/                 # Next.js App Router pages
components/          # React components
lib/                 # Server actions and utilities
public/              # Static assets
```

## Database Collections

- **users**: Phone authentication and profiles
- **products**: Catalog with images, pricing, inventory
- **carts**: User shopping carts
- **orders**: Order history and status
- **otp_sessions**: Authentication sessions

## Deployment

**Vercel (Recommended)**:
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

**Other platforms**: Netlify, Railway, AWS Amplify, Digital Ocean

## Performance & SEO

- Image optimization with Next.js
- Server-side rendering
- Structured data (JSON-LD)
- Mobile-first responsive design
- Code splitting and lazy loading

## Security

- HTTP-only cookies
- Protected API routes
- Input validation
- Admin-only access control

---

**Built with Next.js, React, MongoDB, and modern web technologies.**
