# FeatherFold Frontend - Vercel Deployment

A modern React e-commerce frontend for FeatherFold, optimized for Vercel deployment.

## 🚀 Features

- **React 18** with modern hooks and patterns
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Lucide React** for beautiful icons
- **JWT Authentication** with Google OAuth support
- **Shopping Cart** with localStorage persistence
- **Wishlist/Favorites** management
- **Product browsing** and search
- **Order management** and tracking
- **Admin Dashboard** for store management
- **Responsive design** for all devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API
- **Authentication**: JWT with Google OAuth
- **State Management**: React Hooks, localStorage
- **Deployment**: Vercel

## 📦 Installation

```bash
npm install
```

## 🚀 Quick Start

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

## 🌐 Vercel Deployment

### Automatic Deployment
1. Push this code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a React app and deploy

### Manual Configuration
If needed, add these settings in Vercel dashboard:

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

## 📁 Project Structure

```
featherfold-frontend-vercel/
├── src/
│   ├── components/          # React components
│   │   ├── AdminDashboard.jsx
│   │   ├── Header.jsx
│   │   ├── Cart.jsx
│   │   └── ...
│   ├── services/           # API services
│   │   ├── api.js
│   │   └── razorpay.js
│   ├── utils/              # Utility functions
│   │   ├── dataUtils.js
│   │   └── ...
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── README.md               # This file
```

## 🔗 API Integration

The frontend connects to your Railway backend for:

- **Authentication**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **User Management**: `/api/customer/*`
- **Admin Operations**: `/api/admin/*`

Make sure to update `VITE_API_BASE_URL` in your environment variables to point to your Railway backend URL.

## 🎨 Customization

- **Colors**: Modify Tailwind config for brand colors
- **Components**: All components are modular and reusable
- **Styling**: Uses utility-first CSS with Tailwind
- **Layout**: Responsive design with mobile-first approach

## 📱 Features Overview

### Customer Features
- Product browsing and search
- Shopping cart management
- Wishlist/favorites
- Order placement and tracking
- Account management
- Google OAuth authentication

### Admin Features
- Dashboard with statistics
- Product management
- Order management
- User management
- Inventory tracking
- Sales analytics

## 🚀 Deployment Checklist

- [ ] Update `VITE_API_BASE_URL` to your Railway backend
- [ ] Configure Razorpay keys if using payments
- [ ] Test all API endpoints
- [ ] Verify responsive design
- [ ] Check authentication flow
- [ ] Test admin dashboard functionality

## 📞 Support

For issues related to:
- **Frontend**: Check this repository
- **Backend**: Check the `featherfold-backend-railway` repository
- **Deployment**: Refer to Vercel documentation

---

**Ready for Vercel deployment! 🚀**
