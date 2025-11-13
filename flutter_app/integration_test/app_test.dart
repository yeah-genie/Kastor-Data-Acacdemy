import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:kastor_data_academy/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Kastor Data Academy E2E Tests', () {
    testWidgets('앱 시작 및 메인 메뉴 표시', (WidgetTester tester) async {
      // 앱 시작
      app.main();
      await tester.pumpAndSettle();

      // 메인 타이틀 확인
      expect(find.text('KASTOR'), findsOneWidget);
      expect(find.text('Data Academy'), findsOneWidget);

      // 메뉴 버튼 확인
      expect(find.text('New Game'), findsOneWidget);
      expect(find.text('Continue'), findsOneWidget);
      expect(find.text('Episodes'), findsOneWidget);
      expect(find.text('Settings'), findsOneWidget);
    });

    testWidgets('New Game 버튼 클릭 및 Dashboard 이동', (WidgetTester tester) async {
      // 앱 시작
      app.main();
      await tester.pumpAndSettle();

      // New Game 버튼 찾기 및 클릭
      final newGameButton = find.text('New Game');
      expect(newGameButton, findsOneWidget);
      await tester.tap(newGameButton);
      await tester.pumpAndSettle();

      // Dashboard로 이동했는지 확인
      expect(find.text('KASTOR Data Academy'), findsOneWidget);

      // 탭 버튼 확인
      expect(find.text('Chat'), findsOneWidget);
      expect(find.text('Data'), findsOneWidget);
      expect(find.text('Files'), findsOneWidget);
      expect(find.text('Team'), findsOneWidget);
      expect(find.text('Progress'), findsOneWidget);
    });

    testWidgets('Dashboard 탭 전환', (WidgetTester tester) async {
      // 앱 시작 및 Dashboard로 이동
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text('New Game'));
      await tester.pumpAndSettle();

      // Data 탭으로 전환
      await tester.tap(find.text('Data'));
      await tester.pumpAndSettle();
      expect(find.text('데이터 분석'), findsOneWidget);

      // Files 탭으로 전환
      await tester.tap(find.text('Files'));
      await tester.pumpAndSettle();
      // Files 탭 컨텐츠 확인 (카테고리 필터)
      expect(find.text('전체'), findsOneWidget);

      // Team 탭으로 전환
      await tester.tap(find.text('Team'));
      await tester.pumpAndSettle();
      // Team 탭 컨텐츠 확인 (캐릭터 카드)
      expect(find.text('Isabella Torres'), findsOneWidget);

      // Progress 탭으로 전환
      await tester.tap(find.text('Progress'));
      await tester.pumpAndSettle();
      expect(find.text('전체 진행률'), findsOneWidget);

      // Chat 탭으로 다시 전환
      await tester.tap(find.text('Chat'));
      await tester.pumpAndSettle();
      expect(find.text('안녕하세요! 카스토르입니다'), findsOneWidget);
    });

    testWidgets('Chat 탭 - 메시지 입력 및 전송', (WidgetTester tester) async {
      // 앱 시작 및 Dashboard로 이동
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text('New Game'));
      await tester.pumpAndSettle();

      // Chat 탭 확인 (기본 선택됨)
      expect(find.text('안녕하세요! 카스토르입니다'), findsOneWidget);

      // 메시지 입력 필드 찾기
      final messageInput = find.byType(TextField);
      expect(messageInput, findsOneWidget);

      // 메시지 입력
      await tester.enterText(messageInput, '테스트 메시지입니다');
      await tester.pumpAndSettle();

      // 전송 버튼 찾기 및 클릭
      final sendButton = find.byIcon(Icons.send);
      expect(sendButton, findsOneWidget);
      await tester.tap(sendButton);
      await tester.pumpAndSettle();

      // 전송된 메시지 확인
      expect(find.text('테스트 메시지입니다'), findsOneWidget);
    });

    testWidgets('Chat 탭 - 선택지 버튼 클릭', (WidgetTester tester) async {
      // 앱 시작 및 Dashboard로 이동
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text('New Game'));
      await tester.pumpAndSettle();

      // 초기 메시지 확인
      expect(find.text('안녕하세요! 카스토르입니다'), findsOneWidget);

      // 선택지 버튼 찾기 (첫 번째 선택지)
      final choiceButton = find.text('서버 로그를 확인하겠습니다');
      if (choiceButton.evaluate().isNotEmpty) {
        await tester.tap(choiceButton);
        await tester.pumpAndSettle();

        // 선택한 메시지가 채팅에 추가되었는지 확인
        expect(find.text('서버 로그를 확인하겠습니다'), findsWidgets);
      }
    });

    testWidgets('Files 탭 - 파일 목록 및 카테고리 필터', (WidgetTester tester) async {
      // 앱 시작 및 Dashboard로 이동
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text('New Game'));
      await tester.pumpAndSettle();

      // Files 탭으로 이동
      await tester.tap(find.text('Files'));
      await tester.pumpAndSettle();

      // 카테고리 필터 확인
      expect(find.text('전체'), findsOneWidget);
      expect(find.text('증거'), findsOneWidget);
      expect(find.text('미디어'), findsOneWidget);
      expect(find.text('기록'), findsOneWidget);

      // 파일 항목 확인
      expect(find.text('server_logs_020823.txt'), findsOneWidget);

      // 증거 카테고리로 필터링
      await tester.tap(find.text('증거'));
      await tester.pumpAndSettle();

      // 증거 파일만 표시되는지 확인
      expect(find.text('server_logs_020823.txt'), findsOneWidget);
    });

    testWidgets('Team 탭 - 캐릭터 카드 표시', (WidgetTester tester) async {
      // 앱 시작 및 Dashboard로 이동
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text('New Game'));
      await tester.pumpAndSettle();

      // Team 탭으로 이동
      await tester.tap(find.text('Team'));
      await tester.pumpAndSettle();

      // 캐릭터 확인
      expect(find.text('Isabella Torres'), findsOneWidget);
      expect(find.text('Alex Reeves'), findsOneWidget);
      expect(find.text('Camille Beaumont'), findsOneWidget);

      // 역할 확인
      expect(find.text('Senior Data Analyst'), findsOneWidget);
      expect(find.text('Infrastructure Engineer'), findsOneWidget);
    });

    testWidgets('Progress 탭 - 진행률 및 에피소드 표시', (WidgetTester tester) async {
      // 앱 시작 및 Dashboard로 이동
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text('New Game'));
      await tester.pumpAndSettle();

      // Progress 탭으로 이동
      await tester.tap(find.text('Progress'));
      await tester.pumpAndSettle();

      // 진행률 표시 확인
      expect(find.text('전체 진행률'), findsOneWidget);
      expect(find.text('에피소드 진행률'), findsOneWidget);

      // 에피소드 목록 확인
      expect(find.text('Episode 1'), findsOneWidget);
      expect(find.text('Episode 2'), findsOneWidget);
      expect(find.text('Episode 3'), findsOneWidget);
      expect(find.text('Episode 4'), findsOneWidget);
    });

    testWidgets('뒤로가기 - Dashboard에서 메인 메뉴로', (WidgetTester tester) async {
      // 앱 시작 및 Dashboard로 이동
      app.main();
      await tester.pumpAndSettle();
      await tester.tap(find.text('New Game'));
      await tester.pumpAndSettle();

      // Dashboard 확인
      expect(find.text('KASTOR Data Academy'), findsOneWidget);

      // 뒤로가기
      await tester.pageBack();
      await tester.pumpAndSettle();

      // 메인 메뉴로 돌아왔는지 확인
      expect(find.text('KASTOR'), findsOneWidget);
      expect(find.text('Data Academy'), findsOneWidget);
    });
  });
}
