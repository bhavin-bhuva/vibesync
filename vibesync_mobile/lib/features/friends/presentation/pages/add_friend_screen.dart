import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:vibesync_mobile/core/theme/design_tokens.dart';
import 'package:vibesync_mobile/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:dio/dio.dart';

class AddFriendScreen extends StatefulWidget {
  const AddFriendScreen({super.key});

  @override
  State<AddFriendScreen> createState() => _AddFriendScreenState();
}

class _AddFriendScreenState extends State<AddFriendScreen> {
  final _friendCodeController = TextEditingController();
  bool _isLoading = false;
  bool _showScanner = false;
  MobileScannerController? _scannerController;
  bool _hasScanned = false; // Prevent multiple scans

  Future<void> _sendFriendRequest(String code) async {
    if (code.isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final apiClient = context.read<AuthBloc>().apiClient;
      await apiClient.post('/friends/request', data: {
        'friendCode': code,
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Friend request sent!'),
            backgroundColor: Colors.green,
          ),
        );
        _friendCodeController.clear();
      }
    } on DioException catch (e) {
      if (mounted) {
        final message = e.response?.data['message'] ?? e.message ?? 'Failed to send request';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(message),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _handleQRScan(String? scannedData) {
    if (scannedData == null || scannedData.isEmpty || _hasScanned) return;

    // Prevent multiple scans
    _hasScanned = true;
    
    // Stop the scanner
    _scannerController?.stop();

    setState(() {
      _showScanner = false;
    });

    // Extract friend code from scanned data
    // Expected format: "vibesync:FRIEND-CODE"
    String friendCode = scannedData;
    if (scannedData.startsWith('vibesync:')) {
      friendCode = scannedData.substring(9); // Remove "vibesync:" prefix
    }

    _sendFriendRequest(friendCode);
  }

  void _initScanner() {
    _hasScanned = false;
    _scannerController = MobileScannerController(
      detectionSpeed: DetectionSpeed.normal,
      facing: CameraFacing.back,
    );
  }

  void _disposeScanner() {
    _scannerController?.dispose();
    _scannerController = null;
  }

  @override
  void dispose() {
    _friendCodeController.dispose();
    _disposeScanner();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_showScanner) {
      return _buildQRScanner();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Friend'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Scan QR Code Section
            const Text(
              'Scan QR Code',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            OutlinedButton(
              onPressed: () {
                if (kIsWeb) {
                  // Show message that scanning is not available on web
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('QR Scanning Not Available'),
                      content: const Text(
                        'QR code scanning is only available on mobile devices. Please use the manual entry option below to add friends by entering their friend code.',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('OK'),
                        ),
                      ],
                    ),
                  );
                } else {
                  _initScanner();
                  setState(() {
                    _showScanner = true;
                  });
                }
              },
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.all(20),
                side: BorderSide(color: Colors.grey.shade300),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: DesignTokens.primaryPurple.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      Icons.qr_code_scanner,
                      color: DesignTokens.primaryPurple,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Scan Friend\'s QR Code',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Use your camera to scan',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // OR Divider
            Row(
              children: [
                const Expanded(child: Divider()),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    'OR',
                    style: TextStyle(
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                const Expanded(child: Divider()),
              ],
            ),
            
            const SizedBox(height: 32),
            
            // Manual Entry Section
            const Text(
              'Enter Friend Code',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Ask your friend for their code',
              style: TextStyle(color: Colors.grey),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _friendCodeController,
              decoration: const InputDecoration(
                labelText: 'Friend Code',
                hintText: 'e.g. 2V32J-RPZGX-GQV2F',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person_add),
              ),
              textCapitalization: TextCapitalization.characters,
              onSubmitted: (value) => _sendFriendRequest(value.trim()),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _isLoading ? null : () => _sendFriendRequest(_friendCodeController.text.trim()),
              style: FilledButton.styleFrom(
                backgroundColor: DesignTokens.primaryPurple,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Text(
                      'Send Request',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQRScanner() {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          MobileScanner(
            controller: _scannerController,
            onDetect: (capture) {
              final List<Barcode> barcodes = capture.barcodes;
              for (final barcode in barcodes) {
                if (barcode.rawValue != null) {
                  _handleQRScan(barcode.rawValue);
                  break;
                }
              }
            },
            errorBuilder: (context, error, {child}) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      color: Colors.white,
                      size: 64,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Camera Error',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: Text(
                        error.errorDetails?.message ?? 'Failed to access camera. Please check permissions.',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          SafeArea(
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.black.withOpacity(0.5),
                  child: Row(
                    children: [
                      IconButton(
                        onPressed: () {
                          _disposeScanner();
                          setState(() {
                            _showScanner = false;
                          });
                        },
                        icon: const Icon(Icons.close, color: Colors.white),
                      ),
                      const Expanded(
                        child: Text(
                          'Scan QR Code',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(width: 48), // Balance the close button
                    ],
                  ),
                ),
                const Spacer(),
                // Instructions
                Container(
                  margin: const EdgeInsets.all(32),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'Point your camera at a friend\'s QR code',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
