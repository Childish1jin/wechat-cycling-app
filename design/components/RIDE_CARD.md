# Ride Card Component - Design Specification

## 1. Overview
The "Ride Card" is the primary component for displaying ride history and route summaries. It must be highly readable, visual, and interactive.

## 2. Visual Structure (Vertical Stack)

### A. Header (Top)
- **Left**: Date & Time (e.g., "Oct 24 • 08:30 AM") - `Body Medium` / `OnSurfaceVariant`
- **Right**: Status Badge (if applicable) or "More" menu icon.

### B. Main Visual (Center)
- **Map Snapshot**: 16:9 Aspect Ratio.
- **Overlay**: Polyline of the route (Primary Color).
- **Corner Radius**: `Medium` (12dp).
- **Placeholder**: Gradient or generic topographic pattern if map fails to load.

### C. Stats Row (Bottom)
Three columns, equal width.
1.  **Distance**: `Display Large` (e.g., "42.5") + Unit "km" (`Label Small`)
2.  **Time**: `Title Medium` (e.g., "1h 45m") + Label "Duration"
3.  **Calories**: `Title Medium` (e.g., "850") + Label "Kcal"

### D. Footer (Actions)
- **Left**: "View Details" (Text Button, Primary Color).
- **Right**: "Share" (Icon Button).

## 3. States
- **Normal**: Surface Color background, Shadow-SM.
- **Pressed**: Scale to 0.98, Overlay slightly darker.
- **Loading**: Shimmer effect on Text and Map areas.

## 4. Code Implementation (Compose)

```kotlin
@Composable
fun RideCard(
    ride: Ride,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(CyclingTokens.Radius.Medium),
        colors = CardDefaults.cardColors(containerColor = CyclingTokens.Color.Surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = CyclingTokens.Spacing.M, vertical = CyclingTokens.Spacing.S)
    ) {
        Column(modifier = Modifier.padding(CyclingTokens.Spacing.M)) {
            // Header
            Text(
                text = formatDate(ride.startTime),
                style = MaterialTheme.typography.bodyMedium,
                color = CyclingTokens.Color.OnSurfaceVariant
            )
            
            Spacer(modifier = Modifier.height(CyclingTokens.Spacing.S))
            
            // Map Visual (Placeholder)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(16f / 9f)
                    .clip(RoundedCornerShape(CyclingTokens.Radius.Small))
                    .background(Color.LightGray) // Replace with AsyncImage
            )
            
            Spacer(modifier = Modifier.height(CyclingTokens.Spacing.M))
            
            // Stats Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                StatItem(value = ride.distance, unit = "km", label = "Distance")
                StatItem(value = ride.duration, unit = "min", label = "Time")
                StatItem(value = ride.calories, unit = "kcal", label = "Calories")
            }
        }
    }
}
```
