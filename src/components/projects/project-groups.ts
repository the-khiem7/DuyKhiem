import type { CollectionEntry } from 'astro:content'

type ProjectEntry = CollectionEntry<'projects'>

const supportingGroups = [
  {
    title: 'DevOps & Site Reliability',
    items: ['GO! Uptime', 'Zima Linux Homelab', 'Jenkins Docker Builder']
  },
  {
    title: 'Linux',
    items: ['Archlinux Endeavour Bootstrap']
  },
  {
    title: 'Computer Vision & ML',
    items: ['Snake AI Detection Training', 'Snake AI Inference Service']
  },
  {
    title: 'Service Platforms',
    items: ['Flower Shop WPF', 'TTK Piano Center']
  },
  {
    title: 'Mobile Apps & Android',
    items: ['Snake Aid Mobile', 'CellphoneZ', 'Android Playground PRM392']
  },
  {
    title: 'Student Productivity & EdTech',
    items: ['COZYHOME Naver Hackathon 2025']
  },
  {
    title: 'Business & Operations Systems',
    items: ['Claim Request System', 'EvoCare', 'Feng Shui Koi Consulting']
  },
  {
    title: 'Healthcare Platforms',
    items: ['VitaFlow']
  },
  {
    title: 'Unity Games',
    items: ['Samurai Fukusho', 'Stone Age World Platformer']
  }
] as const

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function groupProjects(projectsCollection: ProjectEntry[]) {
  const flagshipProjects = projectsCollection
    .filter((project) => project.data.category === 'flagship')
    .sort((a, b) => a.data.order - b.data.order)

  const supportingProjects = projectsCollection
    .filter((project) => project.data.category === 'supporting')
    .sort((a, b) => a.data.order - b.data.order)

  const supportingSections = supportingGroups
    .map((group) => ({
      title: group.title,
      slug: slugifyHeading(group.title),
      projects: group.items
        .map((title) => supportingProjects.find((project) => project.data.title === title))
        .filter(Boolean) as ProjectEntry[]
    }))
    .filter((group) => group.projects.length > 0)

  const groupedSupportingTitles = new Set(
    supportingSections.flatMap((group) => group.projects.map((project) => project.data.title))
  )

  const ungroupedSupportingProjects = supportingProjects.filter(
    (project) => !groupedSupportingTitles.has(project.data.title)
  )

  return {
    flagshipProjects,
    supportingSections,
    ungroupedSupportingProjects
  }
}
