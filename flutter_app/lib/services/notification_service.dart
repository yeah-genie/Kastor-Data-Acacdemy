import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'dart:io' show Platform;

/// OS 레벨 알림 서비스 (flutter_local_notifications 사용)
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  /// 알림 서비스 초기화
  Future<void> initialize() async {
    if (_isInitialized) return;

    // Android 초기화 설정
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    // iOS 초기화 설정
    const DarwinInitializationSettings iosSettings =
        DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    // Android 13+ 권한 요청
    if (Platform.isAndroid) {
      await _notifications
          .resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>()
          ?.requestNotificationsPermission();
    }

    // iOS 권한 요청
    if (Platform.isIOS) {
      await _notifications
          .resolvePlatformSpecificImplementation<
              IOSFlutterLocalNotificationsPlugin>()
          ?.requestPermissions(
            alert: true,
            badge: true,
            sound: true,
          );
    }

    _isInitialized = true;
  }

  /// 알림 탭 이벤트 처리
  void _onNotificationTapped(NotificationResponse response) {
    // TODO: 알림 탭 시 특정 화면으로 이동하는 로직 추가
    print('Notification tapped: ${response.payload}');
  }

  /// Neo-Academic 스타일 알림 채널 생성
  Future<void> _createNotificationChannel() async {
    if (!Platform.isAndroid) return;

    const AndroidNotificationChannel channel = AndroidNotificationChannel(
      'kastor_academy_channel', // 채널 ID
      'Kastor Academy', // 채널 이름
      description: '캐스터 데이터 아카데미 알림', // 채널 설명
      importance: Importance.high,
      enableVibration: true,
      playSound: true,
    );

    await _notifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);
  }

  /// 새 메시지 알림 표시
  Future<void> showMessageNotification({
    required String characterName,
    required String message,
    String? payload,
  }) async {
    if (!_isInitialized) await initialize();
    await _createNotificationChannel();

    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'kastor_academy_channel',
      'Kastor Academy',
      channelDescription: '캐스터 데이터 아카데미 알림',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: Color(0xFF00F6FF), // Neon Cyan
      enableVibration: true,
      playSound: true,
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.show(
      DateTime.now().millisecond, // 고유 ID
      characterName,
      message,
      details,
      payload: payload,
    );
  }

  /// 업적 달성 알림 표시
  Future<void> showAchievementNotification({
    required String title,
    required String description,
  }) async {
    if (!_isInitialized) await initialize();
    await _createNotificationChannel();

    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'kastor_academy_channel',
      'Kastor Academy',
      channelDescription: '캐스터 데이터 아카데미 알림',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: Color(0xFFB458FF), // Electric Violet
      enableVibration: true,
      playSound: true,
      styleInformation: BigTextStyleInformation(''),
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.show(
      DateTime.now().millisecond,
      '🎓 $title',
      description,
      details,
      payload: 'achievement',
    );
  }

  /// 중요한 선택지 알림 표시
  Future<void> showImportantChoiceNotification({
    required String message,
  }) async {
    if (!_isInitialized) await initialize();
    await _createNotificationChannel();

    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'kastor_academy_channel',
      'Kastor Academy',
      channelDescription: '캐스터 데이터 아카데미 알림',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: Color(0xFF4C2AFF), // Royal Purple
      enableVibration: true,
      playSound: true,
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.show(
      DateTime.now().millisecond,
      '⚠️ 중요한 결정',
      message,
      details,
      payload: 'important_choice',
    );
  }

  /// 에피소드 완료 알림 표시
  Future<void> showEpisodeCompleteNotification({
    required String episodeTitle,
    required int score,
  }) async {
    if (!_isInitialized) await initialize();
    await _createNotificationChannel();

    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
      'kastor_academy_channel',
      'Kastor Academy',
      channelDescription: '캐스터 데이터 아카데미 알림',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      color: Color(0xFF39FF14), // Hologram Green
      enableVibration: true,
      playSound: true,
    );

    const DarwinNotificationDetails iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const NotificationDetails details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _notifications.show(
      DateTime.now().millisecond,
      '🎉 에피소드 완료!',
      '$episodeTitle - 점수: $score점',
      details,
      payload: 'episode_complete',
    );
  }

  /// 모든 알림 취소
  Future<void> cancelAll() async {
    await _notifications.cancelAll();
  }

  /// 특정 알림 취소
  Future<void> cancel(int id) async {
    await _notifications.cancel(id);
  }
}
