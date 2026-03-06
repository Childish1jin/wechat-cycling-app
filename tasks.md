# Remaining Tasks & Roadmap

## 1. Immediate Action Items (High Priority)
These tasks are critical for the stability and correct development environment of the project.

- [ ] **Environment Setup**
    - [ ] Fix `eslint` missing dependency error (`npm install eslint --save-dev` or check global config).
    - [ ] Verify `miniprogram/app.js` configuration for `baseUrl` matches the local/network IP of the Next.js backend.
- [ ] **Real Device Verification**
    - [ ] Test `wx.startLocationUpdate` permissions on Android/iOS (Foreground vs Background).
    - [ ] Verify GPS trajectory recording stability when screen is off/app is in background.
    - [ ] Test network connectivity between Mini Program (Phone) and Next.js Backend (PC) on the same LAN.

## 2. Feature Refinements (Medium Priority)
Tasks to upgrade "working" features to "production-ready" quality.

- [ ] **Community Module**
    - [ ] **Backend**: Update Prisma schema to support User-to-User relationships (Followers/Following).
    - [ ] **API**: Create endpoints for `followUser` and `unfollowUser`.
    - [ ] **Frontend**: Replace local storage (`following_users`) logic with API calls to sync follow status across devices.
- [ ] **Home Module**
    - [ ] **Weather**: Replace hardcoded weather data in `home.js` with a real third-party Weather API (e.g., QWeather/HeWeather).
    - [ ] **Recommendations**: Implement logic to suggest routes based on actual weather (e.g., "Windy" -> "Sheltered Route").
- [ ] **Record Module**
    - [ ] **GPS Optimization**: Implement a basic path smoothing algorithm (e.g., distance threshold filtering or Kalman filter) to reduce GPS drift.
    - [ ] **Data Integrity**: Handle network failures during ride upload (e.g., save locally and retry later).

## 3. Future Enhancements (Roadmap)
Planned features for v2.0 or later.

- [ ] **Hardware Integration**
    - [ ] Implement Bluetooth Low Energy (BLE) connection for Heart Rate Monitors.
    - [ ] Display real-time heart rate zones in the Record page.
- [ ] **Visual Experience**
    - [ ] Add trajectory playback animation on the Result/History page.
    - [ ] Implement "Share to Moments" image generation (Canvas).
- [ ] **Advanced Analytics**
    - [ ] Weekly/Monthly riding reports (Charts).
    - [ ] Achievement system (Badges logic).

## 4. Maintenance
- [ ] **Code Quality**: Run full linting and fix style issues.
- [ ] **Testing**: Add unit tests for critical utility functions (e.g., distance calculation, formatters).
