"""
Dev.to API Scraper
민준 페르소나: Python/프로그래밍 초보자 블로그 글 수집
"""

import requests
import pandas as pd
from datetime import datetime
import time
from tqdm import tqdm
import os

class DevToScraper:
    def __init__(self):
        self.base_url = "https://dev.to/api"
        self.articles = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'MinjunResearch/1.0'
        })

    def search_articles(self, tag, per_page=30, num_pages=5):
        """
        태그별 글 검색

        Args:
            tag: 검색 태그 (예: 'python', 'beginners')
            per_page: 페이지당 글 수
            num_pages: 검색 페이지 수
        """
        print(f"\n🏷️  태그 검색: '{tag}'")

        for page in range(1, num_pages + 1):
            params = {
                'tag': tag,
                'per_page': per_page,
                'page': page
            }

            try:
                response = self.session.get(
                    f"{self.base_url}/articles",
                    params=params,
                    timeout=10
                )
                response.raise_for_status()
                articles = response.json()

                for article in articles:
                    article_data = {
                        'search_tag': tag,
                        'title': article.get('title', ''),
                        'description': article.get('description', ''),
                        'url': article.get('url', ''),
                        'published_at': article.get('published_at', ''),
                        'tags': ', '.join(article.get('tag_list', [])),
                        'reactions': article.get('public_reactions_count', 0),
                        'comments': article.get('comments_count', 0),
                        'reading_time': article.get('reading_time_minutes', 0),
                        'user': article.get('user', {}).get('username', ''),
                        'article_id': article.get('id', ''),
                        'collected_at': datetime.now()
                    }
                    self.articles.append(article_data)

                print(f"  페이지 {page}/{num_pages}: {len(articles)}개 글")
                time.sleep(1)  # Rate limiting

            except requests.exceptions.RequestException as e:
                print(f"  ❌ 오류 (페이지 {page}): {str(e)}")
                continue

        print(f"  ✓ 총 {len([a for a in self.articles if a['search_tag'] == tag])}개 수집")

    def search_multiple_tags(self, tags, per_page=30, num_pages=5):
        """여러 태그로 데이터 수집"""
        print(f"\n{'='*60}")
        print(f"📝 Dev.to 글 수집 시작")
        print(f"{'='*60}")
        print(f"검색 태그: {len(tags)}개")
        print(f"페이지당: {num_pages}페이지\n")

        for idx, tag in enumerate(tags, 1):
            print(f"\n[{idx}/{len(tags)}]", end=" ")
            self.search_articles(tag, per_page=per_page, num_pages=num_pages)

        print(f"\n{'='*60}")
        print(f"✅ 수집 완료: 총 {len(self.articles)}개 글")
        print(f"{'='*60}\n")

    def to_dataframe(self):
        """DataFrame으로 변환"""
        if not self.articles:
            return pd.DataFrame()

        df = pd.DataFrame(self.articles)

        # 중복 제거
        original_count = len(df)
        df = df.drop_duplicates(subset=['article_id'])
        removed = original_count - len(df)

        print(f"📊 데이터 정리 완료: {len(df)}개 고유 글 (중복 {removed}개 제거)")
        return df

    def save_data(self, filename_prefix='devto_articles'):
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
    # 민준 페르소나 타겟 태그
    search_tags = [
        'python',
        'beginners',
        'tutorial',
        'learning',
        'programming',
        'datascience',
        'coding',
        'webdev',
        'javascript'  # 비교를 위해
    ]

    scraper = DevToScraper()
    scraper.search_multiple_tags(search_tags, per_page=30, num_pages=3)

    # 데이터 저장
    csv_path, excel_path, df = scraper.save_data('minjun_devto')

    if df is not None and not df.empty:
        print(f"\n📈 수집 결과 요약:")
        print(f"  - 총 글: {len(df)}개")
        print(f"  - 평균 반응 수: {df['reactions'].mean():.1f}")
        print(f"  - 평균 댓글 수: {df['comments'].mean():.1f}")
        print(f"  - 평균 읽기 시간: {df['reading_time'].mean():.1f}분")
        print(f"\n🔥 인기 글 (상위 5개):")
        top_articles = df.nlargest(5, 'reactions')[['title', 'reactions', 'comments', 'search_tag']]
        for idx, row in top_articles.iterrows():
            print(f"  {row['reactions']:4d}❤️  | {row['comments']:3d}💬 | [{row['search_tag']}] {row['title'][:50]}")

    return df


if __name__ == "__main__":
    main()
