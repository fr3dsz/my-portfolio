import project from './project'
import techStack from './techStack'
import experience from './experience'
import siteSettings from './siteSettings'
import about from './about'

export const schemaTypes = [siteSettings, about, project, techStack, experience]

// Document types that exist exactly once, under a fixed id equal to the type name.
export const singletonTypes = new Set(['siteSettings', 'about'])
