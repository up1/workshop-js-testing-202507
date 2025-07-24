# SMS OTP Reader App

This Flutter app reads SMS messages containing OTP codes and sends them to a REST API endpoint.

## Features

1. **SMS Reading**: Automatically detects and reads OTP codes from incoming SMS messages
2. **Permission Handling**: Requests and manages SMS permissions properly
3. **Auto-fill**: OTP codes are automatically filled into the text field when received
4. **REST API Integration**: Sends OTP data to a configurable API endpoint

## Setup Instructions

### 1. Dependencies
The following dependencies are added to `pubspec.yaml`:
- `sms_autofill: ^2.4.0` - For SMS reading and OTP detection
- `http: ^1.1.0` - For HTTP requests
- `permission_handler: ^11.3.1` - For managing permissions

### 2. Android Permissions
The following permissions are added to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 3. API Endpoint Configuration
Update the API endpoint in `lib/main.dart`:
```dart
Uri.parse('https://your-api-endpoint.com/api/otp')
```

Replace `your-api-endpoint.com` with your actual server URL.

## Usage

1. **Grant Permissions**: When the app starts, it will request SMS permissions
2. **Listen for SMS**: The app automatically listens for incoming SMS messages
3. **Auto-fill OTP**: When an OTP SMS is received, the code is automatically extracted and filled
4. **Send to API**: Click the "Send OTP to API" button to POST the OTP to your server

## API Request Format

The app sends a POST request to `/api/otp` with the following JSON body:
```json
{
  "otp": "123456"
}
```

## Testing

To test the SMS functionality:
1. Run the app on a physical Android device (SMS doesn't work in emulators)
2. Send a test SMS to the device containing an OTP code
3. The app should automatically detect and extract the OTP
4. Use the send button to test the API integration

## Example Test SMS Format

The SMS autofill works best with messages containing numeric codes:
- "Your OTP is 123456"
- "Verification code: 654321"
- "123456 is your verification code"

## Notes

- **Physical Device Required**: SMS functionality only works on physical devices, not emulators
- **Android Only**: This implementation is primarily for Android. iOS has stricter SMS access limitations
- **Network Access**: Ensure the device has internet connectivity for API calls
- **API Endpoint**: Replace the placeholder API endpoint with your actual server URL

## Error Handling

The app includes comprehensive error handling for:
- Permission denied scenarios
- Network connectivity issues
- API endpoint failures
- SMS reading errors

## Security Considerations

- SMS permissions are sensitive - ensure your app complies with platform guidelines
- Validate OTP codes on your server before processing
- Use HTTPS for API endpoints to ensure secure transmission
- Consider implementing rate limiting on your API endpoint
