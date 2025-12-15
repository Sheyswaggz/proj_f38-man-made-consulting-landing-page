/**
 * Team member profile content configuration
 * Defines team member information including professional details and photos
 */

export interface TeamMember {
  readonly id: string
  readonly name: string
  readonly role: string
  readonly bio: string
  readonly imageUrl: string
  readonly imageAlt: string
  readonly linkedIn?: string
  readonly twitter?: string
  readonly email?: string
}

export interface TeamContent {
  readonly heading: string
  readonly subheading: string
  readonly introduction: string
  readonly members: readonly TeamMember[]
}

export const teamContent: TeamContent = {
  heading: 'Meet the Team',
  subheading: 'The people behind the technology',
  introduction:
    "We're a small team of experienced technologists who believe AI should enhance human capability, not replace it. We've spent years building systems at scale, and we bring that expertise to help you implement AI thoughtfully.",
  members: [
    {
      id: 'member-1',
      name: 'Alex Morrison',
      role: 'Founder & Principal Consultant',
      bio: "I've spent 15 years building software systems—from startups to enterprise. I started Man Made because I was tired of seeing AI implementations that looked impressive but didn't actually help people do their jobs better. I believe technology should serve humans, and I work with organizations that share that philosophy.",
      imageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      imageAlt: 'Alex Morrison, Founder and Principal Consultant',
      linkedIn: 'https://linkedin.com/in/alexmorrison',
      email: 'alex@manmadeconsulting.com',
    },
    {
      id: 'member-2',
      name: 'Sarah Chen',
      role: 'Senior AI Engineer',
      bio: "I came to AI from a background in cognitive science—I'm fascinated by how people actually think and work, not just how algorithms process data. My focus is building AI systems that feel natural to use because they're designed around human cognition, not just technical capability.",
      imageUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      imageAlt: 'Sarah Chen, Senior AI Engineer',
      linkedIn: 'https://linkedin.com/in/sarahchen',
    },
    {
      id: 'member-3',
      name: 'Marcus Rodriguez',
      role: 'Implementation Lead',
      bio: "I've led technical teams for over a decade, and I've learned that successful technology adoption is more about people than code. I specialize in gradual implementation strategies that keep teams productive while they learn new tools. Change management isn't just a buzzword—it's the difference between AI that gets used and AI that gets abandoned.",
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
      imageAlt: 'Marcus Rodriguez, Implementation Lead',
      linkedIn: 'https://linkedin.com/in/marcusrodriguez',
    },
    {
      id: 'member-4',
      name: 'Jennifer Park',
      role: 'Product Strategy Advisor',
      bio: "I help organizations figure out where AI actually makes sense—and where it doesn't. Not every problem needs an AI solution, and I'm not afraid to say so. My background in product management means I focus on outcomes and user value, not just technical possibilities.",
      imageUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
      imageAlt: 'Jennifer Park, Product Strategy Advisor',
      linkedIn: 'https://linkedin.com/in/jenniferpark',
    },
  ],
} as const

function isValidTeamMember(value: unknown): value is TeamMember {
  if (typeof value !== 'object' || value === null) return false

  const member = value as Record<string, unknown>

  return (
    typeof member.id === 'string' &&
    typeof member.name === 'string' &&
    typeof member.role === 'string' &&
    typeof member.bio === 'string' &&
    typeof member.imageUrl === 'string' &&
    typeof member.imageAlt === 'string' &&
    (member.linkedIn === undefined || typeof member.linkedIn === 'string') &&
    (member.twitter === undefined || typeof member.twitter === 'string') &&
    (member.email === undefined || typeof member.email === 'string')
  )
}

function isValidTeamContent(value: unknown): value is TeamContent {
  if (typeof value !== 'object' || value === null) return false

  const content = value as Record<string, unknown>

  return (
    typeof content.heading === 'string' &&
    typeof content.subheading === 'string' &&
    typeof content.introduction === 'string' &&
    Array.isArray(content.members) &&
    content.members.every(isValidTeamMember)
  )
}

export function getTeamContent(): TeamContent {
  if (!isValidTeamContent(teamContent)) {
    throw new Error('Invalid team content configuration')
  }
  return teamContent
}

export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamContent.members.find(member => member.id === id)
}

export function getTeamMemberIds(): readonly string[] {
  return teamContent.members.map(member => member.id)
}

export function getTeamMembersInOrder(): readonly TeamMember[] {
  return [...teamContent.members]
}

export function getTeamMembersByRole(role: string): readonly TeamMember[] {
  return teamContent.members.filter(
    member => member.role.toLowerCase() === role.toLowerCase()
  )
}