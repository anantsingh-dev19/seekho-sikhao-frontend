'use client';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { ArrowRight, BookOpen, ShoppingBag, Shield, Zap, Globe, Star, Users, Play } from 'lucide-react';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); }`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.5; }`;

const Page = styled.main`min-height: 100vh; padding-top: 64px; overflow: hidden;`;

const Hero = styled.section`
  position: relative;
  padding: 100px 24px 80px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: radial-gradient(circle, ${({ theme }) => theme.colors.primaryGlow} 0%, transparent 70%);
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.primaryGlow};
  border: 1px solid ${({ theme }) => theme.colors.primary}44;
  border-radius: 999px;
  padding: 6px 18px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  margin-bottom: 32px;
  animation: ${fadeUp} 0.6s ease forwards;
`;

const Heading = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(42px, 7vw, 80px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -2px;
  margin-bottom: 24px;
  max-width: 900px;
  animation: ${fadeUp} 0.6s 0.1s ease both;

  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Sub = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 520px;
  margin-bottom: 48px;
  line-height: 1.7;
  animation: ${fadeUp} 0.6s 0.2s ease both;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeUp} 0.6s 0.3s ease both;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 14px 28px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 0 30px ${({ theme }) => theme.colors.primaryGlow};
  transition: all 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 0 40px ${({ theme }) => theme.colors.primaryGlow}; }
`;

const GhostBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 14px 28px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 500;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primary}; }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 40px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0 auto;
  max-width: 900px;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNum = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px;
`;

const SectionTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionSub = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 480px;
  line-height: 1.7;
  margin-bottom: 48px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}44;
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.colors.shadow};
    &::before { opacity: 1; }
  }
`;

const IconBox = styled.div<{ color: string }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${({ color }) => color}18;
  border: 1px solid ${({ color }) => color}30;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: ${({ color }) => color};
`;

const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.text};
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

const CategoryCard = styled(Link)`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 36px;
  display: block;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}44;
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.colors.shadow};
  }
`;

const CategoryEmoji = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  animation: ${float} 4s ease-in-out infinite;
`;

const CategoryTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const CategoryDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  margin-bottom: 20px;
`;

const CategoryLink = styled.div<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

const CTASection = styled.section`
  margin: 0 24px 80px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}22, ${({ theme }) => theme.colors.accent}11);
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  padding: 80px 48px;
  text-align: center;
  max-width: 1052px;
  margin-left: auto;
  margin-right: auto;
`;

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Page>
      <Navbar />

      <Hero>
        <Tag><Zap size={13} /> Now in development — v1.0</Tag>
        <Heading>
          Learn, Grow &<br /><span>Build Something</span><br />Remarkable
        </Heading>
        <Sub>
          Access premium courses, shop quality products, and accelerate your learning journey — all in one beautiful platform.
        </Sub>
        <CTAGroup>
          {isAuthenticated ? (
            <PrimaryBtn href="/dashboard">Go to Dashboard <ArrowRight size={16} /></PrimaryBtn>
          ) : (
            <>
              <PrimaryBtn href="/register">Get Started Free <ArrowRight size={16} /></PrimaryBtn>
              <GhostBtn href="/login">Sign In</GhostBtn>
            </>
          )}
        </CTAGroup>
      </Hero>

      <StatsBar>
        {[
          { num: '500+', label: 'Students Enrolled' },
          { num: '50+', label: 'Expert Courses' },
          { num: '100+', label: 'Products Available' },
          { num: '4.9★', label: 'Average Rating' },
        ].map(s => (
          <Stat key={s.label}>
            <StatNum>{s.num}</StatNum>
            <StatLabel>{s.label}</StatLabel>
          </Stat>
        ))}
      </StatsBar>

      <Section>
        <SectionTag><BookOpen size={14} /> What We Offer</SectionTag>
        <SectionTitle>Everything you need to succeed</SectionTitle>
        <SectionSub>From expert-led courses to quality products — we have everything to fuel your growth.</SectionSub>

        <CategoryGrid>
          <CategoryCard href="/courses">
            <CategoryEmoji>📚</CategoryEmoji>
            <CategoryTitle>Video Courses</CategoryTitle>
            <CategoryDesc>Learn from industry experts with high-quality video lessons. Access anytime, anywhere.</CategoryDesc>
            <CategoryLink color="#7c6dfa">Browse Courses <ArrowRight size={14} /></CategoryLink>
          </CategoryCard>
          <CategoryCard href="/shop">
            <CategoryEmoji>🛍️</CategoryEmoji>
            <CategoryTitle>Shop</CategoryTitle>
            <CategoryDesc>Discover quality physical products curated for learners and creators.</CategoryDesc>
            <CategoryLink color="#4ade80">Visit Shop <ArrowRight size={14} /></CategoryLink>
          </CategoryCard>
        </CategoryGrid>
      </Section>

      <Section style={{ paddingTop: 0 }}>
        <SectionTag><Shield size={14} /> Why Choose Us</SectionTag>
        <SectionTitle>Built for serious learners</SectionTitle>
        <SectionSub>We take your learning experience seriously — with enterprise-grade security and top-notch content.</SectionSub>

        <FeaturesGrid>
          {[
            { icon: <Shield size={22} />, color: '#7c6dfa', title: 'Secure Video Protection', desc: 'Advanced DRM protection with user watermarking prevents unauthorized recording and sharing of course content.' },
            { icon: <Zap size={22} />, color: '#fa6d8d', title: 'Lightning Fast', desc: 'Optimized video delivery via Cloudinary CDN ensures smooth playback regardless of your location.' },
            { icon: <Globe size={22} />, color: '#4ade80', title: 'Learn Anywhere', desc: 'Access your courses on any device — desktop, tablet, or mobile. Your progress syncs automatically.' },
            { icon: <Star size={22} />, color: '#fbbf24', title: 'Expert Instructors', desc: 'Learn from verified industry professionals with real-world experience and proven teaching methods.' },
            { icon: <Users size={22} />, color: '#06b6d4', title: 'Community Driven', desc: 'Join thousands of learners, share progress, ask questions, and grow together as a community.' },
            { icon: <Play size={22} />, color: '#f97316', title: 'Lifetime Access', desc: 'Once you purchase a course, it\'s yours forever. Revisit lessons anytime as you advance in your career.' },
          ].map(f => (
            <FeatureCard key={f.title}>
              <IconBox color={f.color}>{f.icon}</IconBox>
              <CardTitle>{f.title}</CardTitle>
              <CardDesc>{f.desc}</CardDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      <CTASection>
        <SectionTag style={{ justifyContent: 'center' }}><Zap size={14} /> Start Today</SectionTag>
        <SectionTitle style={{ marginBottom: 16 }}>Ready to start learning?</SectionTitle>
        <SectionSub style={{ margin: '0 auto 36px', textAlign: 'center' }}>
          Join thousands of students already learning on our platform. Get started for free today.
        </SectionSub>
        <CTAGroup>
          <PrimaryBtn href={isAuthenticated ? '/courses' : '/register'}>
            {isAuthenticated ? 'Browse Courses' : 'Create Free Account'} <ArrowRight size={16} />
          </PrimaryBtn>
          <GhostBtn href="/shop">Explore Shop</GhostBtn>
        </CTAGroup>
      </CTASection>
    </Page>
  );
}