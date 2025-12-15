/**
 * Process workflow content and step definitions
 * Defines the consulting process from initial consultation to implementation
 */

export interface ProcessDeliverable {
  readonly id: string
  readonly title: string
  readonly description: string
}

export interface ProcessStep {
  readonly id: string
  readonly number: number
  readonly title: string
  readonly description: string
  readonly timeline: string
  readonly estimatedDuration: string
  readonly deliverables: readonly ProcessDeliverable[]
  readonly keyActivities: readonly string[]
  readonly transparencyNote: string
  readonly icon: string
}

export interface ProcessPhase {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly steps: readonly string[]
}

export interface ProcessContent {
  readonly heading: string
  readonly subheading: string
  readonly introduction: string
  readonly steps: readonly ProcessStep[]
  readonly phases: readonly ProcessPhase[]
  readonly transparencyPrinciples: readonly string[]
  readonly collaborationApproach: string
  readonly closingStatement: string
}

export const processContent: ProcessContent = {
  heading: 'Our Consulting Process',
  subheading: 'Transparent, collaborative, and designed for lasting impact',
  introduction:
    "We believe in complete transparency throughout our engagement. You'll know exactly what to expect at each stage, what we're delivering, and how we're measuring success. This isn't a black box—it's a partnership built on clear communication and shared goals.",
  steps: [
    {
      id: 'step-1',
      number: 1,
      title: 'Discovery & Assessment',
      description:
        "We start by deeply understanding your organization, challenges, and goals. This isn't a quick survey—we spend time with your team, observe workflows, and identify both obvious problems and hidden opportunities. We're looking for the real issues, not just the symptoms.",
      timeline: 'Week 1-2',
      estimatedDuration: '1-2 weeks',
      deliverables: [
        {
          id: 'del-1-1',
          title: 'Comprehensive Assessment Report',
          description:
            'Detailed analysis of current state, pain points, and opportunities',
        },
        {
          id: 'del-1-2',
          title: 'Stakeholder Interview Summaries',
          description:
            'Insights from conversations with team members at all levels',
        },
        {
          id: 'del-1-3',
          title: 'Workflow Analysis Documentation',
          description:
            'Visual maps of current processes and identified bottlenecks',
        },
        {
          id: 'del-1-4',
          title: 'Opportunity Prioritization Matrix',
          description:
            'Ranked list of potential improvements based on impact and feasibility',
        },
      ],
      keyActivities: [
        'Stakeholder interviews and workshops',
        'Workflow observation and documentation',
        'Technical infrastructure assessment',
        'Data landscape evaluation',
        'Constraint and requirement gathering',
      ],
      transparencyNote:
        "You'll receive daily updates on our findings and can review all interview notes and observations. Nothing happens behind closed doors.",
      icon: 'discovery',
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Strategy & Design',
      description:
        "Together, we design solutions that fit your reality. Every decision is made collaboratively—your domain expertise combined with our technical knowledge. We prototype ideas quickly, get feedback early, and iterate until we've designed something your team will actually use.",
      timeline: 'Week 3-5',
      estimatedDuration: '2-3 weeks',
      deliverables: [
        {
          id: 'del-2-1',
          title: 'Solution Architecture Document',
          description:
            'Technical design with clear explanations of how everything works',
        },
        {
          id: 'del-2-2',
          title: 'Implementation Roadmap',
          description:
            'Phased approach with milestones, timelines, and success criteria',
        },
        {
          id: 'del-2-3',
          title: 'User Experience Prototypes',
          description:
            'Interactive mockups showing how the solution will work in practice',
        },
        {
          id: 'del-2-4',
          title: 'Risk Assessment & Mitigation Plan',
          description:
            'Identified risks with concrete strategies to address them',
        },
        {
          id: 'del-2-5',
          title: 'Success Metrics Framework',
          description:
            'Clear, measurable indicators of what success looks like',
        },
      ],
      keyActivities: [
        'Collaborative design workshops',
        'Rapid prototyping and feedback sessions',
        'Technical feasibility validation',
        'Cost-benefit analysis',
        'Change management planning',
      ],
      transparencyNote:
        'All design decisions are documented with clear rationale. You understand not just what we're building, but why.',
      icon: 'design',
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Pilot Implementation',
      description:
        "We start small and prove value before scaling. The first phase focuses on a contained use case where we can demonstrate impact quickly. Your team learns the new tools gradually, we gather real-world feedback, and we refine the approach based on what we learn. No big-bang deployments that disrupt everything.",
      timeline: 'Week 6-10',
      estimatedDuration: '4-6 weeks',
      deliverables: [
        {
          id: 'del-3-1',
          title: 'Pilot System Deployment',
          description:
            'Working implementation for initial use case with full functionality',
        },
        {
          id: 'del-3-2',
          title: 'Training Materials & Documentation',
          description:
            'Comprehensive guides, videos, and reference materials',
        },
        {
          id: 'del-3-3',
          title: 'Hands-on Training Sessions',
          description:
            'Interactive workshops teaching your team to use the new tools',
        },
        {
          id: 'del-3-4',
          title: 'Performance Monitoring Dashboard',
          description:
            'Real-time visibility into system performance and usage metrics',
        },
        {
          id: 'del-3-5',
          title: 'Pilot Results Report',
          description:
            'Measured outcomes, lessons learned, and recommendations for scaling',
        },
      ],
      keyActivities: [
        'Phased deployment to pilot group',
        'Daily support and troubleshooting',
        'User feedback collection and analysis',
        'Performance monitoring and optimization',
        'Documentation refinement based on real usage',
      ],
      transparencyNote:
        "You'll see exactly how the system performs from day one. We track metrics together and adjust based on real data, not assumptions.",
      icon: 'implementation',
    },
    {
      id: 'step-4',
      number: 4,
      title: 'Scale & Optimize',
      description:
        "With proven success from the pilot, we expand to additional teams and use cases. Each expansion phase includes training, support, and refinement. We monitor performance continuously, gather feedback from all users, and make improvements based on real-world usage patterns.",
      timeline: 'Week 11-18',
      estimatedDuration: '6-8 weeks',
      deliverables: [
        {
          id: 'del-4-1',
          title: 'Full-Scale Deployment',
          description:
            'System rolled out to all intended users with proper support',
        },
        {
          id: 'del-4-2',
          title: 'Advanced Training Program',
          description:
            'Deeper training on advanced features and best practices',
        },
        {
          id: 'del-4-3',
          title: 'Integration Documentation',
          description:
            'Technical guides for connecting with existing systems',
        },
        {
          id: 'del-4-4',
          title: 'Optimization Report',
          description:
            'Performance improvements and efficiency gains achieved',
        },
        {
          id: 'del-4-5',
          title: 'Knowledge Transfer Package',
          description:
            'Everything your team needs to maintain and evolve the system',
        },
      ],
      keyActivities: [
        'Gradual rollout to additional teams',
        'Performance optimization based on usage patterns',
        'Integration with existing tools and workflows',
        'Advanced feature development',
        'Internal capability building',
      ],
      transparencyNote:
        'Every optimization is explained and justified with data. You understand the impact of each change.',
      icon: 'scale',
    },
    {
      id: 'step-5',
      number: 5,
      title: 'Continuous Improvement',
      description:
        "Implementation isn't the end—it's the beginning of an ongoing partnership. We monitor system performance, gather user feedback, and make iterative improvements. As your needs evolve and technology advances, we help you adapt. The goal is a system that grows with your organization.",
      timeline: 'Ongoing',
      estimatedDuration: 'Continuous partnership',
      deliverables: [
        {
          id: 'del-5-1',
          title: 'Monthly Performance Reviews',
          description:
            'Regular analysis of metrics, usage patterns, and outcomes',
        },
        {
          id: 'del-5-2',
          title: 'Quarterly Enhancement Roadmap',
          description:
            'Planned improvements based on feedback and new opportunities',
        },
        {
          id: 'del-5-3',
          title: 'Ongoing Support & Troubleshooting',
          description:
            'Responsive assistance when issues arise or questions emerge',
        },
        {
          id: 'del-5-4',
          title: 'Technology Updates & Upgrades',
          description:
            'Keeping the system current with latest capabilities',
        },
        {
          id: 'del-5-5',
          title: 'Strategic Advisory Sessions',
          description:
            'Regular discussions about new opportunities and directions',
        },
      ],
      keyActivities: [
        'Performance monitoring and analysis',
        'User feedback collection and prioritization',
        'Iterative feature development',
        'Technology landscape monitoring',
        'Strategic planning and advisory',
      ],
      transparencyNote:
        'You have complete visibility into system performance and improvement priorities. We make decisions together based on your evolving needs.',
      icon: 'continuous',
    },
  ],
  phases: [
    {
      id: 'phase-1',
      name: 'Foundation',
      description: 'Understanding and planning',
      steps: ['step-1', 'step-2'],
    },
    {
      id: 'phase-2',
      name: 'Validation',
      description: 'Proving value with pilot implementation',
      steps: ['step-3'],
    },
    {
      id: 'phase-3',
      name: 'Expansion',
      description: 'Scaling to full deployment',
      steps: ['step-4'],
    },
    {
      id: 'phase-4',
      name: 'Evolution',
      description: 'Ongoing improvement and adaptation',
      steps: ['step-5'],
    },
  ],
  transparencyPrinciples: [
    'You know exactly what we're doing and why at every stage',
    'All deliverables are clearly defined before we start',
    'Progress is visible through regular updates and shared dashboards',
    'Challenges and setbacks are communicated immediately, not hidden',
    'Success metrics are defined upfront and tracked continuously',
    'You have access to all documentation, code, and decision rationale',
  ],
  collaborationApproach:
    "This process isn't something we do to you—it's something we do with you. Your team's expertise is essential at every stage. We bring technical knowledge and implementation experience; you bring domain expertise and organizational understanding. The best solutions emerge from genuine collaboration, not from consultants working in isolation.",
  closingStatement:
    "This approach takes longer than dropping in a pre-built solution. It requires more collaboration and patience. But it works. Your team actually uses the technology. The solutions fit your reality. And the transformation sticks. That's the difference between consulting that looks good in presentations and consulting that delivers lasting value.",
} as const

function isValidProcessDeliverable(
  value: unknown
): value is ProcessDeliverable {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string'
  )
}

function isValidProcessStep(value: unknown): value is ProcessStep {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.number === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.timeline === 'string' &&
    typeof obj.estimatedDuration === 'string' &&
    Array.isArray(obj.deliverables) &&
    obj.deliverables.every(isValidProcessDeliverable) &&
    Array.isArray(obj.keyActivities) &&
    obj.keyActivities.every(item => typeof item === 'string') &&
    typeof obj.transparencyNote === 'string' &&
    typeof obj.icon === 'string'
  )
}

function isValidProcessPhase(value: unknown): value is ProcessPhase {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.steps) &&
    obj.steps.every(item => typeof item === 'string')
  )
}

function isValidProcessContent(value: unknown): value is ProcessContent {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.heading === 'string' &&
    typeof obj.subheading === 'string' &&
    typeof obj.introduction === 'string' &&
    Array.isArray(obj.steps) &&
    obj.steps.every(isValidProcessStep) &&
    Array.isArray(obj.phases) &&
    obj.phases.every(isValidProcessPhase) &&
    Array.isArray(obj.transparencyPrinciples) &&
    obj.transparencyPrinciples.every(item => typeof item === 'string') &&
    typeof obj.collaborationApproach === 'string' &&
    typeof obj.closingStatement === 'string'
  )
}

export function getProcessContent(): ProcessContent {
  if (!isValidProcessContent(processContent)) {
    throw new Error('Invalid process content structure')
  }
  return processContent
}

export function getProcessStepById(id: string): ProcessStep | undefined {
  return processContent.steps.find(step => step.id === id)
}

export function getProcessPhaseById(id: string): ProcessPhase | undefined {
  return processContent.phases.find(phase => phase.id === id)
}

export function getProcessStepsByPhase(phaseId: string): readonly ProcessStep[] {
  const phase = getProcessPhaseById(phaseId)
  if (!phase) return []
  return phase.steps
    .map(stepId => getProcessStepById(stepId))
    .filter((step): step is ProcessStep => step !== undefined)
}

export function getProcessStepIds(): readonly string[] {
  return processContent.steps.map(step => step.id)
}

export function getProcessPhaseIds(): readonly string[] {
  return processContent.phases.map(phase => phase.id)
}

export function getProcessStepsInOrder(): readonly ProcessStep[] {
  return [...processContent.steps].sort((a, b) => a.number - b.number)
}

export function getTotalEstimatedDuration(): string {
  const steps = processContent.steps.filter(
    step => step.estimatedDuration !== 'Continuous partnership'
  )
  return `${steps.length * 2}-${steps.length * 3} weeks for initial implementation, plus ongoing partnership`
}

export function getDeliverablesByStep(
  stepId: string
): readonly ProcessDeliverable[] {
  const step = getProcessStepById(stepId)
  return step?.deliverables ?? []
}

export function getAllDeliverables(): readonly ProcessDeliverable[] {
  return processContent.steps.flatMap(step => step.deliverables)
}