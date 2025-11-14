"""
Reddit Web Scraper using BeautifulSoup
민준 페르소나: Python 학습 좌절, 데이터 사이언스 진입 장벽 분석
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import time
import re
from tqdm import tqdm
import os

class RedditScraper:
    def __init__(self):
        self.posts = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def scrape_subreddit_search(self, subreddit, search_query, max_posts=50):
        """
        서브레딧 검색 결과 크롤링

        Args:
            subreddit: 서브레딧 이름 (예: 'learnpython')
            search_query: 검색 키워드
            max_posts: 최대 게시글 수
        """
        print(f"\n🔍 r/{subreddit} 검색: '{search_query}'")

        # Old Reddit 사용 (정적 HTML)
        search_url = f"https://old.reddit.com/r/{subreddit}/search/?q={search_query.replace(' ', '+')}&restrict_sr=1&sort=relevance&t=year&limit=100"

        try:
            response = self.session.get(search_url, timeout=15)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # 게시글 추출
            post_elements = soup.find_all('div', class_='thing', attrs={'data-type': 'link'})

            posts_collected = 0
            for post_elem in post_elements[:max_posts]:
                try:
                    post_data = self._extract_post_info(post_elem, subreddit, search_query)
                    if post_data:
                        self.posts.append(post_data)
                        posts_collected += 1
                except Exception as e:
                    continue

            print(f"  ✓ {posts_collected}개 게시글 수집")

        except requests.exceptions.RequestException as e:
            print(f"  ❌ 오류: {str(e)}")
        except Exception as e:
            print(f"  ❌ 파싱 오류: {str(e)}")

    def _extract_post_info(self, post_element, subreddit, search_query):
        """게시글 정보 추출"""
        try:
            # 제목
            title_elem = post_element.find('a', class_='title')
            title = title_elem.get_text(strip=True) if title_elem else "N/A"

            # URL
            url = title_elem['href'] if title_elem and 'href' in title_elem.attrs else "N/A"
            if url and not url.startswith('http'):
                url = f"https://old.reddit.com{url}"

            # 작성자
            author_elem = post_element.find('a', class_='author')
            author = author_elem.get_text(strip=True) if author_elem else "[deleted]"

            # 점수 (upvotes)
            score_elem = post_element.find('div', class_='score unvoted')
            score = score_elem.get('title', '0') if score_elem else "0"

            # 댓글 수
            comments_elem = post_element.find('a', class_='comments')
            comments_text = comments_elem.get_text(strip=True) if comments_elem else "0 comments"
            num_comments = re.search(r'(\d+)', comments_text)
            num_comments = num_comments.group(1) if num_comments else "0"

            # 작성 시간
            time_elem = post_element.find('time')
            created_time = time_elem.get('title', 'N/A') if time_elem else "N/A"

            # 도메인
            domain_elem = post_element.find('span', class_='domain')
            domain = domain_elem.get_text(strip=True) if domain_elem else ""

            return {
                'subreddit': f"r/{subreddit}",
                'search_query': search_query,
                'title': title,
                'author': author,
                'score': score,
                'num_comments': num_comments,
                'created_at': created_time,
                'domain': domain,
                'url': url,
                'collected_at': datetime.now()
            }

        except Exception as e:
            return None

    def scrape_multiple_queries(self, subreddit_queries, max_posts_per_query=50):
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
                print(f"[{current}/{total_queries}]", end=" ")
                self.scrape_subreddit_search(subreddit, keyword, max_posts_per_query)
                time.sleep(2)  # Rate limiting

        print(f"\n{'='*60}")
        print(f"✅ 크롤링 완료: 총 {len(self.posts)}개 게시글")
        print(f"{'='*60}\n")

    def to_dataframe(self):
        """DataFrame으로 변환"""
        if not self.posts:
            return pd.DataFrame()

        df = pd.DataFrame(self.posts)

        # 중복 제거
        original_count = len(df)
        df = df.drop_duplicates(subset=['url'])
        removed = original_count - len(df)

        print(f"📊 데이터 정리 완료: {len(df)}개 고유 게시글 (중복 {removed}개 제거)")
        return df

    def save_data(self, filename_prefix='reddit_posts'):
        """데이터 저장"""
        df = self.to_dataframe()

        if df.empty:
            print("⚠ 저장할 데이터가 없습니다.")
            return None, None, None

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


def main():
    """실행 예시"""
    # 민준 페르소나 타겟 서브레딧 및 키워드
    subreddit_queries = {
        'learnpython': [
            'give up',
            'too hard',
            'frustrated',
            'struggling',
            'quit python',
            'overwhelmed',
            'beginner'
        ],
        'learnprogramming': [
            'give up',
            'too hard',
            'overwhelmed',
            'losing motivation',
            'quit programming'
        ],
        'datascience': [
            'beginner',
            'getting started',
            'too expensive',
            'coursera',
            'udemy',
            'free resources',
            'learning path'
        ]
    }

    scraper = RedditScraper()
    scraper.scrape_multiple_queries(subreddit_queries, max_posts_per_query=30)

    # 데이터 저장
    csv_path, excel_path, df = scraper.save_data('minjun_reddit_posts')

    if df is not None and not df.empty:
        print(f"\n📈 수집 결과 요약:")
        print(f"  - 총 게시글: {len(df)}개")
        print(f"  - 서브레딧별 분포:")
        print(df.groupby('subreddit').size().to_string())

    return df


if __name__ == "__main__":
    main()
