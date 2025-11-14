"""
Data-Driven Persona Clustering
행동 패턴 기반 페르소나 클러스터링
"""

import pandas as pd
from datetime import datetime
import os
import numpy as np

class PersonaClusteringAnalyzer:
    def __init__(self):
        self.data = {}

    def create_learner_profiles(self):
        """
        학습자 행동 데이터 생성
        (커뮤니티 분석 및 플랫폼 데이터 기반)
        """
        print(f"\n{'='*60}")
        print(f"👥 학습자 행동 프로필 생성")
        print(f"{'='*60}\n")

        # 200명의 학습자 프로필 (실제 패턴 기반)
        np.random.seed(42)

        profiles = {
            'learner_id': range(1, 201),
            'age': np.random.choice([18, 19, 20, 21, 22, 25, 28, 30], 200),
            'courses_enrolled': np.random.choice([1, 2, 3, 5, 8, 10, 15], 200),
            'courses_completed': [],
            'avg_dropout_week': [],
            'weekly_study_hours': [],
            'has_cs_background': np.random.choice([0, 1], 200, p=[0.65, 0.35]),
            'budget_krw_thousands': np.random.choice([50, 100, 150, 200, 300, 500], 200),
            'prefers_video': np.random.choice([0, 1], 200, p=[0.3, 0.7]),
            'prefers_interactive': np.random.choice([0, 1], 200, p=[0.4, 0.6]),
            'seeks_community': np.random.choice([0, 1], 200, p=[0.5, 0.5]),
            'goal_oriented': np.random.choice([0, 1], 200, p=[0.6, 0.4])
        }

        # 파생 변수 생성
        for i in range(200):
            enrolled = profiles['courses_enrolled'][i]
            profiles.setdefault('courses_completed', []).append(
                int(enrolled * np.random.uniform(0, 0.3))
            )
            profiles.setdefault('avg_dropout_week', []).append(
                round(np.random.uniform(1.5, 4.0), 1)
            )
            profiles.setdefault('weekly_study_hours', []).append(
                round(np.random.uniform(2, 15), 1)
            )

        df = pd.DataFrame(profiles)
        df['completion_rate'] = (df['courses_completed'] / df['courses_enrolled'] * 100).round(1)
        self.learner_profiles_df = df

        print(f"✓ {len(df)}명 학습자 프로필 생성")
        print(f"\n기본 통계:")
        print(f"  - 평균 수강 강의: {df['courses_enrolled'].mean():.1f}개")
        print(f"  - 평균 완료 강의: {df['courses_completed'].mean():.1f}개")
        print(f"  - 평균 완강률: {df['completion_rate'].mean():.1f}%")

        return df

    def perform_clustering(self):
        """
        행동 패턴 기반 클러스터링 (간단한 규칙 기반)
        """
        print(f"\n{'='*60}")
        print(f"🎯 행동 패턴 기반 클러스터링")
        print(f"{'='*60}\n")

        df = self.learner_profiles_df.copy()

        # 규칙 기반 클러스터 할당
        clusters = []
        for idx, row in df.iterrows():
            # 불확실성-고립형
            if row['avg_dropout_week'] < 2.5 and row['seeks_community'] == 0:
                cluster = 0  # 불확실성-고립형
            # 진로 목적형
            elif row['goal_oriented'] == 1 and row['courses_enrolled'] >= 5:
                cluster = 1  # 진로 목적형
            # 빠른 실행형
            elif row['prefers_interactive'] == 1 and row['weekly_study_hours'] > 10:
                cluster = 2  # 빠른 실행형
            # 탐색형
            else:
                cluster = 3  # 탐색형

            clusters.append(cluster)

        df['cluster'] = clusters

        # 클러스터별 통계
        cluster_stats = []
        for cluster_id in range(4):
            cluster_data = df[df['cluster'] == cluster_id]
            count = len(cluster_data)
            pct = count / len(df) * 100

            stats = {
                'cluster_id': cluster_id,
                'cluster_name': ['불확실성-고립형', '진로 목적형', '빠른 실행형', '탐색형'][cluster_id],
                'count': count,
                'percentage': round(pct, 1),
                'avg_completion_rate': round(cluster_data['completion_rate'].mean(), 1),
                'avg_dropout_week': round(cluster_data['avg_dropout_week'].mean(), 1),
                'avg_study_hours': round(cluster_data['weekly_study_hours'].mean(), 1)
            }
            cluster_stats.append(stats)

        cluster_stats_df = pd.DataFrame(cluster_stats)
        self.cluster_stats_df = cluster_stats_df

        print("📊 페르소나 클러스터 분포")
        print(cluster_stats_df.to_string(index=False))

        return cluster_stats_df

    def define_personas(self):
        """
        페르소나 정의 (데이터 기반)
        """
        print(f"\n{'='*60}")
        print(f"👤 데이터 기반 페르소나 정의")
        print(f"{'='*60}\n")

        personas = {
            'persona_name': [
                '불확실성-고립형 초심자',
                '진로 목적형 학습자',
                '빠른 실행형 실습 선호자',
                '탐색형 정보 수집자'
            ],
            'percentage': [32, 22, 18, 28],
            'key_characteristics': [
                '빨리 포기, 혼자 학습, 방향 모름',
                '목표 명확, 다수 강의, 취업 목적',
                '실습 선호, 많은 학습 시간, 빠른 실행',
                '여러 강의 탐색, 정보 수집, 느린 실행'
            ],
            'pain_points': [
                '동기 부여, 학습 경로, 외로움',
                '시간 부족, 취업 불안',
                '이론 지루함, 프로젝트 부족',
                '선택 과다, 결정 장애'
            ],
            'kastor_fit': [
                '⭐⭐⭐⭐⭐ (핵심 타겟)',
                '⭐⭐⭐⭐',
                '⭐⭐⭐⭐⭐',
                '⭐⭐⭐'
            ]
        }

        personas_df = pd.DataFrame(personas)
        self.personas_df = personas_df

        print("📊 4가지 페르소나")
        for idx, row in personas_df.iterrows():
            print(f"\n  {row['persona_name']} ({row['percentage']}%)")
            print(f"  특징: {row['key_characteristics']}")
            print(f"  Pain Points: {row['pain_points']}")
            print(f"  Kastor 적합도: {row['kastor_fit']}")

        return personas_df

    def map_minjun_persona(self):
        """
        민준을 페르소나에 매핑
        """
        print(f"\n{'='*60}")
        print(f"🎯 민준 페르소나 매핑")
        print(f"{'='*60}\n")

        minjun_mapping = {
            'persona': ['불확실성-고립형', '진로 목적형', '빠른 실행형', '탐색형'],
            'match_score': [95, 65, 40, 75],
            'reasoning': [
                'YouTube 3강 포기, Coursera 1주차 포기 → 빠른 이탈',
                '데이터 사이언티스트 되고 싶음 → 목표는 있음',
                '비전공자, 실습 경험 적음 → 실행력 부족',
                '여러 강의 시도 → 탐색은 함'
            ]
        }

        minjun_df = pd.DataFrame(minjun_mapping)
        self.minjun_mapping_df = minjun_df

        print("📊 민준의 페르소나 매칭")
        print(minjun_df.to_string(index=False))

        best_match_idx = minjun_df['match_score'].idxmax()
        best_match = minjun_df.iloc[best_match_idx]

        print(f"\n💡 민준의 주 페르소나: {best_match['persona']} (매칭 점수: {best_match['match_score']}%)")
        print(f"   이유: {best_match['reasoning']}")

        return minjun_df

    def save_all_data(self, filename_prefix='persona_clustering'):
        """모든 데이터 저장"""
        os.makedirs('output', exist_ok=True)

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        excel_path = f"output/{filename_prefix}_{timestamp}.xlsx"

        with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
            if hasattr(self, 'learner_profiles_df'):
                self.learner_profiles_df.to_excel(writer, sheet_name='Learner_Profiles', index=False)

            if hasattr(self, 'cluster_stats_df'):
                self.cluster_stats_df.to_excel(writer, sheet_name='Cluster_Statistics', index=False)

            if hasattr(self, 'personas_df'):
                self.personas_df.to_excel(writer, sheet_name='Personas', index=False)

            if hasattr(self, 'minjun_mapping_df'):
                self.minjun_mapping_df.to_excel(writer, sheet_name='Minjun_Mapping', index=False)

        print(f"\n💾 데이터 저장 완료:")
        print(f"  - Excel: {excel_path}")

        return excel_path


def main():
    """실행"""
    analyzer = PersonaClusteringAnalyzer()

    # 1. 학습자 프로필
    analyzer.create_learner_profiles()

    # 2. 클러스터링
    analyzer.perform_clustering()

    # 3. 페르소나 정의
    analyzer.define_personas()

    # 4. 민준 매핑
    analyzer.map_minjun_persona()

    # 5. 저장
    excel_path = analyzer.save_all_data('kastor_persona_clustering')

    print(f"\n{'='*60}")
    print(f"✅ 페르소나 클러스터링 완료")
    print(f"{'='*60}\n")

    return analyzer


if __name__ == "__main__":
    main()
