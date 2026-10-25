import project from './project'
import techStack from './techStack'
import experience from './experience'
import siteSettings from './siteSettings'
import about from './about'
import homePage from './homePage'
import {sectionTypes} from './sections'

export const schemaTypes = [
  homePage,
  siteSettings,
  about,
  project,
  techStack,
  experience,
  ...sectionTypes,
]

// Document types that exist exactly once, under a fixed id equal to the type name.
export const singletons: Record<string, string> = {
  homePage: 'Home Page Layout',
  siteSettings: 'Site Settings',
  about: 'About',
}
export const singletonTypes = new Set(Object.keys(singletons))
