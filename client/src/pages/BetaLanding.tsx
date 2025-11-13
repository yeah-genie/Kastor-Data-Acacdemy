import { FormEvent, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, Shield, Sparkles, Users } from "lucide-react";

const PageContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 0% 0%, rgba(33, 150, 243, 0.25), transparent 55%),
    radial-gradient(circle at 100% 0%, rgba(255, 152, 0, 0.2), transparent 55%),
    ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  font-family: "Inter", "Noto Sans KR", sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem clamp(1.5rem, 4vw, 3.5rem);
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const BrandTitle = styled.span`
  font-weight: 700;
  font-size: clamp(1.25rem, 2.5vw, 1.7rem);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeroSection = styled.section`
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: center;
  padding: clamp(2rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem);
`;

const HeroText = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 2rem);
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(33, 150, 243, 0.2);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2.3vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const CTAGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`;

const CTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.6rem;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.9), rgba(33, 150, 243, 0.6));
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 20px 40px rgba(33, 150, 243, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 24px 50px rgba(33, 150, 243, 0.45);
    }
  }
`;

const SecondaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 0.2rem;
  transition: color 0.2s ease, border-color 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${({ theme }) => theme.colors.white};
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: radial-gradient(circle at 30% 30%, rgba(33, 150, 243, 0.25), transparent 65%),
    rgba(23, 34, 51, 0.85);
  min-height: 320px;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
`;

const GlowingOrb = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.28;
  background: radial-gradient(circle at 30% 20%, rgba(33, 150, 243, 0.6), transparent 55%),
    radial-gradient(circle at 75% 65%, rgba(255, 152, 0, 0.5), transparent 50%);
`;

const VisualContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const VisualTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VisualList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
`;

const Section = styled.section`
  padding: clamp(2rem, 6vw, 4.5rem) clamp(1.5rem, 5vw, 4rem);
`;

const SectionLabel = styled.span`
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
`;

const SectionHeadline = styled.h2`
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin-top: 0.65rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Paragraph = styled.p`
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.65;
  max-width: 720px;
`;

const HighlightPanel = styled.div`
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

const HighlightCard = styled(motion.article)`
  padding: 1.6rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const IconBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(33, 150, 243, 0.18);
  color: ${({ theme }) => theme.colors.primary};
`;

const CardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
`;

const FeatureGrid = styled.div`
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
`;

const FeatureItem = styled(motion.div)`
  padding: 1.4rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const FAQList = styled.div`
  margin-top: 2.5rem;
  display: grid;
  gap: 1rem;
`;

const FAQItem = styled(motion.details)`
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem 1.2rem;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.white};
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  p {
    margin-top: 0.75rem;
    color: rgba(255, 255, 255, 0.68);
    line-height: 1.6;
  }
`;

const SubscribeCard = styled.section`
  margin: clamp(3rem, 6vw, 4.5rem) clamp(1.5rem, 5vw, 4rem);
  border-radius: 24px;
  border: 1px solid rgba(33, 150, 243, 0.35);
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.18), rgba(33, 150, 243, 0.05));
  box-shadow: 0 30px 60px rgba(33, 150, 243, 0.25);
  padding: clamp(2rem, 5vw, 3rem);
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.25rem);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const SubscribeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SubscribeTitle = styled.h3`
  font-size: clamp(1.6rem, 3.5vw, 2rem);
  font-weight: 700;
  line-height: 1.4;
`;

const SubscribeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EmailInput = styled.input`
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.35);
  padding: 0.85rem 1rem 0.85rem 2.8rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(0, 0, 0, 0.55);
  }
`;

const MailIcon = styled(Mail)`
  position: absolute;
  left: 0.95rem;
  width: 1.1rem;
  height: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
`;

const SubmitButton = styled.button<{ $success?: boolean }>`
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1.4rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  background: ${({ $success, theme }) =>
    $success
      ? "linear-gradient(135deg, rgba(76, 175, 80, 0.85), rgba(76, 175, 80, 0.55))"
      : "linear-gradient(135deg, rgba(33, 150, 243, 0.85), rgba(33, 150, 243, 0.55))"};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 18px 40px
    ${({ $success }) => ($success ? "rgba(76, 175, 80, 0.28)" : "rgba(33, 150, 243, 0.35)")};
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
      opacity: 0.95;
    }
  }
`;

const Footer = styled.footer`
  padding: 2rem clamp(1.5rem, 4vw, 3.5rem);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.25);
`;

const FooterMeta = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
`;

const BetaLanding = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
    }, 400);
  };

  return (
    <PageContainer>
      <Header>
        <Brand>
          <BrandTitle>
            <Sparkles size={18} /> Kastor Data Academy
          </BrandTitle>
          <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
            베타 테스터 사전 신청 · 탐정형 데이터 러닝 게임
          </span>
        </Brand>
        <CTAButton
          onClick={() => {
            const subscribeSection = document.getElementById("beta-subscribe");
            subscribeSection?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          사전 신청하기 <ArrowRight size={18} />
        </CTAButton>
      </Header>

      <HeroSection>
        <HeroText
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroBadge>대상: 데이터/사이버 수사에 관심 있는 베타 테스터</HeroBadge>
          <HeroTitle>
            데이터 침입 사건을 해결하며
            <br />
            실전 추리력을 키워보세요.
          </HeroTitle>
          <HeroSubtitle>
            Kastor Data Academy는 AI 어시스턴트와 함께 사이버 범죄를 추적하는 인터랙티브 러닝
            게임입니다. 이번 베타 테스트에서는 Episode 4 "The Data Breach"를 누구보다 먼저 플레이하고,
            K-LIF 학습 효과 측정에 참여할 기회를 드립니다.
          </HeroSubtitle>
          <CTAGroup>
            <CTAButton
              onClick={() => {
                const subscribeSection = document.getElementById("beta-subscribe");
                subscribeSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              베타 참가 신청 <ArrowRight size={18} />
            </CTAButton>
            <SecondaryLink href="#features">
              게임 특징 살펴보기 <ArrowRight size={18} />
            </SecondaryLink>
          </CTAGroup>
        </HeroText>

        <HeroVisual
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <GlowingOrb />
          <VisualContent>
            <VisualTitle>
              <Shield size={20} />
              Episode 4 · The Data Breach
            </VisualTitle>
            <VisualList>
              <li>• 3:00AM 대규모 데이터 유출, 내부 공모자 규명</li>
              <li>• 증거 수집 · 데이터 분석 · 캐릭터 심문 실시간 진행</li>
              <li>• 선택지 결과가 신뢰도·스토리 브랜치에 직접 반영</li>
              <li>• K-LIF Analytics로 학습 효과·추리력 지표 확인</li>
            </VisualList>
          </VisualContent>
        </HeroVisual>
      </HeroSection>

      <Section>
        <SectionLabel>Why Beta Test Now?</SectionLabel>
        <SectionHeadline>우리는 어떤 문제를 해결하고 있을까요?</SectionHeadline>
        <Paragraph>
          사이버 보안 교육은 여전히 암기식 이론에 머물러 있습니다. 실제 사고 대응처럼 탑다운 추리와
          데이터 분석을 동시에 경험하기 어렵죠. Kastor Data Academy는 인터랙티브 스토리와 실전형
          퍼즐을 결합해, 학습자가 "사건을 해결하면서 배우는" 몰입형 경험을 제공합니다. 베타에서는
          히트맵 기반 K-LIF 측정으로 플레이어의 역량 변화를 정량적으로 수집합니다.
        </Paragraph>
        <HighlightPanel>
          <HighlightCard whileHover={{ translateY: -6 }}>
            <IconBadge>
              <Users size={20} />
            </IconBadge>
            <CardTitle>실제 보안팀을 모델링한 캐릭터</CardTitle>
            <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>
              AI 어시스턴트 Kastor와 팀원들과의 커뮤니케이션을 통해 현실감 있는 협업 시나리오를
              체험합니다.
            </p>
          </HighlightCard>
          <HighlightCard whileHover={{ translateY: -6 }}>
            <IconBadge>
              <Shield size={20} />
            </IconBadge>
            <CardTitle>데이터 기반 추리형 미션</CardTitle>
            <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>
              서버 로그 분석, 증거 연결, 의심스러운 행동 패턴 식별 등 실무형 퍼즐로 구성되었습니다.
            </p>
          </HighlightCard>
          <HighlightCard whileHover={{ translateY: -6 }}>
            <IconBadge>
              <Sparkles size={20} />
            </IconBadge>
            <CardTitle>K-LIF Analytics 피드백</CardTitle>
            <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>
              플레이 과정에서 수집된 학습 데이터를 바탕으로 강점·보완점·정답률 변화를 시각화합니다.
            </p>
          </HighlightCard>
        </HighlightPanel>
      </Section>

      <Section id="features">
        <SectionLabel>What&apos;s in the Beta?</SectionLabel>
        <SectionHeadline>핵심 기능 미리보기</SectionHeadline>
        <FeatureGrid>
          {[
            {
              title: "탐정 대시보드 UI",
              description:
                "Chat · Data · Files · Team 탭을 넘나들며 진짜 수사실처럼 사건을 추적하세요.",
            },
            {
              title: "분기형 스토리텔링",
              description:
                "선택에 따라 캐릭터 신뢰도와 스토리가 달라지고, 새로운 증거가 해금됩니다.",
            },
            {
              title: "데이터 분석 퍼즐",
              description:
                "log-table 기반 퍼즐로 패턴을 찾고, 힌트 없이 해결하면 특별 배지를 획득할 수 있습니다.",
            },
            {
              title: "Evidence Files 뷰어",
              description:
                "문서, 로그, 이미지, 이메일 등 다양한 증거 파일을 미리보기하고 주석을 남길 수 있습니다.",
            },
            {
              title: "관계도 & 팀 뷰",
              description:
                "캐릭터 간 관계도를 시각화하고, 타임라인에서 행동 패턴을 추적하세요.",
            },
            {
              title: "실시간 Analytics",
              description:
                "정답률 추이, 힌트 사용량, 평균 해결 시간 등 학습 데이터를 한눈에 확인합니다.",
            },
          ].map((feature, index) => (
            <FeatureItem
              key={feature.title}
              whileHover={{ translateY: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: index * 0.03 }}
            >
              <CardTitle>{feature.title}</CardTitle>
              <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>{feature.description}</p>
            </FeatureItem>
          ))}
        </FeatureGrid>
      </Section>

      <Section>
        <SectionLabel>FAQ</SectionLabel>
        <SectionHeadline>자주 묻는 질문</SectionHeadline>
        <FAQList>
          {[
            {
              question: "베타 테스트 일정은 언제인가요?",
              answer:
                "1차 베타는 2025년 12월 초를 목표로 준비 중입니다. 사전 신청자에게는 정확한 일정과 참여 방법을 이메일로 안내드립니다.",
            },
            {
              question: "참여 자격은 어떻게 되나요?",
              answer:
                "데이터 분석, 사이버 보안, 게임 기반 학습에 관심 있는 누구나 신청 가능하며, 특히 교육/보안 실무자에게 우선권이 부여됩니다.",
            },
            {
              question: "베타에서 어떤 피드백을 드려야 하나요?",
              answer:
                "게임성, 학습 난이도, UI/UX 개선점, Analytics 활용도 등을 중심으로 설문과 인터뷰를 통해 의견을 수집할 예정입니다.",
            },
            {
              question: "참여자에게 혜택이 있나요?",
              answer:
                "정식 출시 시 Kastor Data Academy Season Pass 할인, 베타 전용 뱃지, K-LIF 리포트 선공개 등의 혜택을 제공합니다.",
            },
          ].map((faq) => (
            <FAQItem key={faq.question} open={false} whileHover={{ borderColor: "rgba(33,150,243,0.35)" }}>
              <summary>
                <Sparkles size={18} />
                {faq.question}
              </summary>
              <p>{faq.answer}</p>
            </FAQItem>
          ))}
        </FAQList>
      </Section>

      <SubscribeCard id="beta-subscribe">
        <SubscribeText>
          <SubscribeTitle>베타 테스터 사전 신청하기</SubscribeTitle>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>
            이메일을 남겨주시면 베타 테스트 일정, 참여 코드, 개발 소식을 가장 먼저 알려드립니다.
            신청자 중 추첨을 통해 Kastor Data Academy 한정 굿즈도 제공될 예정입니다.
          </p>
        </SubscribeText>
        <SubscribeForm onSubmit={handleSubmit}>
          <InputGroup>
            <MailIcon />
            <EmailInput
              type="email"
              required
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </InputGroup>
          <SubmitButton type="submit" $success={submitted}>
            {submitted ? (
              <>
                신청 완료 <CheckCircle2 size={18} />
              </>
            ) : (
              <>
                사전 신청 등록 <ArrowRight size={18} />
              </>
            )}
          </SubmitButton>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
            * 개인정보는 베타 관련 안내 외의 용도로 사용되지 않습니다.
          </span>
        </SubscribeForm>
      </SubscribeCard>

      <Footer>
        <FooterMeta>© {new Date().getFullYear()} Kastor Data Academy. All rights reserved.</FooterMeta>
        <FooterMeta>문의: team@kastor.academy</FooterMeta>
      </Footer>
    </PageContainer>
  );
};

export default BetaLanding;

