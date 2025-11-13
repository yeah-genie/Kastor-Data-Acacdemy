import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Users,
  ShieldCheck,
  Sparkles,
  LineChart,
  Twitter,
  Instagram,
  Mail as MailIcon,
} from "lucide-react";

const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at 15% 20%, rgba(33, 150, 243, 0.22), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(255, 152, 0, 0.18), transparent 50%),
    ${({ theme }) => theme.colors.dark};
  color: ${({ theme }) => theme.colors.white};
  font-family: "Inter", "Noto Sans KR", sans-serif;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: min(1080px, 92%);
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 3rem) 0;
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: center;
  gap: clamp(2rem, 5vw, 3.5rem);
  padding-top: clamp(2rem, 5vw, 4rem);
`;

const HeroText = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: clamp(1.2rem, 2.5vw, 1.8rem);
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(33, 150, 243, 0.22);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.1rem, 5vw, 3.1rem);
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.015em;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2.3vw, 1.15rem);
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const CTAGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const PrimaryCTA = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.8rem;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.92), rgba(33, 150, 243, 0.68));
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 25px 45px rgba(33, 150, 243, 0.35);
`;

const HeroArt = styled(motion.div)`
  position: relative;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(160deg, rgba(22, 32, 48, 0.85), rgba(33, 150, 243, 0.1));
  padding: clamp(1.6rem, 3vw, 2.5rem);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

const ArtBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 25%, rgba(33, 150, 243, 0.4), transparent 60%),
    radial-gradient(circle at 80% 70%, rgba(255, 152, 0, 0.35), transparent 58%);
  opacity: 0.35;
`;

const ArtBody = styled.div`
  position: relative;
  display: grid;
  gap: 1.2rem;
`;

const ArtCard = styled.div`
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const ArtRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Section = styled.section`
  margin-top: clamp(3rem, 6vw, 4.5rem);
  display: grid;
  gap: clamp(1.6rem, 3vw, 2.2rem);
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.6rem, 3.4vw, 2.1rem);
  font-weight: 700;
`;

const SectionText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.72);
`;

const EpisodesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const EpisodeCard = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  padding: 1.2rem;
  font-weight: 600;
`;

const SecondaryCTA = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.4rem;
  background: rgba(33, 150, 243, 0.18);
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  cursor: pointer;
`;

const PremiumBox = styled.section`
  margin-top: clamp(3rem, 6vw, 4rem);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(12, 18, 30, 0.85);
  padding: clamp(1.8rem, 4vw, 2.6rem);
  display: grid;
  gap: 1.4rem;
`;

const Price = styled.span`
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.75);
`;

const FeatureItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
`;

const Note = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
`;

const Footer = styled.footer`
  margin-top: clamp(3rem, 6vw, 4rem);
  padding: clamp(1.8rem, 4vw, 2.4rem);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.68);
  display: grid;
  gap: 1rem;
`;

const SocialRow = styled.div`
  display: inline-flex;
  gap: 1rem;
  align-items: center;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const PaymentOverlay = styled(AnimatePresence)``;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

const Modal = styled(motion.div)`
  width: min(420px, 90%);
  background: ${({ theme }) => theme.colors.dark};
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 1.8rem;
  display: grid;
  gap: 1.1rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: grid;
  gap: 0.85rem;
`;

const Label = styled.label`
  display: grid;
  gap: 0.45rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(12, 18, 30, 0.85);
  padding: 0.75rem 0.9rem;
  color: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SplitRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
`;

const Submit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.85), rgba(33, 150, 243, 0.6));
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  justify-self: end;
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [preOrderSubmitted, setPreOrderSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const trackCTA = (type: "play-demo" | "preorder") => {
    try {
      const key = `kastor-landing-cta:${type}`;
      const current = Number(window.localStorage.getItem(key) ?? "0");
      window.localStorage.setItem(key, String(current + 1));
    } catch {
      // ignore
    }
  };

  const handlePlayDemo = () => {
    trackCTA("play-demo");
    navigate("/dashboard");
  };

  const handlePreOrder = () => {
    trackCTA("preorder");
    setShowModal(true);
    setPreOrderSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreOrderSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setFormData({
        email: "",
        name: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
      });
    }, 1500);
  };

  return (
    <Page>
      <Container>
        <Hero>
          <HeroText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroBadge>
              <Sparkles size={18} />
              Interactive Learning
            </HeroBadge>
            <HeroTitle>Learn Data Analysis by Solving Mysteries</HeroTitle>
            <HeroSubtitle>
              Play detective games, learn real data skills. No coding required. Join Kastor, your AI
              assistant, and unravel cyber cases through evidence and insight.
            </HeroSubtitle>
            <CTAGroup>
              <PrimaryCTA
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlayDemo}
              >
                Play Free Demo <ArrowRight size={20} />
              </PrimaryCTA>
            </CTAGroup>
          </HeroText>

          <HeroArt
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ArtBackdrop />
            <ArtBody>
              <ArtCard>
                <ArtRow>
                  <Sparkles size={24} color="#FFC107" />
                  <div>
                    <strong>Detective Duo</strong>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                      Player Investigator & Kastor AI
                    </p>
                  </div>
                </ArtRow>
                <SectionText style={{ margin: 0 }}>
                  Pair up with Kastor to interrogate team members, inspect logs, and deduce the
                  truth.
                </SectionText>
              </ArtCard>

              <ArtCard>
                <ArtRow>
                  <LineChart size={22} color="#4CAF50" />
                  <div>
                    <strong>Evidence Board</strong>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>
                      Visualize data, map suspects, spot anomalies
                    </p>
                  </div>
                </ArtRow>
                <div
                  style={{
                    borderRadius: "12px",
                    border: "1px dashed rgba(255,255,255,0.2)",
                    padding: "0.9rem",
                    display: "grid",
                    gap: "0.4rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>Active Case: Data Breach 4</span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Suspects Tracked: 7</span>
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Evidence Logged: 19</span>
                </div>
              </ArtCard>
            </ArtBody>
          </HeroArt>
        </Hero>

        <Section>
          <SectionTitle>What is Kastor Data Academy?</SectionTitle>
          <SectionText>
            Kastor Data Academy teaches data literacy through interactive detective stories. Solve
            mysteries by analyzing clues, visualizing data, and making evidence-based conclusions.
            Perfect for students aged 15-25 who want to explore data careers.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>Try 3 Episodes Free</SectionTitle>
          <EpisodesList>
            {[
              "Episode 1: The Missing Balance Patch",
              "Episode 2: The Ghost User's Ranking Mystery",
              "Episode 3: The Perfect Victory",
            ].map((episode) => (
              <EpisodeCard key={episode}>{episode}</EpisodeCard>
            ))}
          </EpisodesList>
          <SecondaryCTA onClick={handlePlayDemo}>
            Start Playing <ArrowRight size={18} />
          </SecondaryCTA>
        </Section>

        <PremiumBox>
          <SectionTitle>🔍 Want More Cases?</SectionTitle>
          <SectionText>
            Pre-order Detective Edition for unlimited mysteries and advanced content.
          </SectionText>
          <Price>₩4,950/month <span style={{ fontSize: "0.9rem" }}>(Launch special · 50% off)</span></Price>
          <FeatureList>
            <FeatureItem>
              <ShieldCheck size={18} color="#4CAF50" /> Unlimited episodes
            </FeatureItem>
            <FeatureItem>
              <ShieldCheck size={18} color="#4CAF50" /> Advanced investigative tools
            </FeatureItem>
            <FeatureItem>
              <ShieldCheck size={18} color="#4CAF50" /> Career exploration content
            </FeatureItem>
          </FeatureList>
          <PrimaryCTA whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={handlePreOrder}>
            Pre-order Now <CreditCard size={20} />
          </PrimaryCTA>
          <Note>Launching Spring 2025 · 30-day refund</Note>
        </PremiumBox>
      </Container>

      <Footer>
        <span>
          Kastor Data Academy blends narrative-driven gameplay with hands-on data challenges to make
          analytics education unforgettable.
        </span>
        <span>Contact: hello@kastordata.ac</span>
        <SocialRow>
          <SocialLink href="https://twitter.com" target="_blank" rel="noreferrer">
            <Twitter size={18} /> Twitter
          </SocialLink>
          <SocialLink href="https://instagram.com" target="_blank" rel="noreferrer">
            <Instagram size={18} /> Instagram
          </SocialLink>
          <SocialLink href="mailto:hello@kastordata.ac">
            <MailIcon size={18} /> Email
          </SocialLink>
        </SocialRow>
      </Footer>

      <PaymentOverlay>
        {showModal && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <Modal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <CloseButton onClick={() => setShowModal(false)}>Close ✕</CloseButton>
              <ModalTitle>Pre-order Detective Edition</ModalTitle>
              <Form onSubmit={handleSubmit}>
                <Label>
                  Email
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </Label>
                <Label>
                  Name
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, name: event.target.value }))
                    }
                    placeholder="Full name"
                  />
                </Label>
                <Label>
                  Card number
                  <Input
                    type="text"
                    required
                    inputMode="numeric"
                    value={formData.cardNumber}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, cardNumber: event.target.value }))
                    }
                    placeholder="1234 5678 9012 3456"
                  />
                </Label>
                <SplitRow>
                  <Label>
                    Expiry
                    <Input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, expiry: event.target.value }))
                      }
                    />
                  </Label>
                  <Label>
                    CVC
                    <Input
                      type="text"
                      required
                      inputMode="numeric"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, cvc: event.target.value }))
                      }
                    />
                  </Label>
                </SplitRow>
                <Submit type="submit">
                  {preOrderSubmitted ? (
                    <>
                      Thanks! <Sparkles size={18} />
                    </>
                  ) : (
                    <>
                      Confirm Pre-order <CreditCard size={18} />
                    </>
                  )}
                </Submit>
              </Form>
            </Modal>
          </Overlay>
        )}
      </PaymentOverlay>
    </Page>
  );
};

export default LandingPage;

