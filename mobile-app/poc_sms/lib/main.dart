import 'package:flutter/material.dart';
import 'package:flutter_sms_inbox/flutter_sms_inbox.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SMS OTP Reader',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const SMSReaderPage(title: 'SMS OTP Reader'),
    );
  }
}

class SMSReaderPage extends StatefulWidget {
  const SMSReaderPage({super.key, required this.title});

  final String title;

  @override
  State<SMSReaderPage> createState() => _SMSReaderPageState();
}

class _SMSReaderPageState extends State<SMSReaderPage> {
  final TextEditingController _otpController = TextEditingController();
  String _lastSMSMessage = '';
  bool _isListening = false;
  bool _isSending = false;
  String _statusMessage = 'Ready to receive SMS';
  final SmsQuery _query = SmsQuery();
  Timer? _smsCheckTimer;

  @override
  void initState() {
    super.initState();
    _requestPermissions();
  }

  @override
  void dispose() {
    _stopListening();
    _smsCheckTimer?.cancel();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _requestPermissions() async {
    try {
      // Request SMS permissions
      final smsPermission = await Permission.sms.request();

      if (smsPermission.isGranted) {
        setState(() {
          _statusMessage = 'SMS permission granted. Starting to listen...';
        });
        await _startListening();
      } else {
        setState(() {
          _statusMessage =
              'SMS permission denied. Please grant permission to read SMS.';
        });
      }
    } catch (e) {
      setState(() {
        _statusMessage = 'Error requesting permissions: $e';
      });
    }
  }

  Future<void> _startListening() async {
    try {
      // Start periodic checking for new SMS messages
      _smsCheckTimer = Timer.periodic(const Duration(seconds: 2), (
        timer,
      ) async {
        await _checkForNewSMS();
      });

      setState(() {
        _isListening = true;
        _statusMessage = 'Listening for SMS messages...';
      });
    } catch (e) {
      setState(() {
        _statusMessage = 'Error starting SMS listener: $e';
      });
    }
  }

  // Check for new SMS messages
  Future<void> _checkForNewSMS() async {
    try {
      List<SmsMessage> messages = await _query.querySms(
        kinds: [SmsQueryKind.inbox],
        count: 5, // Check last 5 messages
      );

      if (messages.isNotEmpty) {
        // Get the most recent message
        SmsMessage latestMessage = messages.first;

        // Extract OTP from the message
        String? otp = _extractOTPFromSMS(latestMessage.body ?? '');
        if (otp != null && otp.isNotEmpty) {
          // Check if this is a new OTP (different from current)
          if (_otpController.text != otp) {
            print('New OTP found: $otp');
            setState(() {
              _otpController.text = otp;
              _lastSMSMessage =
                  'From: ${latestMessage.address ?? 'Unknown'}\nMessage: ${latestMessage.body ?? ''}';
              _statusMessage = 'New OTP received from SMS';
            });
          }
        }
      }
    } catch (e) {
      print('Error checking SMS: $e');
    }
  }

  // Extract OTP from SMS message using regex
  String? _extractOTPFromSMS(String smsMessage) {
    // Common OTP patterns: 4-8 digits
    final RegExp otpRegex = RegExp(r'\b\d{4,8}\b');
    final match = otpRegex.firstMatch(smsMessage);
    return match?.group(0);
  }

  void _stopListening() {
    _smsCheckTimer?.cancel();
    setState(() {
      _isListening = false;
      _statusMessage = 'Stopped listening for SMS';
    });
  }

  Future<void> _sendOTPToAPI() async {
    if (_otpController.text.isEmpty) {
      _showMessage('Please enter or wait for OTP from SMS');
      return;
    }

    setState(() {
      _isSending = true;
      _statusMessage = 'Sending OTP to API...';
    });

    try {
      final response = await http.post(
        Uri.parse(
          'https://your-api-endpoint.com/api/otp',
        ), // Replace with your actual API endpoint
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'otp': _otpController.text}),
      );

      if (response.statusCode == 200) {
        setState(() {
          _statusMessage =
              'OTP sent successfully! Status: ${response.statusCode}';
        });
        _showMessage('OTP sent successfully!');
      } else {
        setState(() {
          _statusMessage = 'Failed to send OTP. Status: ${response.statusCode}';
        });
        _showMessage('Failed to send OTP. Status: ${response.statusCode}');
      }
    } catch (e) {
      setState(() {
        _statusMessage = 'Error sending OTP: $e';
      });
      _showMessage('Error sending OTP: $e');
    } finally {
      setState(() {
        _isSending = false;
      });
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), duration: const Duration(seconds: 3)),
    );
  }

  void _clearOTP() {
    setState(() {
      _otpController.clear();
      _lastSMSMessage = '';
      _statusMessage = 'OTP cleared. Listening for new SMS...';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
        actions: [
          IconButton(
            icon: Icon(_isListening ? Icons.stop : Icons.play_arrow),
            onPressed: _isListening ? _stopListening : _startListening,
            tooltip: _isListening ? 'Stop listening' : 'Start listening',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Status',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _statusMessage,
                      style: TextStyle(
                        color: _isListening ? Colors.green : Colors.orange,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'OTP from SMS:',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _otpController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'OTP Code',
                hintText: 'OTP will appear here automatically',
                prefixIcon: Icon(Icons.message),
              ),
              keyboardType: TextInputType.number,
              maxLength: 6,
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isSending ? null : _sendOTPToAPI,
                    icon: _isSending
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.send),
                    label: Text(_isSending ? 'Sending...' : 'Send OTP to API'),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton.icon(
                  onPressed: _clearOTP,
                  icon: const Icon(Icons.clear),
                  label: const Text('Clear'),
                ),
              ],
            ),
            const SizedBox(height: 20),
            if (_lastSMSMessage.isNotEmpty)
              Card(
                color: Colors.green.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Last SMS Message:',
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      const SizedBox(height: 8),
                      Text(_lastSMSMessage),
                    ],
                  ),
                ),
              ),
            const Spacer(),
            Card(
              color: Colors.blue.shade50,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Instructions:',
                      style: Theme.of(context).textTheme.titleSmall,
                    ),
                    const SizedBox(height: 8),
                    const Text('1. Grant SMS permissions when prompted'),
                    const Text('2. Wait for SMS with OTP code'),
                    const Text('3. OTP will auto-fill in the text field'),
                    const Text('4. Click "Send OTP to API" to submit'),
                    const SizedBox(height: 8),
                    const Text(
                      'Note: Update the API endpoint in the code with your actual server URL.',
                      style: TextStyle(
                        fontStyle: FontStyle.italic,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
