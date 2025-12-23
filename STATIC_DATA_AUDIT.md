# Static Data Audit - What's Still Not Dynamic

## ❌ Still Using Static/Mock Data

### 1. **Vouchers Page** (`src/app/vouchers/page.tsx`)
- ❌ Uses `mockVouchers` array
- ❌ No API calls
- **Note**: Voucher model doesn't exist in Prisma schema
- **Action**: Add Voucher model OR keep static for now

### 2. **Rider Dashboard** (`src/app/rider/dashboard/page.tsx`)
- ❌ Uses mock data for:
  - `todayStats` (earnings, deliveries, ratings)
  - `earningsData` (weekly earnings)
  - `weeklyPerformance` (hourly breakdown)
  - `availableOrders` (orders ready for pickup)
  - `activeDelivery` (current delivery)
  - `deliveryHistory` (past deliveries)
- ✅ APIs created (`/api/rider/stats`, `/api/rider/orders`) but NOT integrated
- **Action**: Integrate APIs into frontend

### 3. **Admin Dashboard** (`src/app/admin/dashboard/page.tsx`)
- ❌ Uses mock data for:
  - `stats` (revenue, users, restaurants, orders)
  - `revenueData` (monthly revenue)
  - `orderStatusData` (order distribution)
  - `users` (user list)
  - `restaurants` (restaurant list)
  - `orders` (order list)
- ✅ APIs created (`/api/admin/stats`, `/api/admin/users`, `/api/admin/restaurants`, `/api/admin/orders`) but NOT integrated
- **Action**: Integrate APIs into frontend

### 4. **Profile Page** (`src/app/profile/page.tsx`)
- ❌ Uses `mockProfile` object
- ❌ No API calls to fetch user profile
- ❌ No API calls to update profile
- **Action**: Create `/api/user/profile` API and integrate

### 5. **Settings Page** (`src/app/settings/page.tsx`)
- ❌ Uses `mockPaymentMethods` array
- ❌ No API calls for payment methods (though `/api/payment-methods` exists)
- ❌ No API calls for notification settings
- ❌ No API calls for security settings
- **Action**: Integrate existing APIs and create settings API

### 6. **Search Page** (`src/app/search/page.tsx`)
- ❌ Uses static `restaurants` array
- ❌ Filters/search works on static data only
- ✅ `/api/restaurants` exists with search capability
- **Action**: Replace static data with API call

### 7. **Cuisine Page** (`src/app/cuisine/[slug]/page.tsx`)
- ❌ Uses static `restaurants` array
- ❌ Filters by cuisine on static data only
- ✅ `/api/restaurants` exists with cuisine filter
- **Action**: Replace static data with API call

### 8. **Notifications Page** (`src/app/notifications/page.tsx`)
- ❌ Uses `mockNotifications` array
- ❌ No API calls
- **Action**: Create `/api/notifications` API

### 9. **Order Detail Page** (`src/app/orders/[id]/page.tsx`)
- ✅ Fetches order from API
- ❌ Review submission doesn't save to database (just shows toast)
- **Action**: Create `/api/orders/[id]/review` API

### 10. **Checkout Page** (`src/app/checkout/page.tsx`)
- ✅ Fetches addresses from API
- ✅ Fetches payment methods from API
- ⚠️ Has unused `mockAddresses` and `mockPaymentMethods` constants (can be removed)
- ✅ Payment method save doesn't persist (API returns demo message)
- **Note**: Payment methods API is simplified (no real persistence)

## ✅ Fully Dynamic (No Issues)

1. **Homepage** (`src/app/page.tsx`) - ✅
2. **User Dashboard** (`src/app/dashboard/page.tsx`) - ✅
3. **Orders Page** (`src/app/orders/page.tsx`) - ✅
4. **Restaurant Detail Page** (`src/app/restaurant/[id]/page.tsx`) - ✅
5. **Partner Dashboard** (`src/app/partner/dashboard/page.tsx`) - ✅
6. **Partner Profile** (`src/app/partner/profile/page.tsx`) - ✅
7. **Partner Restaurant Profile** (`src/app/partner/restaurant-profile/page.tsx`) - ✅

## 🔧 APIs Created But Not Integrated

1. `/api/rider/stats` - Created ✅, Not used in frontend ❌
2. `/api/rider/orders` - Created ✅, Not used in frontend ❌
3. `/api/admin/stats` - Created ✅, Not used in frontend ❌
4. `/api/admin/users` - Created ✅, Not used in frontend ❌
5. `/api/admin/restaurants` - Created ✅, Not used in frontend ❌
6. `/api/admin/orders` - Created ✅, Not used in frontend ❌

## 📋 Missing APIs (Need to Create)

1. `/api/user/profile` - GET/PUT user profile
2. `/api/user/settings` - GET/PUT user settings (notifications, security)
3. `/api/notifications` - GET notifications, mark as read
4. `/api/orders/[id]/review` - POST review for an order
5. `/api/vouchers` - GET vouchers (if adding Voucher model)

## 🎯 Priority Fix Order

### High Priority (Core Functionality)
1. ✅ Search page - Use `/api/restaurants` with search query
2. ✅ Cuisine page - Use `/api/restaurants` with cuisine filter
3. ✅ Order review submission - Create review API
4. ✅ Rider dashboard - Integrate existing APIs
5. ✅ Admin dashboard - Integrate existing APIs

### Medium Priority (User Experience)
6. Profile page - Create and integrate user profile API
7. Settings page - Integrate payment methods and create settings API
8. Notifications page - Create notifications API

### Low Priority (Nice to Have)
9. Vouchers page - Add Voucher model OR keep static
10. Remove unused mock constants from checkout page

