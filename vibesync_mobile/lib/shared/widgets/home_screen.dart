import 'package:flutter/material.dart';
import '../../../core/theme/design_tokens.dart';

/// Home screen - main landing page after login
/// Will contain bottom navigation to Conversations, Friends, Status, Calls, Settings
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('VibeSync'),
        backgroundColor: DesignTokens.primaryPurple,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome to VibeSync!',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: DesignTokens.fontWeightBold,
                    color: DesignTokens.primaryPurple,
                  ),
            ),
            const SizedBox(height: DesignTokens.space16),
            Text(
              'Home Screen - Coming Soon',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: DesignTokens.gray500,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
