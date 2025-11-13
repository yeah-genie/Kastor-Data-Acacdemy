import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kastor_data_academy/main.dart';

void main() {
  testWidgets('메인 메뉴 렌더링 테스트', (WidgetTester tester) async {
    // 앱 빌드
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // 메인 타이틀 확인
    expect(find.text('KASTOR'), findsOneWidget);
    expect(find.text('Data Academy'), findsOneWidget);

    // 메뉴 버튼 확인
    expect(find.text('New Game'), findsOneWidget);
    expect(find.text('Continue'), findsOneWidget);
    expect(find.text('Episodes'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);
  });

  testWidgets('New Game 버튼 클릭 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // New Game 버튼 찾기
    final newGameButton = find.text('New Game');
    expect(newGameButton, findsOneWidget);

    // 버튼 클릭
    await tester.tap(newGameButton);
    await tester.pumpAndSettle();

    // Dashboard로 이동 확인
    expect(find.text('KASTOR Data Academy'), findsOneWidget);
  });

  testWidgets('Continue 버튼 초기 비활성화 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // Continue 버튼은 초기에 비활성화됨
    final continueButton = find.text('Continue');
    expect(continueButton, findsOneWidget);

    // 버튼이 비활성화 상태인지 확인
    final elevatedButton = tester.widget<ElevatedButton>(
      find.ancestor(
        of: continueButton,
        matching: find.byType(ElevatedButton),
      ),
    );
    expect(elevatedButton.onPressed, isNull);
  });

  testWidgets('Dashboard 탭 네비게이션 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // Dashboard로 이동
    await tester.tap(find.text('New Game'));
    await tester.pumpAndSettle();

    // 모든 탭 버튼 확인
    expect(find.text('Chat'), findsOneWidget);
    expect(find.text('Data'), findsOneWidget);
    expect(find.text('Files'), findsOneWidget);
    expect(find.text('Team'), findsOneWidget);
    expect(find.text('Progress'), findsOneWidget);

    // Data 탭 클릭
    await tester.tap(find.text('Data'));
    await tester.pumpAndSettle();
    expect(find.text('데이터 분석'), findsOneWidget);

    // Team 탭 클릭
    await tester.tap(find.text('Team'));
    await tester.pumpAndSettle();
    expect(find.text('Isabella Torres'), findsOneWidget);

    // Progress 탭 클릭
    await tester.tap(find.text('Progress'));
    await tester.pumpAndSettle();
    expect(find.text('전체 진행률'), findsOneWidget);
  });

  testWidgets('Chat 탭 메시지 입력 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // Dashboard로 이동
    await tester.tap(find.text('New Game'));
    await tester.pumpAndSettle();

    // Chat 탭 확인 (기본 선택됨)
    expect(find.text('Chat'), findsOneWidget);

    // 메시지 입력 필드 찾기
    final messageInput = find.byType(TextField);
    expect(messageInput, findsOneWidget);

    // 메시지 입력
    await tester.enterText(messageInput, '테스트 메시지');
    await tester.pump();

    // 전송 버튼 클릭
    await tester.tap(find.byIcon(Icons.send));
    await tester.pumpAndSettle();

    // 메시지가 추가되었는지 확인
    expect(find.text('테스트 메시지'), findsOneWidget);
  });

  testWidgets('Files 탭 카테고리 필터 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // Dashboard로 이동
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

    // 파일 목록 확인
    expect(find.text('server_logs_020823.txt'), findsOneWidget);

    // 증거 필터 클릭
    await tester.tap(find.text('증거'));
    await tester.pumpAndSettle();

    // 여전히 파일이 보이는지 확인
    expect(find.text('server_logs_020823.txt'), findsOneWidget);
  });

  testWidgets('Team 탭 캐릭터 목록 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // Dashboard로 이동
    await tester.tap(find.text('New Game'));
    await tester.pumpAndSettle();

    // Team 탭으로 이동
    await tester.tap(find.text('Team'));
    await tester.pumpAndSettle();

    // 캐릭터 이름 확인
    expect(find.text('Isabella Torres'), findsOneWidget);
    expect(find.text('Alex Reeves'), findsOneWidget);
    expect(find.text('Camille Beaumont'), findsOneWidget);

    // 역할 확인
    expect(find.text('Senior Data Analyst'), findsOneWidget);
    expect(find.text('Infrastructure Engineer'), findsOneWidget);
    expect(find.text('Chief of Security'), findsOneWidget);
  });

  testWidgets('Progress 탭 에피소드 목록 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // Dashboard로 이동
    await tester.tap(find.text('New Game'));
    await tester.pumpAndSettle();

    // Progress 탭으로 이동
    await tester.tap(find.text('Progress'));
    await tester.pumpAndSettle();

    // 진행률 제목 확인
    expect(find.text('전체 진행률'), findsOneWidget);
    expect(find.text('에피소드 진행률'), findsOneWidget);

    // 에피소드 확인
    expect(find.text('Episode 1'), findsOneWidget);
    expect(find.text('Episode 2'), findsOneWidget);
    expect(find.text('Episode 3'), findsOneWidget);
    expect(find.text('Episode 4'), findsOneWidget);
  });

  testWidgets('Data 탭 통계 카드 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // Dashboard로 이동
    await tester.tap(find.text('New Game'));
    await tester.pumpAndSettle();

    // Data 탭으로 이동
    await tester.tap(find.text('Data'));
    await tester.pumpAndSettle();

    // 통계 확인
    expect(find.text('총 로그'), findsOneWidget);
    expect(find.text('의심 항목'), findsOneWidget);
    expect(find.text('분석 완료'), findsOneWidget);

    // 로그 뷰어 확인
    expect(find.text('서버 로그'), findsOneWidget);
  });

  testWidgets('앱바 버튼 테스트', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: KastorDataAcademyApp()));

    // Dashboard로 이동
    await tester.tap(find.text('New Game'));
    await tester.pumpAndSettle();

    // 앱바 확인
    expect(find.text('KASTOR Data Academy'), findsOneWidget);

    // 설정 버튼 확인
    expect(find.byIcon(Icons.settings), findsOneWidget);

    // 저장 버튼 확인
    expect(find.byIcon(Icons.save), findsOneWidget);

    // 저장 버튼 클릭
    await tester.tap(find.byIcon(Icons.save));
    await tester.pumpAndSettle();

    // 스낵바 확인
    expect(find.text('게임이 저장되었습니다'), findsOneWidget);
  });
}
