import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:vibesync_mobile/core/theme/design_tokens.dart';
import 'package:vibesync_mobile/core/theme/theme_cubit.dart';
import 'package:vibesync_mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibesync_mobile/features/settings/presentation/widgets/settings_item.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _isEditing = false;
  late TextEditingController _nameController;
  late TextEditingController _statusController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _statusController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _statusController.dispose();
    super.dispose();
  }

  void _updateControllers(Map<String, dynamic> user) {
    if (!_isEditing) {
      if (_nameController.text != user['name']) {
        _nameController.text = user['name'] ?? '';
      }
      if (_statusController.text != user['status']) {
        _statusController.text = user['status'] ?? '';
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is Unauthenticated) {
          context.go('/login');
        }
      },
      builder: (context, state) {
        if (state is! Authenticated) {
          return const Center(child: CircularProgressIndicator());
        }

        final user = state.user;
        _updateControllers(user);

        return ListView(
          padding: const EdgeInsets.only(bottom: 24),
          children: [
            _buildProfileHeader(context, user),
            const SizedBox(height: 24),
            _buildSettingsList(context),
          ],
        );
      },
    );
  }

  Widget _buildProfileHeader(BuildContext context, Map<String, dynamic> user) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Stack(
            children: [
              CircleAvatar(
                radius: 50,
                backgroundImage: user['avatar'] != null
                    ? NetworkImage(user['avatar'])
                    : null,
                child: user['avatar'] == null
                    ? Text(
                        (user['name'] ?? 'U')[0].toUpperCase(),
                        style: const TextStyle(fontSize: 40),
                      )
                    : null,
              ),
              if (_isEditing)
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: DesignTokens.primaryPurple,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Theme.of(context).scaffoldBackgroundColor,
                        width: 2,
                      ),
                    ),
                    child: const Icon(
                      Icons.camera_alt,
                      size: 20,
                      color: Colors.white,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          if (!_isEditing) ...[
            Text(
              user['name'] ?? 'User',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              user['status'] ?? 'No status',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 16),
            OutlinedButton(
              onPressed: () {
                setState(() {
                  _isEditing = true;
                });
              },
              child: const Text('Edit Profile'),
            ),
          ] else ...[
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _statusController,
              decoration: const InputDecoration(
                labelText: 'Status',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      setState(() {
                        _isEditing = false;
                        _updateControllers(user); // Reset
                      });
                    },
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: FilledButton(
                    onPressed: () {
                      context.read<AuthBloc>().add(UpdateProfileEvent({
                        'name': _nameController.text,
                        'status': _statusController.text,
                      }));
                      setState(() {
                         _isEditing = false;
                      });
                    },
                    child: const Text('Save'),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSettingsList(BuildContext context) {
    final themeCubit = context.watch<ThemeCubit>();
    
    return Column(
      children: [
        SettingsItem(
          icon: Icons.qr_code,
          label: 'My QR Code',
          onTap: () => _showQRCode(context),
        ),
        SettingsItem(
          icon: Icons.notifications_outlined,
          label: 'Notifications',
          onTap: () {},
        ),
        SettingsItem(
          icon: Icons.lock_outline,
          label: 'Privacy',
          onTap: () {},
        ),
        SettingsItem(
          icon: Icons.palette_outlined,
          label: 'Appearance',
          value: _getThemeName(themeCubit.state),
          onTap: () => _showThemePicker(context),
        ),
        SettingsItem(
          icon: Icons.help_outline,
          label: 'Help',
          onTap: () {},
        ),
        const Divider(),
        ListTile(
          leading: const Icon(Icons.logout, color: Colors.red),
          title: const Text('Logout', style: TextStyle(color: Colors.red)),
          onTap: () {
             context.read<AuthBloc>().add(const LogoutEvent());
          },
        ),
      ],
    );
  }

  String _getThemeName(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light: return 'Light';
      case ThemeMode.dark: return 'Dark';
      case ThemeMode.system: return 'System Default';
    }
  }

  void _showThemePicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildThemeOption(context, ThemeMode.light, 'Light', Icons.wb_sunny_outlined),
              _buildThemeOption(context, ThemeMode.dark, 'Dark', Icons.nightlight_outlined),
              _buildThemeOption(context, ThemeMode.system, 'System Default', Icons.settings_brightness),
            ],
          ),
        );
      },
    );
  }

  Widget _buildThemeOption(BuildContext context, ThemeMode mode, String label, IconData icon) {
    final currentMode = context.read<ThemeCubit>().state;
    final isSelected = currentMode == mode;
    
    return ListTile(
      leading: Icon(icon, color: isSelected ? DesignTokens.primaryPurple : null),
      title: Text(
        label,
        style: TextStyle(
          color: isSelected ? DesignTokens.primaryPurple : null,
          fontWeight: isSelected ? FontWeight.bold : null,
        ),
      ),
      trailing: isSelected ? const Icon(Icons.check, color: DesignTokens.primaryPurple) : null,
      onTap: () {
        context.read<ThemeCubit>().updateTheme(mode);
        Navigator.pop(context);
      },
    );
  }

  void _showQRCode(BuildContext context) {
    final state = context.read<AuthBloc>().state;
    if (state is! Authenticated) return;
    
    final user = state.user;
    
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: const Color(0xFF1E1E2C), // Dark background matches frontend design
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'My QR Code',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, color: Colors.white12),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  // QR Code Container
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: QrImageView(
                      data: 'vibesync:${user['friendCode'] ?? user['id'] ?? 'unknown'}',
                      version: QrVersions.auto,
                      size: 200.0,
                      backgroundColor: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // User Name
                  Text(
                    user['name'] ?? 'User',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  
                  // Subtitle
                  Text(
                    'Scan this code to add me as a friend',
                    style: TextStyle(
                      color: Colors.grey[400],
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Friend Code Section with Copy Button
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF252538), // Slightly lighter dark background
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white12),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Your Friend Code',
                                style: TextStyle(
                                  color: Colors.grey[400],
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                user['friendCode'] ?? 'N/A',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.0,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy, color: Colors.white70),
                          tooltip: 'Copy Code',
                          onPressed: () {
                            if (user['friendCode'] != null) {
                              Clipboard.setData(ClipboardData(text: user['friendCode']));
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Friend code copied to clipboard'),
                                  duration: Duration(seconds: 2),
                                ),
                              );
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
