/**
 * Testimonials and Social Proof Content Configuration
 *
 * Defines TypeScript interfaces and content for testimonials, case studies,
 * and credibility indicators with authentic, conversational content.
 */

export interface Testimonial {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly company: string
  readonly content: string
  readonly imageUrl: string
  readonly imageAlt: string
  readonly rating?: number
  readonly date?: string
}

export interface CaseStudy {
  readonly id: string
  readonly title: string
  readonly client: string
  readonly industry: string
  readonly challenge: string
  readonly solution: string
  readonly results: readonly CaseStudyResult[]
  readonly testimonial?: string
  readonly imageUrl: string
  readonly imageAlt: string
}

export interface CaseStudyResult {
  readonly id: string
  readonly metric: string
  readonly value: string
  readonly description: string
}

export interface CredibilityIndicator {
  readonly id: string
  readonly type: 'certification' | 'partnership' | 'recognition' | 'metric'
  readonly title: string
  readonly description: string
  readonly imageUrl?: string
  readonly imageAlt?: string
  readonly icon?: string
}

export interface SocialProofContent {
  readonly heading: string
  readonly subheading: string
  readonly testimonials: readonly Testimonial[]
  readonly caseStudies: readonly CaseStudy[]
  readonly credibilityIndicators: readonly CredibilityIndicator[]
}

export const socialProofContent: SocialProofContent = {
  heading: 'What Our Clients Say',
  subheading:
    "Don't just take our word for it—hear from the teams we've worked with",
  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Sarah Chen',
      role: 'Director of Operations',
      company: 'TechFlow Solutions',
      content:
        "We were drowning in manual data entry and worried AI would just add more complexity. Man Made took the time to understand our actual workflow—not what they thought it should be. The solution they built fits seamlessly into how we work. Our team actually uses it every day, and we've cut processing time by 60%. More importantly, people aren't frustrated anymore.",
      imageUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      imageAlt: 'Sarah Chen, Director of Operations at TechFlow Solutions',
      rating: 5,
      date: '2024-11',
    },
    {
      id: 'testimonial-2',
      name: 'Marcus Rodriguez',
      role: 'VP of Engineering',
      company: 'DataStream Analytics',
      content:
        "Most consultants show up with a solution looking for a problem. Man Made did the opposite—they spent weeks just listening and observing. When they finally proposed something, it was exactly what we needed, not what was trendy. The implementation was gradual enough that we never lost productivity, and the training was actually useful. A year later, the system is still evolving with us.",
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      imageAlt: 'Marcus Rodriguez, VP of Engineering at DataStream Analytics',
      rating: 5,
      date: '2024-10',
    },
    {
      id: 'testimonial-3',
      name: 'Jennifer Park',
      role: 'Chief Product Officer',
      company: 'InnovateLabs',
      content:
        "I've worked with a lot of AI consultants who love to talk about neural networks and transformers. Man Made talked about our customers and our team. They explained everything in plain English, showed us exactly what the technology could and couldn't do, and never oversold. The result? A recommendation system that our users love and our team can actually maintain.",
      imageUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      imageAlt: 'Jennifer Park, Chief Product Officer at InnovateLabs',
      rating: 5,
      date: '2024-09',
    },
    {
      id: 'testimonial-4',
      name: 'David Thompson',
      role: 'Head of Customer Success',
      company: 'ServiceHub',
      content:
        "We needed to scale our support team without sacrificing quality. Man Made built an AI assistant that actually helps our team instead of replacing them. The best part? They involved our support staff in the design process. The tool feels like it was built by people who understand customer service, not just technology. Our response times are down 40% and satisfaction scores are up.",
      imageUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      imageAlt: 'David Thompson, Head of Customer Success at ServiceHub',
      rating: 5,
      date: '2024-08',
    },
    {
      id: 'testimonial-5',
      name: 'Lisa Patel',
      role: 'Operations Manager',
      company: 'LogisticsCore',
      content:
        "The transparency was what sold us. Every week we knew exactly what was happening, what was working, and what wasn't. When they hit a challenge, they told us immediately and worked with us to solve it. No surprises, no excuses. The system they delivered does exactly what they said it would, and they're still checking in months later to make sure it's working for us.",
      imageUrl:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
      imageAlt: 'Lisa Patel, Operations Manager at LogisticsCore',
      rating: 5,
      date: '2024-07',
    },
  ],
  caseStudies: [
    {
      id: 'case-study-1',
      title: 'Automating Document Processing Without Disrupting Workflows',
      client: 'TechFlow Solutions',
      industry: 'Financial Services',
      challenge:
        'Processing thousands of financial documents manually was creating bottlenecks and errors. The team was spending 30+ hours per week on data entry, leaving no time for analysis or client service. Previous automation attempts had failed because they required completely changing how the team worked.',
      solution:
        'We built a document processing system that integrated directly into their existing workflow. Instead of forcing them to use new tools, we made the AI work in the background of their current process. The system learned from their corrections, getting smarter over time. We rolled it out gradually, starting with one document type and expanding as the team gained confidence.',
      results: [
        {
          id: 'result-1-1',
          metric: '60%',
          value: 'Time Reduction',
          description:
            'Document processing time cut from 30 hours to 12 hours per week',
        },
        {
          id: 'result-1-2',
          metric: '85%',
          value: 'Accuracy Rate',
          description:
            'Automated extraction accuracy after three months of learning',
        },
        {
          id: 'result-1-3',
          metric: '100%',
          value: 'Team Adoption',
          description:
            'All team members actively using the system within two months',
        },
      ],
      testimonial:
        "The system fits so naturally into our work that people forget it's AI. It just feels like we got really good at our jobs.",
      imageUrl:
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      imageAlt:
        'Professional reviewing financial documents with digital interface overlay',
    },
    {
      id: 'case-study-2',
      title: 'Building a Recommendation System Users Actually Trust',
      client: 'InnovateLabs',
      industry: 'E-commerce Technology',
      challenge:
        'Their existing recommendation engine was technically sophisticated but users found it creepy and unpredictable. Conversion rates were low because customers didn't trust the suggestions. The product team couldn't explain why certain items were recommended, making it impossible to improve.',
      solution:
        'We redesigned the recommendation system with transparency as the core principle. Every recommendation came with a clear explanation of why it was suggested. We gave users control over their preferences and made the system learn from explicit feedback, not just behavior tracking. The technical implementation was simpler, but the user experience was dramatically better.',
      results: [
        {
          id: 'result-2-1',
          metric: '45%',
          value: 'Conversion Increase',
          description:
            'Click-through rate on recommendations improved significantly',
        },
        {
          id: 'result-2-2',
          metric: '78%',
          value: 'User Trust',
          description:
            'Percentage of users who rated recommendations as helpful or very helpful',
        },
        {
          id: 'result-2-3',
          metric: '3.2x',
          value: 'Engagement Growth',
          description:
            'Users interacting with recommendation features more than tripled',
        },
      ],
      testimonial:
        'We learned that simpler AI that people understand beats complex AI that feels like magic. Our users trust the system now because they know how it works.',
      imageUrl:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
      imageAlt:
        'E-commerce interface showing personalized product recommendations',
    },
    {
      id: 'case-study-3',
      title: 'Scaling Customer Support Without Losing the Human Touch',
      client: 'ServiceHub',
      industry: 'SaaS Platform',
      challenge:
        'Growing customer base was overwhelming the support team. Response times were increasing, and quality was suffering. They needed to scale but were worried that automation would make support feel impersonal and frustrate customers even more.',
      solution:
        'We built an AI assistant that augmented the support team rather than replacing them. The system handled routine questions and gathered context for complex issues, but always kept humans in the loop for important decisions. Support staff were involved in training the AI, ensuring it reflected their expertise and communication style. The result was a tool that made the team more effective, not obsolete.',
      results: [
        {
          id: 'result-3-1',
          metric: '40%',
          value: 'Faster Response',
          description:
            'Average first response time decreased from 4 hours to 2.4 hours',
        },
        {
          id: 'result-3-2',
          metric: '92%',
          value: 'Satisfaction Score',
          description:
            'Customer satisfaction with support interactions remained high',
        },
        {
          id: 'result-3-3',
          metric: '2.5x',
          value: 'Capacity Increase',
          description:
            'Team handling 2.5x more tickets without additional headcount',
        },
      ],
      testimonial:
        'Our support team was skeptical at first, but now they can't imagine working without it. The AI handles the boring stuff so they can focus on actually helping customers.',
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=80',
      imageAlt:
        'Customer support team member using AI-assisted support interface',
    },
  ],
  credibilityIndicators: [
    {
      id: 'indicator-1',
      type: 'metric',
      title: '15+ Years',
      description:
        'Combined experience in AI implementation and software architecture',
      icon: 'experience',
    },
    {
      id: 'indicator-2',
      type: 'metric',
      title: '100%',
      description:
        'Client satisfaction rate with successful project completion',
      icon: 'satisfaction',
    },
    {
      id: 'indicator-3',
      type: 'recognition',
      title: 'Industry Recognition',
      description:
        'Featured in leading technology publications for human-centered AI approach',
      icon: 'recognition',
    },
    {
      id: 'indicator-4',
      type: 'partnership',
      title: 'Technology Partners',
      description:
        'Certified partners with major cloud and AI platform providers',
      icon: 'partnership',
    },
    {
      id: 'indicator-5',
      type: 'metric',
      title: '50+',
      description:
        'Successful AI implementations across diverse industries',
      icon: 'projects',
    },
    {
      id: 'indicator-6',
      type: 'certification',
      title: 'Security & Compliance',
      description:
        'SOC 2 Type II certified with expertise in data privacy regulations',
      icon: 'security',
    },
  ],
} as const

function isValidTestimonial(value: unknown): value is Testimonial {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    typeof t.role === 'string' &&
    typeof t.company === 'string' &&
    typeof t.content === 'string' &&
    typeof t.imageUrl === 'string' &&
    typeof t.imageAlt === 'string' &&
    (t.rating === undefined || typeof t.rating === 'number') &&
    (t.date === undefined || typeof t.date === 'string')
  )
}

function isValidCaseStudyResult(value: unknown): value is CaseStudyResult {
  if (typeof value !== 'object' || value === null) return false
  const r = value as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.metric === 'string' &&
    typeof r.value === 'string' &&
    typeof r.description === 'string'
  )
}

function isValidCaseStudy(value: unknown): value is CaseStudy {
  if (typeof value !== 'object' || value === null) return false
  const c = value as Record<string, unknown>
  return (
    typeof c.id === 'string' &&
    typeof c.title === 'string' &&
    typeof c.client === 'string' &&
    typeof c.industry === 'string' &&
    typeof c.challenge === 'string' &&
    typeof c.solution === 'string' &&
    Array.isArray(c.results) &&
    c.results.every(isValidCaseStudyResult) &&
    (c.testimonial === undefined || typeof c.testimonial === 'string') &&
    typeof c.imageUrl === 'string' &&
    typeof c.imageAlt === 'string'
  )
}

function isValidCredibilityIndicator(
  value: unknown
): value is CredibilityIndicator {
  if (typeof value !== 'object' || value === null) return false
  const i = value as Record<string, unknown>
  return (
    typeof i.id === 'string' &&
    (i.type === 'certification' ||
      i.type === 'partnership' ||
      i.type === 'recognition' ||
      i.type === 'metric') &&
    typeof i.title === 'string' &&
    typeof i.description === 'string' &&
    (i.imageUrl === undefined || typeof i.imageUrl === 'string') &&
    (i.imageAlt === undefined || typeof i.imageAlt === 'string') &&
    (i.icon === undefined || typeof i.icon === 'string')
  )
}

function isValidSocialProofContent(
  value: unknown
): value is SocialProofContent {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return (
    typeof s.heading === 'string' &&
    typeof s.subheading === 'string' &&
    Array.isArray(s.testimonials) &&
    s.testimonials.every(isValidTestimonial) &&
    Array.isArray(s.caseStudies) &&
    s.caseStudies.every(isValidCaseStudy) &&
    Array.isArray(s.credibilityIndicators) &&
    s.credibilityIndicators.every(isValidCredibilityIndicator)
  )
}

export function getSocialProofContent(): SocialProofContent {
  if (!isValidSocialProofContent(socialProofContent)) {
    throw new Error('Invalid social proof content configuration')
  }
  return socialProofContent
}

export function getTestimonialById(id: string): Testimonial | undefined {
  return socialProofContent.testimonials.find(t => t.id === id)
}

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return socialProofContent.caseStudies.find(c => c.id === id)
}

export function getCredibilityIndicatorById(
  id: string
): CredibilityIndicator | undefined {
  return socialProofContent.credibilityIndicators.find(i => i.id === id)
}

export function getTestimonialIds(): readonly string[] {
  return socialProofContent.testimonials.map(t => t.id)
}

export function getCaseStudyIds(): readonly string[] {
  return socialProofContent.caseStudies.map(c => c.id)
}

export function getCredibilityIndicatorIds(): readonly string[] {
  return socialProofContent.credibilityIndicators.map(i => i.id)
}

export function getTestimonialsByRating(
  minRating: number
): readonly Testimonial[] {
  return socialProofContent.testimonials.filter(
    t => t.rating !== undefined && t.rating >= minRating
  )
}

export function getCaseStudiesByIndustry(
  industry: string
): readonly CaseStudy[] {
  return socialProofContent.caseStudies.filter(
    c => c.industry.toLowerCase() === industry.toLowerCase()
  )
}

export function getCredibilityIndicatorsByType(
  type: CredibilityIndicator['type']
): readonly CredibilityIndicator[] {
  return socialProofContent.credibilityIndicators.filter(i => i.type === type)
}