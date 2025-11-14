"""
Hacker News API Scraper
민준 페르소나: Python/프로그래밍 학습 관련 토론 수집
"""

import requests
import pandas as pd
from datetime import datetime
import time
from tqdm import tqdm
import os

class HackerNewsScraper:
    def __init__(self):
        self.base_url = "https://hacker-news.firebaseio.com/v0"
        self.stories = []

    def search_algolia(self, query, tags=None, num_pages=5):
        """
        Algolia HN Search API 사용

        Args:
            query: 검색 키워드
            tags: 태그 필터 (예: 'story', 'comment')
            num_pages: 검색 페이지 수
        """
        print(f"\n🔍 검색 중: '{query}'")

        search_url = "http://hn.algolia.com/api/v1/search"

        for page in range(num_pages):
            params = {
                'query': query,
                'tags': tags or 'story',
                'page': page,
                'hitsPerPage': 50
            }

            try:
                response = requests.get(search_url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()

                hits = data.get('hits', [])

                for hit in hits:
                    story_data = {
                        'search_query': query,
                        'title': hit.get('title', ''),
                        'url': hit.get('url', ''),
                        'author': hit.get('author', ''),
                        'points': hit.get('points', 0),
                        'num_comments': hit.get('num_comments', 0),
                        'created_at': hit.get('created_at', ''),
                        'story_text': hit.get('story_text', ''),
                        'objectID': hit.get('objectID', ''),
                        'hn_url': f"https://news.ycombinator.com/item?id={hit.get('objectID', '')}",
                        'collected_at': datetime.now()
                    }
                    self.stories.append(story_data)

                print(f"  페이지 {page + 1}/{num_pages}: {len(hits)}개 스토리")
                time.sleep(1)  # Rate limiting

            except requests.exceptions.RequestException as e:
                print(f"  ❌ 오류 (페이지 {page + 1}): {str(e)}")
                continue

        print(f"  ✓ 총 {len([s for s in self.stories if s['search_query'] == query])}개 수집")

    def search_multiple_queries(self, queries, num_pages=5):
        """여러 검색어로 데이터 수집"""
        print(f"\n{'='*60}")
        print(f"📰 Hacker News 검색 시작")
        print(f"{'='*60}")
        print(f"검색 키워드: {len(queries)}개")
        print(f"페이지당: {num_pages}페이지\n")

        for idx, query in enumerate(queries, 1):
            print(f"\n[{idx}/{len(queries)}]", end=" ")
            self.search_algolia(query, tags='story', num_pages=num_pages)

        print(f"\n{'='*60}")
        print(f"✅ 검색 완료: 총 {len(self.stories)}개 스토리")
        print(f"{'='*60}\n")

    def to_dataframe(self):
        """DataFrame으로 변환"""
        if not self.stories:
            return pd.DataFrame()

        df = pd.DataFrame(self.stories)

        # 중복 제거
        original_count = len(df)
        df = df.drop_duplicates(subset=['objectID'])
        removed = original_count - len(df)

        print(f"📊 데이터 정리 완료: {len(df)}개 고유 스토리 (중복 {removed}개 제거)")
        return df

    def save_data(self, filename_prefix='hackernews_stories'):
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
    # 민준 페르소나 타겟 검색어
    search_queries = [
        'python beginner',
        'learning python',
        'python difficult',
        'learn programming',
        'data science beginner',
        'coding bootcamp',
        'online courses',
        'python tutorial',
        'programming frustration',
        'give up programming'
    ]

    scraper = HackerNewsScraper()
    scraper.search_multiple_queries(search_queries, num_pages=3)

    # 데이터 저장
    csv_path, excel_path, df = scraper.save_data('minjun_hackernews')

    if df is not None and not df.empty:
        print(f"\n📈 수집 결과 요약:")
        print(f"  - 총 스토리: {len(df)}개")
        print(f"  - 평균 포인트: {df['points'].mean():.1f}")
        print(f"  - 평균 댓글 수: {df['num_comments'].mean():.1f}")
        print(f"\n🔥 인기 토픽 (상위 5개):")
        top_stories = df.nlargest(5, 'points')[['title', 'points', 'num_comments']]
        for idx, row in top_stories.iterrows():
            print(f"  {row['points']:4d}점 | {row['num_comments']:3d}댓글 | {row['title'][:60]}")

    return df


if __name__ == "__main__":
    main()
