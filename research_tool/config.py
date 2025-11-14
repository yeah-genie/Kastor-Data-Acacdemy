"""
Configuration for Kastor Data Academy Research Tool
"""

# Target Subreddits (Focused on Minjun Persona)
SUBREDDITS = {
    'learnprogramming': {
        'keywords': [
            'too hard',
            'give up',
            'quit programming',
            'motivation',
            'beginner struggle',
            'learning curve',
            'where to start',
            'overwhelmed',
            'self taught',
            'bootcamp vs degree',
            'python frustrating',
            'cant understand',
            'losing motivation'
        ],
        'description': '프로그래밍 학습자 어려움'
    },
    'datascience': {
        'keywords': [
            'beginner',
            'getting started',
            'learning path',
            'resources',
            'career change',
            'self study',
            'online course',
            'python data science',
            'coursera worth it',
            'udemy vs coursera',
            'too expensive',
            'free resources'
        ],
        'description': '데이터 사이언스 진입 장벽'
    },
    'learnpython': {
        'keywords': [
            'beginner',
            'struggling',
            'give up',
            'too hard',
            'where to start',
            'overwhelmed',
            'learning resources',
            'motivation',
            'quit python',
            'frustrated',
            'not getting it',
            'slow progress'
        ],
        'description': 'Python 초보자 좌절 경험'
    }
}

# Search Parameters
MAX_POSTS_PER_KEYWORD = 50
TIME_FILTER = 'year'  # 'hour', 'day', 'week', 'month', 'year', 'all'
SORT_BY = 'relevance'  # 'relevance', 'hot', 'top', 'new', 'comments'

# Analysis Settings
MIN_UPVOTES = 5  # 최소 업보트 수
MIN_COMMENTS = 2  # 최소 댓글 수
SENTIMENT_THRESHOLD = 0.1  # 감정 분석 임계값

# Report Settings
REPORT_TITLE = "Kastor Data Academy - 시장 조사 리포트"
REPORT_SUBTITLE = "청소년 데이터 교육 니즈 분석"
OUTPUT_DIR = "output"
