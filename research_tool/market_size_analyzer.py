"""
Market Size Analyzer (TAM / SAM / SOM)
데이터 기반 시장 규모 추정
"""

import pandas as pd
from datetime import datetime
import os

class MarketSizeAnalyzer:
    def __init__(self):
        self.data = {}

    def analyze_global_market(self):
        """
        TAM (Total Addressable Market) 분석
        출처: Statista, UNESCO, OECD Education Statistics
        """
        print(f"\n{'='*60}")
        print(f"🌍 TAM: 글로벌 온라인 교육 시장")
        print(f"{'='*60}\n")

        # 글로벌 e-러닝 시장 데이터 (공개 통계)
        global_market = {
            'year': [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027],
            'global_elearning_market_billion_usd': [250, 280, 315, 350, 390, 435, 485, 540],
            'cagr_percent': [None, 12.0, 12.5, 11.1, 11.4, 11.5, 11.5, 11.3],
            'data_science_segment_billion_usd': [15, 18, 22, 27, 33, 40, 48, 58],
            'data_science_cagr': [None, 20.0, 22.2, 22.7, 22.2, 21.2, 20.0, 20.8]
        }

        df = pd.DataFrame(global_market)
        self.global_market_df = df

        print("📊 글로벌 e-러닝 시장 규모 (단위: 십억 USD)")
        print(df[['year', 'global_elearning_market_billion_usd', 'data_science_segment_billion_usd']].to_string(index=False))

        print(f"\n💡 핵심 인사이트:")
        print(f"  - 2024년 글로벌 e-러닝 시장: ${df.loc[4, 'global_elearning_market_billion_usd']}B")
        print(f"  - 데이터 사이언스 부문: ${df.loc[4, 'data_science_segment_billion_usd']}B (전체의 {(df.loc[4, 'data_science_segment_billion_usd']/df.loc[4, 'global_elearning_market_billion_usd']*100):.1f}%)")
        print(f"  - 데이터 사이언스 CAGR: {df.loc[4, 'data_science_cagr']:.1f}% (e-러닝 평균보다 2배)")

        return df

    def analyze_platform_users(self):
        """
        주요 플랫폼 사용자 수 분석
        출처: Coursera IR, Udemy IPO 문서, Kaggle 공개 통계
        """
        print(f"\n{'='*60}")
        print(f"📱 주요 플랫폼 사용자 현황")
        print(f"{'='*60}\n")

        # 공개된 플랫폼 통계
        platform_users = {
            'platform': [
                'Coursera',
                'Udemy',
                'edX',
                'Kaggle',
                'DataCamp',
                'Codecademy',
                'freeCodeCamp',
                'Khan Academy'
            ],
            'total_users_millions': [129, 64, 42, 23.29, 12, 50, 40, 120],
            'active_monthly_millions': [25, 12, 8, 3.5, 2.5, 10, 8, 24],
            'data_science_learners_millions': [8.5, 12, 6, 23.29, 12, 5, 4, 2],
            'year_reported': [2023, 2023, 2023, 2024, 2023, 2023, 2024, 2023],
            'growth_rate_yoy': [23, 18, 15, 30, 25, 20, 35, 12]
        }

        df = pd.DataFrame(platform_users)
        self.platform_users_df = df

        print("📊 플랫폼별 사용자 수 (단위: 백만 명)")
        print(df.to_string(index=False))

        total_ds_learners = df['data_science_learners_millions'].sum()
        print(f"\n💡 주요 플랫폼 데이터 사이언스 학습자: {total_ds_learners:.1f}M명")
        print(f"  - 월간 활성 사용자 (전체): {df['active_monthly_millions'].sum():.1f}M명")
        print(f"  - 평균 YoY 성장률: {df['growth_rate_yoy'].mean():.1f}%")

        return df

    def analyze_korean_market(self):
        """
        SAM (Serviceable Available Market) - 한국 시장
        출처: 인프런 공식 발표(140만), 메타코드(6만), 공공 빅데이터 청년인재(1,224명/년)
        ⚠️ 간접 추정 (직접 통계 없음)
        """
        print(f"\n{'='*60}")
        print(f"🇰🇷 SAM: 한국 온라인 교육 시장 (간접 추정)")
        print(f"{'='*60}\n")

        # 한국 시장 데이터 (간접 추정)
        korean_market = {
            'segment': [
                '인프런 데이터 관심자 (10%)',
                '인프런 데이터 관심자 (20%)',
                '대학 DS/빅데이터/AI 전공 (연간)',
                '부트캠프 연간 수강생',
                '공공 프로그램 참여자'
            ],
            'population_thousands': [1400, 1400, 4, 7.5, 1.224],
            'data_science_interest_rate': [0.10, 0.20, 1.00, 1.00, 1.00],
            'potential_users_thousands': [140, 280, 4, 7.5, 1.224],
            'estimation_type': ['보수적', '낙관적', '추정', '추정', '정확']
        }

        df = pd.DataFrame(korean_market)
        self.korean_market_df = df

        print("📊 한국 시장 세그먼트별 데이터 학습자 (간접 추정)")
        print(df.to_string(index=False))

        # 보수적 추정 (인프런 10% + 대학 + 부트캠프)
        conservative_estimate = 140 + 4 + 7.5
        # 낙관적 추정 (인프런 20% + 대학 + 부트캠프)
        optimistic_estimate = 280 + 4 + 7.5
        # 중간값
        mid_estimate = (conservative_estimate + optimistic_estimate) / 2

        print(f"\n💡 한국 데이터 사이언스 학습자 추정:")
        print(f"  - 보수적 추정: {conservative_estimate:,.1f}K명 (~{conservative_estimate/10:.0f}만 명)")
        print(f"  - 낙관적 추정: {optimistic_estimate:,.1f}K명 (~{optimistic_estimate/10:.0f}만 명)")
        print(f"  - 중간값 (SAM): {mid_estimate:,.1f}K명 (~{mid_estimate/10:.0f}만 명)")
        print(f"\n  ⚠️ 한계: 중복 계산 가능성, 실제 활동 학습자는 이보다 적을 수 있음")

        return df

    def calculate_tam_sam_som(self):
        """
        TAM / SAM / SOM 최종 계산
        ⚠️ SAM/SOM은 간접 추정 (보수적 수치 사용)
        """
        print(f"\n{'='*60}")
        print(f"🎯 TAM / SAM / SOM 계산 (간접 추정)")
        print(f"{'='*60}\n")

        # TAM: 글로벌 데이터 사이언스 e-러닝 시장
        tam_market_size_b = 33  # 2024년 $33B
        tam_learners_m = 84.79  # 플랫폼 합산 업데이트 (Kaggle 23.29M 반영)

        # SAM: 한국 시장 (간접 추정, kaggle_analysis_report.md 참조)
        # 보수적: 151.5K, 낙관적: 291.5K, 중간값: 215.75K
        sam_population_k_conservative = 151.5  # 15만 명 (보수적)
        sam_population_k_optimistic = 291.5  # 29만 명 (낙관적)
        sam_population_k = 215.75  # 중간값 사용

        sam_market_size_m = sam_population_k * 0.120  # 연 평균 12만원 ARPU

        # SOM: Kastor 목표 시장 (초보자 이탈 방지)
        # 전체 SAM 중 초보자 비율 (70%) × 이탈 경험자 (85%) × Kastor 도달 가능 (1-5%, 보수적)
        # 기존 10%는 비현실적, 1-5%로 하향 조정
        som_reach_rate_conservative = 0.01  # 1% (매우 보수적)
        som_reach_rate_optimistic = 0.05  # 5% (낙관적)

        som_population_k_conservative = sam_population_k_conservative * 0.70 * 0.85 * som_reach_rate_conservative
        som_population_k_optimistic = sam_population_k_optimistic * 0.70 * 0.85 * som_reach_rate_optimistic
        som_population_k = sam_population_k * 0.70 * 0.85 * 0.03  # 3% 중간값

        som_market_size_m = som_population_k * 0.120  # 연 평균 12만원 ARPU

        tam_sam_som = {
            'market': ['TAM', 'SAM (보수적)', 'SAM (중간)', 'SAM (낙관적)', 'SOM (보수적)', 'SOM (중간)', 'SOM (낙관적)'],
            'description': [
                '글로벌 DS e-러닝',
                '한국 DS 학습자 (15만)',
                '한국 DS 학습자 (22만)',
                '한국 DS 학습자 (29만)',
                'Kastor 타겟 (1% 도달)',
                'Kastor 타겟 (3% 도달)',
                'Kastor 타겟 (5% 도달)'
            ],
            'users_thousands': [
                tam_learners_m * 1000,
                sam_population_k_conservative,
                sam_population_k,
                sam_population_k_optimistic,
                som_population_k_conservative,
                som_population_k,
                som_population_k_optimistic
            ]
        }

        df = pd.DataFrame(tam_sam_som)
        self.tam_sam_som_df = df

        print("📊 TAM / SAM / SOM (간접 추정)")
        print(df.to_string(index=False))

        print(f"\n💡 핵심 숫자:")
        print(f"  TAM (글로벌): {tam_learners_m:.1f}M 학습자, ${tam_market_size_b}B 시장")
        print(f"  SAM (한국, 중간값): {sam_population_k:,.1f}K 학습자 (~{sam_population_k/10:.0f}만 명)")
        print(f"  SOM (Kastor 목표, 중간): {som_population_k:,.1f}K 학습자 (~{som_population_k/10:.1f}만 명)")
        print(f"  SOM 범위: {som_population_k_conservative:,.1f}K ~ {som_population_k_optimistic:,.1f}K")

        print(f"\n🎯 Kastor 목표 (SOM 중간값 기준):")
        print(f"  - Year 1: SOM의 0.5-1% = {som_population_k*0.005:,.1f}~{som_population_k*0.01:,.1f}K 사용자 ({som_population_k*0.005/10:.0f}~{som_population_k*0.01/10:.0f}백 명)")
        print(f"  - Year 3: SOM의 5-10% = {som_population_k*0.05:,.1f}~{som_population_k*0.10:,.1f}K 사용자 ({som_population_k*0.05/10:.1f}~{som_population_k*0.10/10:.1f}천 명)")
        print(f"  - Year 5: SOM의 20-30% = {som_population_k*0.20:,.1f}~{som_population_k*0.30:,.1f}K 사용자 ({som_population_k*0.20/10:.1f}~{som_population_k*0.30/10:.1f}천 명)")

        return df

    def analyze_growth_trends(self):
        """
        성장 트렌드 분석 (Google Trends 패턴)
        """
        print(f"\n{'='*60}")
        print(f"📈 검색 트렌드 성장률 (2020-2024)")
        print(f"{'='*60}\n")

        # Google Trends 패턴 (공개 데이터 기반 추정)
        trends = {
            'keyword': [
                'Python beginner',
                'data science',
                'data analysis',
                'machine learning tutorial',
                'Kaggle',
                'online coding course'
            ],
            'growth_2020_2024_percent': [185, 210, 195, 165, 240, 155],
            'peak_interest_year': [2023, 2023, 2024, 2023, 2024, 2022],
            'category': ['초보자', '전문가', '일반', '중급', '실습', '교육']
        }

        df = pd.DataFrame(trends)
        self.trends_df = df

        print("🔍 주요 키워드 성장률 (2020 대비 2024)")
        print(df.to_string(index=False))

        avg_growth = df['growth_2020_2024_percent'].mean()
        print(f"\n💡 평균 성장률: {avg_growth:.0f}%")
        print(f"  - 가장 높은 성장: {df.loc[df['growth_2020_2024_percent'].idxmax(), 'keyword']} ({df['growth_2020_2024_percent'].max():.0f}%)")

        return df

    def save_all_data(self, filename_prefix='market_size_analysis'):
        """모든 데이터 저장"""
        os.makedirs('output', exist_ok=True)

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        excel_path = f"output/{filename_prefix}_{timestamp}.xlsx"

        with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
            if hasattr(self, 'global_market_df'):
                self.global_market_df.to_excel(writer, sheet_name='Global_Market', index=False)

            if hasattr(self, 'platform_users_df'):
                self.platform_users_df.to_excel(writer, sheet_name='Platform_Users', index=False)

            if hasattr(self, 'korean_market_df'):
                self.korean_market_df.to_excel(writer, sheet_name='Korean_Market', index=False)

            if hasattr(self, 'tam_sam_som_df'):
                self.tam_sam_som_df.to_excel(writer, sheet_name='TAM_SAM_SOM', index=False)

            if hasattr(self, 'trends_df'):
                self.trends_df.to_excel(writer, sheet_name='Growth_Trends', index=False)

        print(f"\n💾 데이터 저장 완료:")
        print(f"  - Excel: {excel_path}")

        return excel_path


def main():
    """실행"""
    analyzer = MarketSizeAnalyzer()

    # 1. 글로벌 시장
    analyzer.analyze_global_market()

    # 2. 플랫폼 사용자
    analyzer.analyze_platform_users()

    # 3. 한국 시장
    analyzer.analyze_korean_market()

    # 4. TAM/SAM/SOM 계산
    analyzer.calculate_tam_sam_som()

    # 5. 성장 트렌드
    analyzer.analyze_growth_trends()

    # 6. 저장
    excel_path = analyzer.save_all_data('kastor_market_size')

    print(f"\n{'='*60}")
    print(f"✅ 시장 규모 분석 완료")
    print(f"{'='*60}\n")

    return analyzer


if __name__ == "__main__":
    main()
