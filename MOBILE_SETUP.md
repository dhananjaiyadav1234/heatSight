# 📱 Mobile Setup Guide for HeatSight

## 🚀 Quick Mobile Access

### **Option 1: Direct Browser Access**
1. Open your mobile browser (Chrome, Safari, Firefox)
2. Navigate to: `http://localhost:5173` (when dev server is running)
3. The app will automatically adapt to mobile screen

### **Option 2: PWA Installation (Recommended)**
1. Open the app in Chrome/Safari on your mobile device
2. Look for the "Add to Home Screen" prompt
3. Tap "Add" to install as a mobile app
4. The app will now work like a native mobile app

### **Option 3: QR Code Access**
1. Run the development server: `npm run dev`
2. Look for the local network URL in the terminal
3. Use a QR code generator to create a QR code for that URL
4. Scan the QR code with your mobile device

## 📋 Mobile Features Implemented

### ✅ **Responsive Design**
- Mobile-first approach with Tailwind CSS
- Touch-friendly buttons (44px minimum)
- Optimized typography for mobile screens
- Safe area support for notched devices

### ✅ **Mobile Navigation**
- Collapsible hamburger menu
- Touch-optimized navigation items
- Smooth animations and transitions
- Proper spacing for thumb navigation

### ✅ **PWA Support**
- Installable as a mobile app
- Offline capability (basic)
- App shortcuts for quick access
- Native app-like experience

### ✅ **Performance Optimizations**
- Preconnect to external APIs
- Optimized images and assets
- Smooth scrolling on mobile
- Reduced bundle size

### ✅ **Mobile-Specific Features**
- Geolocation support
- Touch gestures
- Mobile-optimized forms
- Responsive maps

## 🧪 Testing on Mobile

### **Chrome DevTools (Recommended)**
1. Open Chrome DevTools (F12)
2. Click the "Toggle device toolbar" button (📱)
3. Select your target device (iPhone, Android, etc.)
4. Test all features in mobile view

### **Real Device Testing**
1. **iOS (iPhone/iPad)**
   - Use Safari for best experience
   - Test PWA installation
   - Check touch interactions

2. **Android**
   - Use Chrome for best experience
   - Test PWA installation
   - Verify geolocation permissions

### **Key Mobile Test Cases**
- [ ] Navigation menu opens/closes properly
- [ ] All buttons are touch-friendly
- [ ] Maps are responsive and interactive
- [ ] Forms are easy to fill on mobile
- [ ] Geolocation works correctly
- [ ] PWA installation works
- [ ] App shortcuts function properly

## 🔧 Mobile-Specific Configurations

### **Environment Variables**
```env
# Add these to your .env file for mobile optimization
VITE_MOBILE_OPTIMIZED=true
VITE_PWA_ENABLED=true
```

### **Vite Configuration**
The app is already configured for mobile with:
- Responsive viewport settings
- PWA manifest support
- Mobile-optimized build settings

## 📱 Mobile App Features

### **Heat Map**
- Pinch to zoom
- Touch to select locations
- Swipe navigation
- Mobile-optimized controls

### **Worker Safety**
- Touch-friendly form inputs
- Mobile-optimized location picker
- Responsive advice display
- Easy-to-read risk indicators

### **Transport Routes**
- Mobile-friendly route planning
- Touch-optimized map controls
- Responsive route display
- Easy navigation between routes

### **Analytics Dashboard**
- Mobile-optimized charts
- Touch-friendly controls
- Responsive data display
- Swipe navigation between sections

## 🚨 Troubleshooting

### **Common Mobile Issues**

1. **App not loading**
   - Check if dev server is running
   - Verify network connectivity
   - Clear browser cache

2. **Geolocation not working**
   - Ensure location permissions are granted
   - Check if HTTPS is enabled (required for geolocation)
   - Test on a real device (not just DevTools)

3. **PWA not installing**
   - Use HTTPS or localhost
   - Check if manifest.json is accessible
   - Verify all required icons are present

4. **Touch interactions not working**
   - Check if touch-action CSS is applied
   - Verify button sizes meet minimum requirements
   - Test on actual mobile device

### **Performance Issues**
- Enable mobile network throttling in DevTools
- Check bundle size and loading times
- Optimize images for mobile
- Use lazy loading for components

## 📞 Support

If you encounter mobile-specific issues:
1. Check the browser console for errors
2. Test on multiple devices/browsers
3. Verify all mobile meta tags are present
4. Ensure PWA manifest is valid

---

**Happy mobile testing! 📱✨** 