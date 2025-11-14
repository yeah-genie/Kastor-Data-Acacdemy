"""
Stack Overflow Scraper
민준 페르소나: 초보자 질문에서 pain points 추출
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import time
import os
import re

class StackOverflowScraper:
    def __init__(self):
        self.questions = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def search_questions(self, tag, keywords, max_results=50):
        """
        태그와 키워드로 질문 검색

        Args:
            tag: 태그 (예: 'python', 'pandas')
            keywords: 검색 키워드 (예: 'beginner', 'confused')
            max_results: 최대 결과 수
        """
        print(f"\n🔍 검색: [{tag}] {keywords}")

        # Stack Overflow 검색 URL
        search_query = f"[{tag}] {keywords}"
        url = f"https://stackoverflow.com/search?q={search_query.replace(' ', '+')}"

        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # 검색 결과 파싱
            results = soup.find_all('div', class_='s-post-summary', limit=max_results)

            for result in results:
                try:
                    question_data = self._parse_question(result, tag, keywords)
                    if question_data:
                        self.questions.append(question_data)
                except Exception as e:
                    continue

            print(f"  ✓ {len(results)}개 질문 수집")

        except requests.exceptions.RequestException as e:
            print(f"  ❌ 오류: {str(e)}")
        except Exception as e:
            print(f"  ❌ 파싱 오류: {str(e)}")

        time.sleep(2)  # Rate limiting

    def _parse_question(self, result, tag, keywords):
        """질문 정보 파싱"""
        try:
            # 제목
            title_elem = result.find('h3', class_='s-post-summary--content-title')
            if not title_elem:
                title_elem = result.find('a', class_='s-link')
            title = title_elem.get_text(strip=True) if title_elem else "N/A"

            # URL
            link_elem = result.find('a', class_='s-link')
            url = "https://stackoverflow.com" + link_elem['href'] if link_elem and 'href' in link_elem.attrs else "N/A"

            # 본문 미리보기
            excerpt_elem = result.find('div', class_='s-post-summary--content-excerpt')
            excerpt = excerpt_elem.get_text(strip=True) if excerpt_elem else ""

            # 통계 (votes, answers, views)
            stats = result.find_all('span', class_='s-post-summary--stats-item-number')
            votes = stats[0].get_text(strip=True) if len(stats) > 0 else "0"
            answers = stats[1].get_text(strip=True) if len(stats) > 1 else "0"
            views = stats[2].get_text(strip=True) if len(stats) > 2 else "0"

            # 태그들
            tags_elem = result.find_all('a', class_='post-tag')
            tags = [tag.get_text(strip=True) for tag in tags_elem]

            return {
                'search_tag': tag,
                'search_keywords': keywords,
                'title': title,
                'excerpt': excerpt,
                'url': url,
                'votes': votes,
                'answers': answers,
                'views': views,
                'tags': ', '.join(tags),
                'collected_at': datetime.now()
            }

        except Exception as e:
            return None

    def scrape_beginner_pain_points(self):
        """초보자 pain points 검색"""
        print(f"\n{'='*60}")
        print(f"📚 Stack Overflow 초보자 Pain Points 수집")
        print(f"{'='*60}")

        # 민준 페르소나 타겟 검색어
        searches = [
            ('python', 'beginner confused'),
            ('python', 'too difficult'),
            ('python', 'dont understand'),
            ('pandas', 'beginner struggling'),
            ('pandas', 'confusing'),
            ('data-science', 'beginner help'),
            ('machine-learning', 'beginner tutorial'),
            ('numpy', 'beginner error'),
        ]

        for tag, keywords in searches:
            self.search_questions(tag, keywords, max_results=30)

        print(f"\n{'='*60}")
        print(f"✅ 수집 완료: 총 {len(self.questions)}개 질문")
        print(f"{'='*60}\n")

    def to_dataframe(self):
        """DataFrame으로 변환"""
        if not self.questions:
            return pd.DataFrame()

        df = pd.DataFrame(self.questions)

        # 중복 제거
        original_count = len(df)
        df = df.drop_duplicates(subset=['url'])
        removed = original_count - len(df)

        print(f"📊 데이터 정리 완료: {len(df)}개 고유 질문 (중복 {removed}개 제거)")
        return df

    def save_data(self, filename_prefix='stackoverflow_painpoints'):
        """데이터 저장"""
        df = self.to_dataframe()

        if df.empty:
            print("⚠ 저장할 데이터가 없습니다.")
            return None, None

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

        return csv_path, excel_path


def main():
    """실행"""
    scraper = StackOverflowScraper()
    scraper.scrape_beginner_pain_points()

    csv_path, excel_path = scraper.save_data('minjun_stackoverflow')

    df = scraper.to_dataframe()
    if not df.empty:
        print(f"\n📈 수집 결과:")
        print(f"  - 총 질문: {len(df)}개")
        print(f"  - 평균 조회수: {df['views'].apply(lambda x: int(str(x).replace('k', '000').replace('m', '000000')) if str(x).replace('k', '').replace('m', '').isdigit() else 0).mean():.0f}")

    return df


if __name__ == "__main__":
    main()
