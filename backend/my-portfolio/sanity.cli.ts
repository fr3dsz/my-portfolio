import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'cnu9hemn',
    dataset: 'production'
  },
  // Hosted at https://fr3dsz-portfolio.sanity.studio
  studioHost: 'fr3dsz-portfolio',
  deployment: {
    appId: 'pvb3zh2ev4195fc1t1y96t0t',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
