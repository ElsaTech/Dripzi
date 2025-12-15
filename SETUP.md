# Dripzi Store - Setup Guide

## Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account for image uploads

## Installation

1. **Install dependencies**
```bash
npm install
```

2. **Environment variables**
Create `.env.local`:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

3. **Create admin user**
After first user registration, set admin in MongoDB:
```javascript
db.users.updateOne(
  { phoneNumber: "+1234567890" },
  { $set: { isAdmin: true } }
)
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### SMS Integration
Replace console.log in `lib/actions/auth.ts`:
```typescript
// Send OTP via SMS provider (Twilio, AWS SNS, etc.)
await smsProvider.send({
  to: phoneNumber,
  message: `Your Dripzi verification code is: ${otp}`
})
```

## Tech Stack
- **Framework**: Next.js 16 (React 19.2)
- **Database**: MongoDB
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, React Three Fiber
- **Authentication**: OTP-based phone auth
- **Images**: Cloudinary
- **Language**: TypeScript