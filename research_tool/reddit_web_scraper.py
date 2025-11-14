"""
Reddit Web Scraper using Playwright
민준 페르소나: Python 학습 좌절, 데이터 사이언스 진입 장벽 분석
"""

import asyncio
import json
import pandas as pd
from datetime import datetime
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout
from tqdm import tqdm
import time
import re

class RedditWebScraper:
    def __init__(self, headless=True):
        self.headless = headless
        self.posts = []

    async def scrape_subreddit_search(self, subreddit, search_query, max_posts=30):
        """
        서브레딧 검색 결과 크롤링

        Args:
            subreddit: 서브레딧 이름 (예: 'learnpython')
            search_query: 검색 키워드
            max_posts: 최대 게시글 수
        """
        async with async_playwright() as p:
            print(f"\n🔍 r/{subreddit} 검색: '{search_query}'")

            browser = await p.chromium.launch(headless=self.headless)
            context = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            )
            page = await context.new_page()

            try:
                # Old Reddit 사용 (더 간단한 HTML 구조)
                search_url = f"https://old.reddit.com/r/{subreddit}/search/?q={search_query.replace(' ', '+')}&restrict_sr=1&sort=relevance&t=year"
                print(f"  📄 URL: {search_url}")

                await page.goto(search_url, wait_until='domcontentloaded', timeout=30000)
                await asyncio.sleep(2)

                # 게시글 추출
                posts_collected = 0
                scroll_attempts = 0
                max_scroll_attempts = 5

                while posts_collected < max_posts and scroll_attempts < max_scroll_attempts:
                    # 게시글 선택자
                    post_elements = await page.query_selector_all('.thing[data-type="link"]')

                    for post_elem in post_elements[posts_collected:]:
                        if posts_collected >= max_posts:
                            break

                        try:
                            post_data = await self._extract_post_info(post_elem, subreddit, search_query)
                            if post_data:
                                self.posts.append(post_data)
                                posts_collected += 1
                        except Exception as e:
                            # print(f"    게시글 추출 오류: {str(e)}")
                            continue

                    # 스크롤하여 더 로드
                    await page.evaluate('window.scrollBy(0, window.innerHeight * 2)')
                    await asyncio.sleep(1)
                    scroll_attempts += 1

                print(f"  ✓ {posts_collected}개 게시글 수집")

            except PlaywrightTimeout:
                print("  ⚠ 페이지 로딩 시간 초과")
            except Exception as e:
                print(f"  ❌ 오류: {str(e)}")
            finally:
                await browser.close()

    async def _extract_post_info(self, post_element, subreddit, search_query):
        """게시글 정보 추출"""
        try:
            # 제목
            title_elem = await post_element.query_selector('.title a.title')
            title = await title_elem.inner_text() if title_elem else "N/A"

            # URL
            url = await title_elem.get_attribute('href') if title_elem else "N/A"
            if url and not url.startswith('http'):
                url = f"https://old.reddit.com{url}"

            # 작성자
            author_elem = await post_element.query_selector('.author')
            author = await author_elem.inner_text() if author_elem else "[deleted]"

            # 점수 (upvotes)
            score_elem = await post_element.query_selector('.score.unvoted')
            score_text = await score_elem.get_attribute('title') if score_elem else "0"
            score = score_text if score_text else "0"

            # 댓글 수
            comments_elem = await post_element.query_selector('.comments')
            comments_text = await comments_elem.inner_text() if comments_elem else "0 comments"
            num_comments = re.search(r'(\d+)', comments_text)
            num_comments = num_comments.group(1) if num_comments else "0"

            # 작성 시간
            time_elem = await post_element.query_selector('time')
            created_time = await time_elem.get_attribute('title') if time_elem else "N/A"

            # 본문 미리보기 (있는 경우)
            preview_elem = await post_element.query_selector('.expando')
            preview = await preview_elem.inner_text() if preview_elem else ""

            return {
                'subreddit': f"r/{subreddit}",
                'search_query': search_query,
                'title': title.strip(),
                'author': author.strip(),
                'score': score,
                'num_comments': num_comments,
                'created_at': created_time,
                'url': url,
                'preview': preview[:200] if preview else "",  # 첫 200자
                'collected_at': datetime.now()
            }

        except Exception as e:
            # print(f"      정보 추출 실패: {str(e)}")
            return None

    async def scrape_multiple_queries(self, subreddit_queries, max_posts_per_query=30):
        """
        여러 서브레딧/검색어 조합으로 크롤링

        Args:
            subreddit_queries: {subreddit: [keywords]} 형태의 딕셔너리
        """
        print(f"\n{'='*60}")
        print(f"💬 Reddit 웹 스크래핑 시작")
        print(f"{'='*60}\n")

        total_queries = sum(len(keywords) for keywords in subreddit_queries.values())
        current = 0

        for subreddit, keywords in subreddit_queries.items():
            print(f"\n{'─'*60}")
            print(f"📊 r/{subreddit} - {len(keywords)}개 키워드")
            print(f"{'─'*60}")

            for keyword in keywords:
                current += 1
                print(f"\n[{current}/{total_queries}]", end=" ")
                await self.scrape_subreddit_search(subreddit, keyword, max_posts_per_query)
                await asyncio.sleep(2)  # Rate limiting

        print(f"\n{'='*60}")
        print(f"✅ 크롤링 완료: 총 {len(self.posts)}개 게시글")
        print(f"{'='*60}\n")

    def to_dataframe(self):
        """DataFrame으로 변환"""
        if not self.posts:
            return pd.DataFrame()

        df = pd.DataFrame(self.posts)

        # 중복 제거
        df = df.drop_duplicates(subset=['url'])

        print(f"📊 데이터 정리 완료: {len(df)}개 고유 게시글")
        return df

    def save_data(self, filename_prefix='reddit_posts'):
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
    # 민준 페르소나 타겟 서브레딧 및 키워드
    subreddit_queries = {
        'learnpython': [
            'give up',
            'too hard',
            'frustrated',
            'beginner struggling',
            'quit python'
        ],
        'learnprogramming': [
            'give up',
            'too hard',
            'overwhelmed',
            'losing motivation'
        ],
        'datascience': [
            'beginner',
            'getting started',
            'too expensive',
            'coursera worth it',
            'free resources'
        ]
    }

    scraper = RedditWebScraper(headless=True)
    await scraper.scrape_multiple_queries(subreddit_queries, max_posts_per_query=20)

    # 데이터 저장
    scraper.save_data('minjun_reddit_posts')


if __name__ == "__main__":
    asyncio.run(main())
