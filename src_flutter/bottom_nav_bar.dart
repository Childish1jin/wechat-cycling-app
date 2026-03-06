import 'package:flutter/material.dart';

// --- Design Tokens ---
class CyclingColors {
  static const lightPrimary = Color(0xFF00C853);
  static const lightSurface = Color(0xFFFFFFFF);
  static const lightOnSurface = Color(0xFF1F2937);
  static const lightOnSurfaceVariant = Color(0xFF6B7280);

  static const darkPrimary = Color(0xFF4ADE80);
  static const darkSurface = Color(0xFF1F2937);
  static const darkOnSurface = Color(0xFFF9FAFB);
  static const darkOnSurfaceVariant = Color(0xFF9CA3AF);
}

class CyclingBottomNavBar extends StatefulWidget {
  final int selectedIndex;
  final ValueChanged<int> onDestinationSelected;

  const CyclingBottomNavBar({
    super.key,
    required this.selectedIndex,
    required this.onDestinationSelected,
  });

  @override
  State<CyclingBottomNavBar> createState() => _CyclingBottomNavBarState();
}

class _CyclingBottomNavBarState extends State<CyclingBottomNavBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 80),
      lowerBound: 0.9,
      upperBound: 1.0,
      value: 1.0,
    );
    _scaleAnimation = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
  }

  void _onTap(int index) {
    _controller.reverse().then((_) {
      widget.onDestinationSelected(index);
      _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = isDark ? CyclingColors.darkPrimary : CyclingColors.lightPrimary;
    final surfaceColor = isDark ? CyclingColors.darkSurface : CyclingColors.lightSurface;
    final unselectedColor = isDark ? CyclingColors.darkOnSurfaceVariant : CyclingColors.lightOnSurfaceVariant;

    return Container(
      decoration: BoxDecoration(
        color: surfaceColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          height: 64,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(5, (index) {
              final isSelected = widget.selectedIndex == index;
              final labels = ['首页', '路线', '记录', '社区', '我的'];
              final icons = [
                Icons.home_outlined,
                Icons.map_outlined,
                Icons.fiber_manual_record_outlined,
                Icons.people_outline,
                Icons.person_outline
              ];

              return Semantics(
                label: '${labels[index]}, ${isSelected ? "已选中" : "未选中"}',
                button: true,
                child: GestureDetector(
                  onTap: () => _onTap(index),
                  onTapDown: (_) => _controller.reverse(),
                  onTapCancel: () => _controller.forward(),
                  onTapUp: (_) => _controller.forward(),
                  child: ScaleTransition(
                    scale: _scaleAnimation,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Custom Top Indicator
                        if (isSelected)
                          Container(
                            width: 24,
                            height: 4,
                            decoration: BoxDecoration(
                              color: primaryColor,
                              borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(4),
                              ),
                            ),
                          )
                        else
                          const SizedBox(height: 4),
                        
                        const SizedBox(height: 4),
                        
                        // Icon
                        Icon(
                          icons[index],
                          size: 24,
                          color: isSelected ? primaryColor : unselectedColor,
                        ),
                        
                        const SizedBox(height: 4),
                        
                        // Label
                        Text(
                          labels[index],
                          style: TextStyle(
                            fontSize: 12,
                            color: isSelected ? primaryColor : unselectedColor,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
