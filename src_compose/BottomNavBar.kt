package com.example.cyclingapp.ui.components

import android.content.res.Configuration
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.cyclingapp.R // Assume R is generated

// --- Design Tokens (Mapped from tokens.json) ---
object CyclingTokens {
    val IndicatorHeight = 4.dp
    val IndicatorRadius = 4.dp
    val IconSize = 24.dp
    val LabelSize = 12.sp
    
    object Light {
        val Primary = Color(0xFF00C853)
        val Surface = Color(0xFFFFFFFF)
        val OnSurface = Color(0xFF1F2937)
        val OnSurfaceVariant = Color(0xFF6B7280)
        val Indicator = Color(0xFFDCFCE7)
    }
    
    object Dark {
        val Primary = Color(0xFF4ADE80)
        val Surface = Color(0xFF1F2937)
        val OnSurface = Color(0xFFF9FAFB)
        val OnSurfaceVariant = Color(0xFF9CA3AF)
        val Indicator = Color(0xFF064E3B)
    }
}

// --- Navigation Item Data ---
sealed class Screen(val route: String, val label: String, val iconRes: Int) {
    object Home : Screen("home", "首页", R.drawable.ic_home)
    object Routes : Screen("routes", "路线", R.drawable.ic_routes)
    object Record : Screen("record", "记录", R.drawable.ic_record)
    object Community : Screen("community", "社区", R.drawable.ic_community)
    object Profile : Screen("profile", "我的", R.drawable.ic_profile)
}

@Composable
fun CyclingBottomNavBar(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    isDarkTheme: Boolean = androidx.compose.foundation.isSystemInDarkTheme()
) {
    val colors = if (isDarkTheme) CyclingTokens.Dark else CyclingTokens.Light
    
    NavigationBar(
        containerColor = colors.Surface,
        contentColor = colors.OnSurfaceVariant,
        tonalElevation = 8.dp,
        modifier = Modifier.systemBarsPadding() // Safe Area
    ) {
        val screens = listOf(
            Screen.Home,
            Screen.Routes,
            Screen.Record,
            Screen.Community,
            Screen.Profile
        )

        screens.forEach { screen ->
            val selected = currentRoute == screen.route
            val interactionSource = remember { MutableInteractionSource() }
            val isPressed by interactionSource.collectIsPressedAsState()
            
            // 80ms Scale Animation
            val scale by animateFloatAsState(
                targetValue = if (isPressed) 0.9f else 1f,
                animationSpec = tween(durationMillis = 80),
                label = "Button Scale"
            )

            NavigationBarItem(
                selected = selected,
                onClick = { onNavigate(screen.route) },
                icon = {
                    Column(
                        horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                    ) {
                        // Top Indicator for Selected State
                        if (selected) {
                            Box(
                                modifier = Modifier
                                    .width(24.dp) // Match icon width roughly
                                    .height(CyclingTokens.IndicatorHeight)
                                    .clip(RoundedCornerShape(
                                        topStart = CyclingTokens.IndicatorRadius, 
                                        topEnd = CyclingTokens.IndicatorRadius
                                    ))
                                    .background(colors.Primary)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                        } else {
                             Spacer(modifier = Modifier.height(8.dp)) // Placeholder
                        }
                        
                        Icon(
                            painter = painterResource(id = screen.iconRes),
                            contentDescription = null, // Handled by parent semantics
                            modifier = Modifier.size(CyclingTokens.IconSize),
                            tint = if (selected) colors.Primary else colors.OnSurfaceVariant
                        )
                    }
                },
                label = {
                    Text(
                        text = screen.label,
                        fontSize = CyclingTokens.LabelSize,
                        color = if (selected) colors.Primary else colors.OnSurfaceVariant,
                        maxLines = 1
                    )
                },
                modifier = Modifier
                    .scale(scale)
                    .semantics(mergeDescendants = true) {
                        // TalkBack Order: Icon -> Label -> State (Handled by merge)
                        contentDescription = "${screen.label}, ${if (selected) "已选中" else "未选中"}"
                    },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = Color.Transparent, // Custom indicator used
                    selectedIconColor = colors.Primary,
                    selectedTextColor = colors.Primary,
                    unselectedIconColor = colors.OnSurfaceVariant,
                    unselectedTextColor = colors.OnSurfaceVariant
                ),
                interactionSource = interactionSource,
                alwaysShowLabel = true
            )
        }
    }
}

@Preview(showBackground = true, uiMode = Configuration.UI_MODE_NIGHT_NO)
@Composable
fun LightPreview() {
    CyclingBottomNavBar(currentRoute = "home", onNavigate = {})
}

@Preview(showBackground = true, uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
fun DarkPreview() {
    CyclingBottomNavBar(currentRoute = "record", onNavigate = {})
}
