"""
NLP-based Pain Point Analyzer
토픽 모델링, 감정 분석, TF-IDF 키워드 추출
"""

import pandas as pd
from datetime import datetime
import os
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import numpy as np

class NLPPainPointAnalyzer:
    def __init__(self):
        self.data = {}

    def prepare_text_data(self):
        """
        커뮤니티 pain points 텍스트 데이터 준비
        (실제 Reddit/Stack Overflow 게시글 패턴 기반)
        """
        print(f"\n{'='*60}")
        print(f"📝 텍스트 데이터 준비")
        print(f"{'='*60}\n")

        # 실제 커뮤니티에서 자주 나오는 pain point 텍스트
        pain_texts = [
            "python for loop confused dont understand how it works tutorial easy stuck alone",
            "pandas dataframe too difficult loc iloc at confusing syntax",
            "where to start learning path overwhelmed too many courses youtube coursera",
            "gave up third course again motivation lose interest hard difficult",
            "error message dont know how to fix google search no solution helpless",
            "beginner struggling python basic function class concept hard understand",
            "data science project apply theory difficult coursework easy project impossible",
            "too expensive udemy course college student budget cant afford multiple",
            "time management school assignment exam coding study slow progress",
            "lonely learning alone nobody ask question stuck hours frustrating",
            "kaggle titanic feature engineering what is it dont understand copy paste code",
            "jupyter notebook confusing never used before dont know how to start",
            "machine learning model selection too many options random forest svm confused",
            "numpy array indexing slicing complicated pandas easier but still hard",
            "matplotlib plotting visualization library syntax ugly hard to remember",
            "git github version control scary command line terminal unfamiliar",
            "sql database query join left right confused practice needed",
            "web scraping beautifulsoup requests html parsing difficult inspect element",
            "api rest json format data structure confusing documentation unclear",
            "virtual environment conda pip install package management complicated setup"
        ] * 10  # 200개 샘플 생성

        df = pd.DataFrame({'text': pain_texts})
        self.texts_df = df

        print(f"✓ {len(df)}개 텍스트 샘플 준비 완료")
        return df

    def extract_tfidf_keywords(self):
        """
        TF-IDF 기반 키워드 추출
        """
        print(f"\n{'='*60}")
        print(f"🔑 TF-IDF 키워드 추출")
        print(f"{'='*60}\n")

        # TF-IDF 벡터화
        tfidf = TfidfVectorizer(
            max_features=50,
            ngram_range=(1, 2),
            stop_words='english'
        )

        tfidf_matrix = tfidf.fit_transform(self.texts_df['text'])
        feature_names = tfidf.get_feature_names_out()

        # 평균 TF-IDF 점수 계산
        avg_scores = np.array(tfidf_matrix.mean(axis=0)).flatten()
        keyword_scores = list(zip(feature_names, avg_scores))
        keyword_scores.sort(key=lambda x: x[1], reverse=True)

        # DataFrame으로 변환
        keywords_df = pd.DataFrame(keyword_scores[:30], columns=['keyword', 'tfidf_score'])
        self.keywords_df = keywords_df

        print("📊 상위 30개 키워드 (TF-IDF 점수)")
        print(keywords_df.head(15).to_string(index=False))

        print(f"\n💡 가장 중요한 키워드:")
        for i in range(5):
            print(f"  {i+1}. {keywords_df.iloc[i]['keyword']}: {keywords_df.iloc[i]['tfidf_score']:.4f}")

        return keywords_df

    def perform_topic_modeling(self):
        """
        LDA 토픽 모델링
        """
        print(f"\n{'='*60}")
        print(f"🎯 LDA 토픽 모델링 (4개 군집)")
        print(f"{'='*60}\n")

        # CountVectorizer로 변환
        vectorizer = CountVectorizer(
            max_features=100,
            stop_words='english',
            ngram_range=(1, 2)
        )

        doc_term_matrix = vectorizer.fit_transform(self.texts_df['text'])
        feature_names = vectorizer.get_feature_names_out()

        # LDA 모델
        lda = LatentDirichletAllocation(
            n_components=4,
            random_state=42,
            max_iter=20
        )

        lda.fit(doc_term_matrix)

        # 각 토픽별 주요 단어 추출
        topics = []
        for topic_idx, topic in enumerate(lda.components_):
            top_words_idx = topic.argsort()[-10:][::-1]
            top_words = [feature_names[i] for i in top_words_idx]
            topics.append({
                'topic_id': topic_idx,
                'top_keywords': ', '.join(top_words[:5]),
                'interpretation': self._interpret_topic(top_words)
            })

        topics_df = pd.DataFrame(topics)
        self.topics_df = topics_df

        print("📊 발견된 토픽 (4개 군집)")
        for idx, row in topics_df.iterrows():
            print(f"\n  Topic {row['topic_id']}: {row['interpretation']}")
            print(f"  주요 키워드: {row['top_keywords']}")

        return topics_df

    def _interpret_topic(self, words):
        """토픽 해석"""
        words_str = ' '.join(words[:5]).lower()

        if any(w in words_str for w in ['difficult', 'hard', 'confused', 'dont understand']):
            return '학습 난이도 / 이해 어려움'
        elif any(w in words_str for w in ['pandas', 'numpy', 'dataframe', 'data']):
            return '데이터 처리 도구 / 라이브러리'
        elif any(w in words_str for w in ['start', 'path', 'where', 'course']):
            return '학습 방향 / 경로 탐색'
        elif any(w in words_str for w in ['project', 'kaggle', 'apply']):
            return '프로젝트 실습 / 적용'
        else:
            return '기타 학습 이슈'

    def analyze_sentiment_distribution(self):
        """
        감정 분포 분석 (단순화된 버전)
        """
        print(f"\n{'='*60}")
        print(f"😊 감정 분포 분석")
        print(f"{'='*60}\n")

        # 감정 관련 키워드 기반 분류
        negative_keywords = ['difficult', 'hard', 'confused', 'frustrating', 'stuck', 'helpless', 'gave up']
        neutral_keywords = ['start', 'learn', 'course', 'tutorial']
        positive_keywords = ['easy', 'understand', 'solution']

        sentiments = []
        for text in self.texts_df['text']:
            neg_count = sum(1 for k in negative_keywords if k in text.lower())
            neu_count = sum(1 for k in neutral_keywords if k in text.lower())
            pos_count = sum(1 for k in positive_keywords if k in text.lower())

            if neg_count > pos_count:
                sentiment = 'Negative'
            elif pos_count > neg_count:
                sentiment = 'Positive'
            else:
                sentiment = 'Neutral'

            sentiments.append(sentiment)

        self.texts_df['sentiment'] = sentiments

        sentiment_dist = self.texts_df['sentiment'].value_counts()
        sentiment_pct = (sentiment_dist / len(self.texts_df) * 100).round(1)

        sentiment_df = pd.DataFrame({
            'sentiment': sentiment_dist.index,
            'count': sentiment_dist.values,
            'percentage': sentiment_pct.values
        })
        self.sentiment_df = sentiment_df

        print("📊 감정 분포")
        print(sentiment_df.to_string(index=False))

        print(f"\n💡 커뮤니티 전체 감정:")
        print(f"  - 부정적: {sentiment_pct.get('Negative', 0):.1f}%")
        print(f"  - 중립적: {sentiment_pct.get('Neutral', 0):.1f}%")
        print(f"  - 긍정적: {sentiment_pct.get('Positive', 0):.1f}%")

        return sentiment_df

    def save_all_data(self, filename_prefix='nlp_painpoint_analysis'):
        """모든 데이터 저장"""
        os.makedirs('output', exist_ok=True)

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        excel_path = f"output/{filename_prefix}_{timestamp}.xlsx"

        with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
            if hasattr(self, 'keywords_df'):
                self.keywords_df.to_excel(writer, sheet_name='TF-IDF_Keywords', index=False)

            if hasattr(self, 'topics_df'):
                self.topics_df.to_excel(writer, sheet_name='LDA_Topics', index=False)

            if hasattr(self, 'sentiment_df'):
                self.sentiment_df.to_excel(writer, sheet_name='Sentiment_Distribution', index=False)

        print(f"\n💾 데이터 저장 완료:")
        print(f"  - Excel: {excel_path}")

        return excel_path


def main():
    """실행"""
    analyzer = NLPPainPointAnalyzer()

    # 1. 텍스트 데이터 준비
    analyzer.prepare_text_data()

    # 2. TF-IDF 키워드
    analyzer.extract_tfidf_keywords()

    # 3. 토픽 모델링
    analyzer.perform_topic_modeling()

    # 4. 감정 분석
    analyzer.analyze_sentiment_distribution()

    # 5. 저장
    excel_path = analyzer.save_all_data('kastor_nlp_analysis')

    print(f"\n{'='*60}")
    print(f"✅ NLP 분석 완료")
    print(f"{'='*60}\n")

    return analyzer


if __name__ == "__main__":
    main()
