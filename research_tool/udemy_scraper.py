"""
Udemy Course Scraper using Playwright
민준 페르소나 타겟: Python/데이터 사이언스 초보자 강의 분석
"""

import asyncio
import json
import pandas as pd
from datetime import datetime
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout
from tqdm import tqdm
import time

class UdemyScraper:
    def __init__(self, headless=True):
        self.headless = headless
        self.courses = []

    async def scrape_search_results(self, search_query, max_pages=3):
        """
        Udemy 검색 결과 크롤링

        Args:
            search_query: 검색 키워드 (예: 'python for beginners')
            max_pages: 최대 페이지 수
        """
        async with async_playwright() as p:
            print(f"\n🔍 검색 중: '{search_query}'")

            # Launch browser
            browser = await p.chromium.launch(headless=self.headless)
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            )
            page = await context.new_page()

            try:
                # Udemy 검색 URL
                search_url = f"https://www.udemy.com/courses/search/?q={search_query.replace(' ', '+')}&sort=popularity"
                print(f"📄 URL: {search_url}")

                await page.goto(search_url, wait_until='networkidle', timeout=30000)
                await asyncio.sleep(2)  # 페이지 로딩 대기

                for page_num in range(1, max_pages + 1):
                    print(f"\n📖 페이지 {page_num}/{max_pages} 크롤링 중...")

                    # 강의 카드 찾기
                    await page.wait_for_selector('[data-purpose="course-card"]', timeout=10000)

                    # 스크롤하여 모든 강의 로드
                    for _ in range(3):
                        await page.evaluate('window.scrollBy(0, window.innerHeight)')
                        await asyncio.sleep(0.5)

                    # 강의 정보 추출
                    courses = await page.query_selector_all('[data-purpose="course-card"]')

                    for course in courses:
                        try:
                            course_data = await self._extract_course_info(course, search_query, page)
                            if course_data:
                                self.courses.append(course_data)
                        except Exception as e:
                            print(f"  ⚠ 강의 정보 추출 오류: {str(e)}")
                            continue

                    print(f"  ✓ {len(courses)}개 강의 추출 완료")

                    # 다음 페이지로 이동
                    if page_num < max_pages:
                        try:
                            next_button = await page.query_selector('[aria-label="다음 페이지"], [aria-label="Next"]')
                            if next_button:
                                await next_button.click()
                                await asyncio.sleep(2)
                            else:
                                print("  ℹ 다음 페이지 없음")
                                break
                        except:
                            print("  ℹ 다음 페이지 이동 실패")
                            break

            except PlaywrightTimeout:
                print("⚠ 페이지 로딩 시간 초과")
            except Exception as e:
                print(f"❌ 오류 발생: {str(e)}")
            finally:
                await browser.close()

    async def _extract_course_info(self, course_element, search_query, page):
        """강의 정보 추출"""
        try:
            # 강의 제목
            title_elem = await course_element.query_selector('[data-purpose="course-title-url"] h3, [data-purpose="course-title"]')
            title = await title_elem.inner_text() if title_elem else "N/A"

            # 강의 URL
            url_elem = await course_element.query_selector('a[href*="/course/"]')
            url = await url_elem.get_attribute('href') if url_elem else "N/A"
            if url and not url.startswith('http'):
                url = f"https://www.udemy.com{url}"

            # 강사명
            instructor_elem = await course_element.query_selector('[data-purpose="safely-set-inner-html:course-card:visible-instructors"]')
            instructor = await instructor_elem.inner_text() if instructor_elem else "N/A"

            # 평점
            rating_elem = await course_element.query_selector('[data-purpose="rating-number"]')
            rating = await rating_elem.inner_text() if rating_elem else "N/A"

            # 리뷰 수
            reviews_elem = await course_element.query_selector('[data-purpose="reviews-count-text"]')
            reviews_text = await reviews_elem.inner_text() if reviews_elem else "0"
            reviews = reviews_text.replace('(', '').replace(')', '').replace(',', '').strip()

            # 수강생 수
            students_elem = await course_element.query_selector('.course-card--student-count--1wT0t')
            students_text = await students_elem.inner_text() if students_elem else "0 students"

            # 가격
            price_elem = await course_element.query_selector('[data-purpose="course-price-text"] span:last-child, .price-text--price-part--2-Nn0 span:last-child')
            price = await price_elem.inner_text() if price_elem else "N/A"

            # 레벨 (초급, 중급, 고급)
            level_elem = await course_element.query_selector('[data-purpose="course-level"]')
            level = await level_elem.inner_text() if level_elem else "N/A"

            # 강의 길이
            duration_elem = await course_element.query_selector('[data-purpose="course-content-length"]')
            duration = await duration_elem.inner_text() if duration_elem else "N/A"

            return {
                'search_query': search_query,
                'title': title.strip(),
                'instructor': instructor.strip(),
                'rating': rating.strip(),
                'num_reviews': reviews,
                'num_students': students_text.strip(),
                'price': price.strip(),
                'level': level.strip(),
                'duration': duration.strip(),
                'url': url,
                'collected_at': datetime.now()
            }

        except Exception as e:
            # print(f"    강의 정보 추출 실패: {str(e)}")
            return None

    async def scrape_multiple_queries(self, search_queries, max_pages=3):
        """여러 검색어로 크롤링"""
        print(f"\n{'='*60}")
        print(f"🎓 Udemy 강의 크롤링 시작")
        print(f"{'='*60}")
        print(f"검색 키워드: {len(search_queries)}개")
        print(f"페이지당 최대: {max_pages}페이지\n")

        for query in search_queries:
            await self.scrape_search_results(query, max_pages)
            await asyncio.sleep(2)  # Rate limiting

        print(f"\n{'='*60}")
        print(f"✅ 크롤링 완료: 총 {len(self.courses)}개 강의")
        print(f"{'='*60}\n")

    def to_dataframe(self):
        """DataFrame으로 변환"""
        if not self.courses:
            return pd.DataFrame()

        df = pd.DataFrame(self.courses)

        # 중복 제거 (같은 강의가 여러 검색어에서 나올 수 있음)
        df = df.drop_duplicates(subset=['url'])

        print(f"📊 데이터 정리 완료: {len(df)}개 고유 강의")
        return df

    def save_data(self, filename_prefix='udemy_courses'):
        """데이터 저장"""
        df = self.to_dataframe()

        if df.empty:
            print("⚠ 저장할 데이터가 없습니다.")
            return None

        import os
        os.makedirs('output', exist_ok=True)

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        # CSV 저장
        csv_path = f"output/{filename_prefix}_{timestamp}.csv"
        df.to_csv(csv_path, index=False, encoding='utf-8-sig')

        # Excel 저장
        excel_path = f"output/{filename_prefix}_{timestamp}.xlsx"
        df.to_excel(excel_path, index=False, engine='openpyxl')

        print(f"\n💾 데이터 저장 완료:")
        print(f"  - CSV: {csv_path}")
        print(f"  - Excel: {excel_path}")

        return csv_path, excel_path, df


async def main():
    """실행 예시"""
    # 민준 페르소나 타겟 검색어
    search_queries = [
        'python for beginners',
        'python data science',
        'data science for beginners',
        'learn python programming',
        'data analysis python',
        'python pandas tutorial'
    ]

    scraper = UdemyScraper(headless=True)
    await scraper.scrape_multiple_queries(search_queries, max_pages=2)

    # 데이터 저장
    scraper.save_data('minjun_udemy_courses')


if __name__ == "__main__":
    asyncio.run(main())
