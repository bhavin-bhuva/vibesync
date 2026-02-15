import 'package:flutter/material.dart';

/// Bottom navigation bar with tabs for Chats, Status, Calls, and Settings
class BottomNavBar extends StatelessWidget {
  final String activeTab;
  final Function(String) onTabChange;

  const BottomNavBar({
    super.key,
    required this.activeTab,
    required this.onTabChange,
  });

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).viewPadding.bottom;
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A24),
        border: const Border(
          top: BorderSide(
            color: Color(0xFF2A2A3C),
            width: 1,
          ),
        ),
      ),
      child: Padding(
        padding: EdgeInsets.only(
          top: 12,
          bottom: bottomPadding > 0 ? bottomPadding : 12,
          left: 8,
          right: 8,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _NavButton(
              active: activeTab == 'chats',
              onTap: () => onTabChange('chats'),
              label: 'Chats',
              icon: Icons.chat_bubble_outline,
              activeIcon: Icons.chat_bubble,
            ),
            _NavButton(
              active: activeTab == 'status',
              onTap: () => onTabChange('status'),
              label: 'Status',
              icon: Icons.radio_button_unchecked,
              activeIcon: Icons.radio_button_checked,
            ),
            _NavButton(
              active: activeTab == 'calls',
              onTap: () => onTabChange('calls'),
              label: 'Calls',
              icon: Icons.phone_outlined,
              activeIcon: Icons.phone,
            ),
            _NavButton(
              active: activeTab == 'settings',
              onTap: () => onTabChange('settings'),
              label: 'Settings',
              icon: Icons.settings_outlined,
              activeIcon: Icons.settings,
            ),
          ],
        ),
      ),
    );
  }
}

class _NavButton extends StatelessWidget {
  final bool active;
  final VoidCallback onTap;
  final String label;
  final IconData icon;
  final IconData activeIcon;

  const _NavButton({
    required this.active,
    required this.onTap,
    required this.label,
    required this.icon,
    required this.activeIcon,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              active ? activeIcon : icon,
              color: active ? const Color(0xFF9333EA) : const Color(0xFF9CA3AF),
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: active ? const Color(0xFF9333EA) : const Color(0xFF9CA3AF),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
