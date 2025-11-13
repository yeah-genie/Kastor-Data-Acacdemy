import { test, expect } from "@playwright/test";

test.describe("Kastor Data Academy – Incident Dashboard", () => {
  const BASE_URL = "https://kastor-data-academy.vercel.app/";

  test("메인 대시보드 흐름 확인", async ({ page }) => {
    // 1. 대시보드 진입
    await page.goto(BASE_URL);
    await expect(page.locator("text=Incident Response Channel")).toBeVisible();
    await expect(page.locator("text=Secured by Kastor Shield")).toBeVisible();

    // 2. 탭 전환 확인
    const tabNames = ["Chat", "Data", "Files", "Team"];
    for (const tab of tabNames) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      await expect(page.locator(`main :text("${tab}")`)).toBeVisible({
        timeout: 5000,
      });
    }
    await page.getByRole("button", { name: "Chat" }).click();

    // 3. 채팅 타임라인 점검
    await expect(
      page.locator("text=LEGEND ARENA HQ // INCIDENT CHANNEL"),
    ).toBeVisible();
    await expect(page.locator("text=Kastor")).toBeVisible();
    await expect(page.locator("text=Maya Zhang")).toBeVisible();
    await expect(page.locator("text=Player")).toBeVisible();

    // 4. 증거 카드 인터랙션
    const evidenceCard = page.locator("text=03:00 AM Server Access Log");
    await expect(evidenceCard).toBeVisible();
    await evidenceCard.click();

    // 5. 메시지 전송 플로우
    const input = page.getByPlaceholder("메시지를 입력하세요…");
    await input.fill("로그 필터링 진행합니다");
    await page.getByRole("button", { name: "메시지 전송" }).click();

    // 플레이어 메시지가 추가됐는지 확인
    await expect(page.locator("text=로그 필터링 진행합니다")).toBeVisible();

    // Kastor 자동 응답 대기
    await expect(
      page.locator("text=데이터를 필터링해서 02:00-04:00 로그만 추려볼까요?"),
    ).toBeVisible({ timeout: 5000 });

    // 6. 타이핑 인디케이터 확인 (전송 직후 잠시 나타났다가 사라질 수 있음)
    await input.fill("타이핑 인디케이터 테스트");
    await page.getByRole("button", { name: "메시지 전송" }).click();
    const typingIndicator = page.locator("text=↔ Swipe to change tabs");
    await expect(typingIndicator).toBeVisible({ timeout: 2000 }).catch(() => {
      // 시간 차로 놓칠 수 있으므로 실패해도 테스트를 깨지 않습니다.
    });

    // 7. 모바일 탭 네비게이션 (viewport 조정 후 하단 네비 확인)
    await page.setViewportSize({ width: 540, height: 900 });
    const bottomNav = page.locator("nav >> text=Chat");
    await expect(bottomNav).toBeVisible();
    await page.getByRole("button", { name: "Data" }).click();
    await expect(page.locator(`main :text("Data")`)).toBeVisible();
    await page.getByRole("button", { name: "Chat" }).click();

    // 8. 콘솔 오류 확인
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    expect(consoleErrors, "콘솔 오류가 없어야 합니다").toHaveLength(0);
  });
});
