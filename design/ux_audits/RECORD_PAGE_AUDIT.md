# UX Audit: Record Page (Cycling Tracker)

## 1. Interaction Logic
- **Current Flow**: Start -> (Timer/Location) -> Stop -> Save Dialog -> Save -> Reset.
- **Issue**: `stopRide` (Line 213) immediately clears timers but only shows the dialog. If the user cancels the dialog, the ride data is reset/lost without explicit confirmation or ability to resume.
- **Recommendation**:
    - **Pause vs Stop**: "Stop" should first **Pause** the ride.
    - **Resume Capability**: The "Save Dialog" should have a "Resume" option, not just "Save" or "Cancel". "Cancel" currently destroys data (Line 297).
    - **Accidental Touch**: Add a "Long Press to Stop" or "Slide to Stop" interaction to prevent accidental stops during a ride.

## 2. Location Tracking
- **API Usage**: `wx.startLocationUpdate` is correctly prioritized.
- **Feedback**: `locationStatus` exists but isn't clearly exposed to the user in the UI (only internal state).
- **Recommendation**: Show a GPS Signal Strength indicator (Green/Yellow/Red) based on `locationStatus` and accuracy.

## 3. Data Integrity
- **Crash Recovery**: If the app crashes or is killed by the OS (common in background), all `rideState` (in-memory `data`) is lost.
- **Recommendation**: Implement `wx.setStorageSync` to save `rideState` and `routePoints` every minute or on every location update. On `onLoad`, check for an incomplete ride and offer to restore it.

## 4. Visual Feedback
- **Map**: `mapReady` controls map visibility. The transition might be abrupt.
- **Recommendation**: Show a "Locating..." skeleton or loading state before the map center is acquired.

## 5. Performance
- **SetData Frequency**: `handleUpdate` (Line 108) calls `setData` on *every* location update (potentially 1Hz). As `routePoints` grows, sending the entire array to the view layer is expensive.
- **Recommendation**:
    - Use `wx.createMapContext().addMarkers()` and `moveAlong()` for smoother updates without full re-render.
    - Only `setData` the *new* points for the polyline if supported, or throttle the UI updates (e.g., update UI every 3 seconds, but record data every 1 second).
