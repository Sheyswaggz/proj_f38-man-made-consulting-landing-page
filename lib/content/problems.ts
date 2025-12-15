/**
 * Problem Statement Content Configuration
 * 
 * Defines the structure and content for common AI implementation challenges
 * displayed in the problem statement section of the landing page.
 * 
 * @module lib/content/problems
 */

/**
 * Represents a single problem statement with visual and textual content
 */
export interface Problem {
  /** Unique identifier for the problem */
  readonly id: string
  /** Problem title - concise and attention-grabbing */
  readonly title: string
  /** Detailed description in conversational tone */
  readonly description: string
  /** Unsplash image URL for visual representation */
  readonly imageUrl: string
  /** Alt text for accessibility */
  readonly imageAlt: string
  /** Icon identifier for optional icon display */
  readonly icon: string
}

/**
 * Configuration for the problems section
 */
export interface ProblemsContent {
  /** Section heading */
  readonly heading: string
  /** Optional subheading for context */
  readonly subheading?: string
  /** Array of problem statements */
  readonly problems: readonly Problem[]
}

/**
 * Problem statements content configuration
 * 
 * Identifies 3-4 common challenges businesses face with AI implementation
 * and traditional consulting approaches. Content is designed to resonate
 * with business decision-makers skeptical of AI.
 */
export const problemsContent: ProblemsContent = {
  heading: 'The AI Implementation Gap',
  subheading:
    "You've heard the promises. But implementing AI in the real world? That's where things get complicated.",
  problems: [
    {
      id: 'problem-1',
      title: 'AI Solutions That Don't Fit Your Reality',
      description:
        "Most AI consultants show up with pre-packaged solutions that look great in demos but fall apart when they meet your actual workflows. Your team ends up fighting the technology instead of using it. We start by understanding how your people actually work, then build AI that fits into their day—not the other way around.",
      imageUrl:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
      imageAlt:
        'Business team reviewing documents with frustrated expressions, representing misaligned AI solutions',
      icon: 'puzzle-mismatch',
    },
    {
      id: 'problem-2',
      title: 'Technical Jargon That Obscures Real Value',
      description:
        "Consultants love to talk about neural networks, transformers, and model architectures. But what you need to know is: will this actually help your team get their work done? We skip the buzzwords and focus on outcomes. You'll understand exactly what the technology does, why it matters, and what results to expect—in plain English.",
      imageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      imageAlt:
        'Confused business person looking at complex technical diagrams and charts',
      icon: 'confusion',
    },
    {
      id: 'problem-3',
      title: 'Implementation That Disrupts Instead of Enhances',
      description:
        "Rolling out new AI tools shouldn't mean weeks of chaos and productivity loss. Traditional implementations treat your team like they should adapt to the technology overnight. We take a different approach: gradual integration, hands-on training, and continuous support. Your team stays productive while they learn, and the technology proves its value before you're fully committed.",
      imageUrl:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
      imageAlt:
        'Overwhelmed team during technology implementation with scattered papers and stressed expressions',
      icon: 'disruption',
    },
    {
      id: 'problem-4',
      title: 'One-Size-Fits-All Approaches That Ignore Your Context',
      description:
        "Your industry has unique challenges. Your team has specific needs. Your data has particular quirks. Cookie-cutter AI solutions ignore all of that. We don't believe in templates or standard playbooks. Every engagement starts with deep discovery—understanding your domain, your constraints, and your goals. The result? AI that actually works for your specific situation.",
      imageUrl:
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80',
      imageAlt:
        'Diverse business professionals in meeting, representing unique organizational contexts',
      icon: 'generic-solution',
    },
  ],
} as const

/**
 * Type guard to validate problem content structure
 * 
 * @param value - Value to validate
 * @returns True if value is a valid Problem
 */
export function isValidProblem(value: unknown): value is Problem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const problem = value as Record<string, unknown>

  return (
    typeof problem.id === 'string' &&
    problem.id.length > 0 &&
    typeof problem.title === 'string' &&
    problem.title.length > 0 &&
    typeof problem.description === 'string' &&
    problem.description.length > 0 &&
    typeof problem.imageUrl === 'string' &&
    problem.imageUrl.startsWith('https://') &&
    typeof problem.imageAlt === 'string' &&
    problem.imageAlt.length > 0 &&
    typeof problem.icon === 'string' &&
    problem.icon.length > 0
  )
}

/**
 * Type guard to validate problems content structure
 * 
 * @param value - Value to validate
 * @returns True if value is valid ProblemsContent
 */
export function isValidProblemsContent(
  value: unknown
): value is ProblemsContent {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const content = value as Record<string, unknown>

  return (
    typeof content.heading === 'string' &&
    content.heading.length > 0 &&
    (content.subheading === undefined ||
      typeof content.subheading === 'string') &&
    Array.isArray(content.problems) &&
    content.problems.length >= 3 &&
    content.problems.length <= 4 &&
    content.problems.every(isValidProblem)
  )
}

/**
 * Retrieves the problems content configuration
 * 
 * @returns Validated problems content
 * @throws Error if content validation fails
 */
export function getProblemsContent(): ProblemsContent {
  if (!isValidProblemsContent(problemsContent)) {
    throw new Error(
      'Invalid problems content configuration: content structure validation failed'
    )
  }

  return problemsContent
}

/**
 * Retrieves a specific problem by ID
 * 
 * @param id - Problem identifier
 * @returns Problem if found, undefined otherwise
 */
export function getProblemById(id: string): Problem | undefined {
  return problemsContent.problems.find(problem => problem.id === id)
}

/**
 * Retrieves all problem IDs
 * 
 * @returns Array of problem identifiers
 */
export function getProblemIds(): readonly string[] {
  return problemsContent.problems.map(problem => problem.id)
}