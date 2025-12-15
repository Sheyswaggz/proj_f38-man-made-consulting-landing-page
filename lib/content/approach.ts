/**
 * Approach Content Configuration
 * 
 * Defines the human-centered methodology and approach that differentiates
 * Man Made Consulting from automation-focused AI consulting firms.
 * 
 * @module lib/content/approach
 */

/**
 * Represents a single step in the consulting methodology
 */
export interface MethodologyStep {
  readonly id: string
  readonly number: number
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly duration?: string
  readonly deliverables: readonly string[]
}

/**
 * Core principle that guides the consulting approach
 */
export interface CorePrinciple {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly icon: string
}

/**
 * Key differentiator from typical AI consulting approaches
 */
export interface Differentiator {
  readonly id: string
  readonly title: string
  readonly traditional: string
  readonly ourApproach: string
  readonly impact: string
}

/**
 * Complete approach section content structure
 */
export interface ApproachContent {
  readonly heading: string
  readonly subheading: string
  readonly introduction: string
  readonly methodologySteps: readonly MethodologyStep[]
  readonly corePrinciples: readonly CorePrinciple[]
  readonly differentiators: readonly Differentiator[]
  readonly closingStatement: string
}

/**
 * Approach content configuration
 * Emphasizes human-centered methodology and collaboration over automation
 */
export const approachContent: ApproachContent = {
  heading: 'How We Work With You',
  subheading: 'A human-centered approach to AI implementation',
  introduction:
    "We don't believe in dropping AI solutions into your organization and walking away. Real transformation happens through collaboration, understanding, and gradual integration. Our methodology puts your team at the center, ensuring technology serves people—not the other way around.",
  methodologySteps: [
    {
      id: 'step-1',
      number: 1,
      title: 'Deep Discovery',
      description:
        "We start by understanding your world. Not just your technical requirements, but how your team actually works, what challenges they face daily, and what success looks like to them. We spend time observing workflows, talking to stakeholders at all levels, and identifying the real problems—not just the obvious ones.",
      icon: 'discovery',
      duration: '1-2 weeks',
      deliverables: [
        'Comprehensive workflow analysis',
        'Stakeholder interview summaries',
        'Pain point identification report',
        'Opportunity assessment',
      ],
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Collaborative Design',
      description:
        "Together, we design solutions that fit your reality. Your team knows their work better than anyone—we bring the technical expertise to translate their needs into practical AI applications. Every design decision is made collaboratively, ensuring the final solution will actually be used.",
      icon: 'design',
      duration: '2-3 weeks',
      deliverables: [
        'Solution architecture documentation',
        'User experience mockups',
        'Technical feasibility analysis',
        'Implementation roadmap',
      ],
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Gradual Integration',
      description:
        "We implement in phases, starting small and proving value before scaling. Your team stays productive throughout the process, learning the new tools gradually. Each phase includes hands-on training, documentation, and support—ensuring everyone feels confident with the technology.",
      icon: 'integration',
      duration: '4-8 weeks',
      deliverables: [
        'Phased implementation plan',
        'Training materials and sessions',
        'Technical documentation',
        'Support protocols',
      ],
    },
    {
      id: 'step-4',
      number: 4,
      title: 'Continuous Refinement',
      description:
        "Implementation isn't the end—it's the beginning. We monitor how the solution performs in real-world use, gather feedback from your team, and make adjustments. The technology evolves with your needs, and we're there to guide that evolution.",
      icon: 'refinement',
      duration: 'Ongoing',
      deliverables: [
        'Performance monitoring dashboards',
        'Regular feedback sessions',
        'Iterative improvements',
        'Knowledge transfer documentation',
      ],
    },
  ],
  corePrinciples: [
    {
      id: 'principle-1',
      title: 'People First, Technology Second',
      description:
        "We design AI systems that enhance human capability rather than replace it. Every technical decision is evaluated through the lens of human impact. If a solution makes your team's work harder or less meaningful, it's not the right solution—no matter how technically impressive.",
      icon: 'people-first',
    },
    {
      id: 'principle-2',
      title: 'Transparency Over Complexity',
      description:
        "You should understand what the technology does and why it matters. We explain AI systems in plain language, show you how they make decisions, and ensure you can evaluate their performance. No black boxes, no mystification—just clear, honest communication about capabilities and limitations.",
      icon: 'transparency',
    },
    {
      id: 'principle-3',
      title: 'Gradual Change Over Disruption',
      description:
        "Transformation doesn't require chaos. We believe in measured, thoughtful implementation that respects your team's capacity for change. Small wins build confidence and momentum. Each phase proves value before moving forward. Your organization stays stable while evolving.",
      icon: 'gradual-change',
    },
    {
      id: 'principle-4',
      title: 'Collaboration Over Prescription',
      description:
        "We're partners, not vendors. Your expertise in your domain combined with our technical knowledge creates better solutions than either could alone. We listen more than we talk, ask questions before proposing answers, and adapt our approach based on what we learn from your team.",
      icon: 'collaboration',
    },
  ],
  differentiators: [
    {
      id: 'diff-1',
      title: 'Implementation Philosophy',
      traditional:
        'Deploy comprehensive AI solutions quickly, expecting teams to adapt to new workflows and tools immediately.',
      ourApproach:
        'Gradual integration with continuous support, allowing teams to maintain productivity while learning new capabilities.',
      impact:
        'Higher adoption rates, sustained productivity, and genuine enthusiasm for new tools rather than resistance.',
    },
    {
      id: 'diff-2',
      title: 'Communication Style',
      traditional:
        'Technical jargon and complex explanations that emphasize AI sophistication and cutting-edge capabilities.',
      ourApproach:
        'Plain language focused on practical outcomes, helping stakeholders understand what technology does and why it matters.',
      impact:
        'Better decision-making, realistic expectations, and confidence in technology investments.',
    },
    {
      id: 'diff-3',
      title: 'Success Metrics',
      traditional:
        'Model accuracy, processing speed, and technical benchmarks that look impressive but may not reflect real value.',
      ourApproach:
        'User satisfaction, workflow improvement, and measurable business outcomes that matter to your organization.',
      impact:
        'Solutions that deliver genuine value rather than just technical achievements.',
    },
    {
      id: 'diff-4',
      title: 'Ongoing Relationship',
      traditional:
        'Project-based engagement ending at deployment, with support limited to technical issues and bug fixes.',
      ourApproach:
        'Continuous partnership focused on evolution and refinement as your needs change and technology improves.',
      impact:
        'AI systems that grow with your organization rather than becoming obsolete or abandoned.',
    },
  ],
  closingStatement:
    "This approach takes longer than dropping in a pre-built solution. It requires more collaboration and patience. But it works. Your team actually uses the technology. The solutions fit your reality. And the transformation sticks. That's the difference between AI consulting that looks good in presentations and consulting that delivers lasting value.",
} as const

/**
 * Type guard to validate methodology step structure
 */
function isValidMethodologyStep(value: unknown): value is MethodologyStep {
  if (typeof value !== 'object' || value === null) return false

  const step = value as Record<string, unknown>

  return (
    typeof step.id === 'string' &&
    typeof step.number === 'number' &&
    typeof step.title === 'string' &&
    typeof step.description === 'string' &&
    typeof step.icon === 'string' &&
    Array.isArray(step.deliverables) &&
    step.deliverables.every(d => typeof d === 'string') &&
    (step.duration === undefined || typeof step.duration === 'string')
  )
}

/**
 * Type guard to validate core principle structure
 */
function isValidCorePrinciple(value: unknown): value is CorePrinciple {
  if (typeof value !== 'object' || value === null) return false

  const principle = value as Record<string, unknown>

  return (
    typeof principle.id === 'string' &&
    typeof principle.title === 'string' &&
    typeof principle.description === 'string' &&
    typeof principle.icon === 'string'
  )
}

/**
 * Type guard to validate differentiator structure
 */
function isValidDifferentiator(value: unknown): value is Differentiator {
  if (typeof value !== 'object' || value === null) return false

  const diff = value as Record<string, unknown>

  return (
    typeof diff.id === 'string' &&
    typeof diff.title === 'string' &&
    typeof diff.traditional === 'string' &&
    typeof diff.ourApproach === 'string' &&
    typeof diff.impact === 'string'
  )
}

/**
 * Type guard to validate complete approach content structure
 */
function isValidApproachContent(value: unknown): value is ApproachContent {
  if (typeof value !== 'object' || value === null) return false

  const content = value as Record<string, unknown>

  return (
    typeof content.heading === 'string' &&
    typeof content.subheading === 'string' &&
    typeof content.introduction === 'string' &&
    typeof content.closingStatement === 'string' &&
    Array.isArray(content.methodologySteps) &&
    content.methodologySteps.every(isValidMethodologyStep) &&
    Array.isArray(content.corePrinciples) &&
    content.corePrinciples.every(isValidCorePrinciple) &&
    Array.isArray(content.differentiators) &&
    content.differentiators.every(isValidDifferentiator)
  )
}

/**
 * Retrieves validated approach content
 * @throws {Error} If content structure is invalid
 */
export function getApproachContent(): ApproachContent {
  if (!isValidApproachContent(approachContent)) {
    throw new Error('Invalid approach content structure')
  }
  return approachContent
}

/**
 * Retrieves a specific methodology step by ID
 * @param id - The unique identifier of the methodology step
 * @returns The methodology step if found, undefined otherwise
 */
export function getMethodologyStepById(
  id: string
): MethodologyStep | undefined {
  return approachContent.methodologySteps.find(step => step.id === id)
}

/**
 * Retrieves a specific core principle by ID
 * @param id - The unique identifier of the core principle
 * @returns The core principle if found, undefined otherwise
 */
export function getCorePrincipleById(id: string): CorePrinciple | undefined {
  return approachContent.corePrinciples.find(principle => principle.id === id)
}

/**
 * Retrieves a specific differentiator by ID
 * @param id - The unique identifier of the differentiator
 * @returns The differentiator if found, undefined otherwise
 */
export function getDifferentiatorById(id: string): Differentiator | undefined {
  return approachContent.differentiators.find(diff => diff.id === id)
}

/**
 * Retrieves all methodology step IDs
 * @returns Array of methodology step identifiers
 */
export function getMethodologyStepIds(): readonly string[] {
  return approachContent.methodologySteps.map(step => step.id)
}

/**
 * Retrieves all core principle IDs
 * @returns Array of core principle identifiers
 */
export function getCorePrincipleIds(): readonly string[] {
  return approachContent.corePrinciples.map(principle => principle.id)
}

/**
 * Retrieves all differentiator IDs
 * @returns Array of differentiator identifiers
 */
export function getDifferentiatorIds(): readonly string[] {
  return approachContent.differentiators.map(diff => diff.id)
}

/**
 * Retrieves methodology steps in sequential order
 * @returns Array of methodology steps sorted by step number
 */
export function getMethodologyStepsInOrder(): readonly MethodologyStep[] {
  return [...approachContent.methodologySteps].sort(
    (a, b) => a.number - b.number
  )
}