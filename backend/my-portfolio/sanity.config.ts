import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {dashboardTool, projectInfoWidget, projectUsersWidget} from '@sanity/dashboard'
import {documentListWidget} from 'sanity-plugin-dashboard-widget-document-list'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {CaseIcon, CodeBlockIcon, DocumentsIcon} from './icons'
import {schemaTypes, singletons, singletonTypes} from './schemaTypes'
import {siteOverviewWidget} from './dashboard/SiteOverviewWidget'

// Frontend the "Open site" button points to — replace with the live domain once deployed.
const SITE_URL = 'http://localhost:5173'

// Singletons can be edited and published, but not created, duplicated or deleted.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Types given a drag-and-drop list instead of the default one.
const orderableTypes = [
  {type: 'project', title: 'Projects', icon: CaseIcon},
  {type: 'experience', title: 'Experience', icon: DocumentsIcon},
]
const customListTypes = new Set([...singletonTypes, ...orderableTypes.map(({type}) => type)])

export default defineConfig({
  name: 'default',
  title: 'My Portfolio',

  projectId: 'cnu9hemn',
  dataset: 'production',

  plugins: [
    dashboardTool({
      widgets: [
        siteOverviewWidget({siteUrl: SITE_URL}),
        documentListWidget({
          title: 'Recently edited',
          order: '_updatedAt desc',
          limit: 8,
          layout: {width: 'medium'},
        }),
        projectInfoWidget(),
        projectUsersWidget(),
      ],
    }),
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            ...Object.entries(singletons).map(([type, title]) =>
              S.listItem()
                .title(title)
                .id(type)
                .child(S.document().schemaType(type).documentId(type)),
            ),
            S.divider(),
            ...orderableTypes.map(({type, title, icon}) =>
              orderableDocumentListDeskItem({type, title, icon, S, context}),
            ),
            ...S.documentTypeListItems()
              .filter((item) => !customListTypes.has(item.getId() ?? ''))
              .map((item) => (item.getId() === 'techStack' ? item.icon(CodeBlockIcon) : item)),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
  },
})
