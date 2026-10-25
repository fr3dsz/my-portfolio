import {useCallback, useEffect, useState} from 'react'
import {useClient} from 'sanity'
import {IntentLink} from 'sanity/router'
import {DashboardWidgetContainer} from '@sanity/dashboard'
import {Badge, Box, Button, Card, Flex, Grid, Spinner, Stack, Text} from '@sanity/ui'
import {LaunchIcon, SyncIcon} from '../icons'

const OVERVIEW_QUERY = `{
  "homePage": *[_id == "homePage"][0]{ "total": count(sections), "hidden": count(sections[enabled == false]) },
  "settings": *[_id == "siteSettings"][0]{ "hasResume": defined(resume.asset), "hasEmail": defined(email) },
  "about": *[_id == "about"][0]{ "hasPhoto": defined(photo.asset), "bio": count(bio), "techGroups": count(techGroups) },
  "projects": count(*[_type == "project" && !(_id in path("drafts.**"))]),
  "experiences": count(*[_type == "experience" && !(_id in path("drafts.**"))]),
  "techStack": count(*[_type == "techStack" && !(_id in path("drafts.**"))]),
  "projectsWithoutImage": count(*[_type == "project" && !(_id in path("drafts.**")) && !defined(image.asset)]),
  "unranked": count(*[_type in ["project", "experience"] && !defined(orderRank)]),
  "drafts": count(*[_id in path("drafts.**")])
}`

type Overview = {
  homePage: {total: number | null; hidden: number | null} | null
  settings: {hasResume: boolean; hasEmail: boolean} | null
  about: {hasPhoto: boolean; bio: number | null; techGroups: number | null} | null
  projects: number
  experiences: number
  techStack: number
  projectsWithoutImage: number
  unranked: number
  drafts: number
}

type Check = {ok: boolean; label: string; hint?: string; edit?: {id: string; type: string}}

const buildChecks = (o: Overview): Check[] => [
  {
    ok: Boolean(o.homePage?.total),
    label: 'Home Page Layout has sections',
    hint: 'Without it the site uses the built-in default layout.',
    edit: {id: 'homePage', type: 'homePage'},
  },
  {
    ok: Boolean(o.settings?.hasEmail),
    label: 'Site Settings filled in',
    edit: {id: 'siteSettings', type: 'siteSettings'},
  },
  {
    ok: Boolean(o.settings?.hasResume),
    label: 'Résumé uploaded',
    hint: 'The Contact section shows a download button once it exists.',
    edit: {id: 'siteSettings', type: 'siteSettings'},
  },
  {ok: Boolean(o.about?.bio), label: 'About bio written', edit: {id: 'about', type: 'about'}},
  {ok: Boolean(o.about?.hasPhoto), label: 'About photo added', edit: {id: 'about', type: 'about'}},
  {
    ok: Boolean(o.about?.techGroups),
    label: 'Tech stack groups set',
    hint: 'Until then the site shows its built-in list.',
    edit: {id: 'about', type: 'about'},
  },
  {
    ok: o.projectsWithoutImage === 0,
    label: o.projectsWithoutImage ? `${o.projectsWithoutImage} project(s) without an image` : 'Every project has an image',
  },
  {
    ok: o.unranked === 0,
    label: o.unranked ? `${o.unranked} project/experience document(s) not yet ranked` : 'Projects and experience are ranked',
    hint: 'Run scripts/backfill-order-rank.ts once so drag-and-drop keeps the current order.',
  },
]

const Stat = ({label, value}: {label: string; value: number}) => (
  <Card padding={3} radius={2} border>
    <Stack gap={2}>
      <Text size={4} weight="semibold">
        {value}
      </Text>
      <Text size={1} muted>
        {label}
      </Text>
    </Stack>
  </Card>
)

const CheckRow = ({check}: {check: Check}) => (
  <Flex align="flex-start" gap={3} paddingY={2}>
    <Badge tone={check.ok ? 'positive' : 'caution'} style={{minWidth: '1.5em', textAlign: 'center'}}>
      {check.ok ? '✓' : '!'}
    </Badge>
    <Stack gap={2} flex={1}>
      <Text size={1} weight={check.ok ? 'regular' : 'medium'}>
        {check.label}
      </Text>
      {!check.ok && check.hint && (
        <Text size={1} muted>
          {check.hint}
        </Text>
      )}
    </Stack>
    {!check.ok && check.edit && (
      <Text size={1}>
        <IntentLink intent="edit" params={check.edit}>
          Fix
        </IntentLink>
      </Text>
    )}
  </Flex>
)

type Props = {siteUrl?: string}

export function SiteOverviewWidget({siteUrl}: Props) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [overview, setOverview] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setError(null)
    client
      .fetch<Overview>(OVERVIEW_QUERY)
      .then(setOverview)
      .catch((err: Error) => setError(err.message))
  }, [client])

  useEffect(load, [load])

  const checks = overview ? buildChecks(overview) : []
  const open = checks.filter((check) => !check.ok).length

  return (
    <DashboardWidgetContainer
      header="Portfolio overview"
      footer={
        <Flex gap={2} padding={2}>
          <Button icon={SyncIcon} mode="bleed" text="Refresh" onClick={load} />
          {siteUrl && <Button as="a" href={siteUrl} target="_blank" rel="noopener noreferrer" icon={LaunchIcon} mode="bleed" text="Open site" />}
        </Flex>
      }
    >
      <Box padding={4}>
        {error && (
          <Card tone="critical" padding={3} radius={2}>
            <Text size={1}>Couldn&apos;t load overview: {error}</Text>
          </Card>
        )}
        {!overview && !error && (
          <Flex justify="center" padding={4}>
            <Spinner muted />
          </Flex>
        )}
        {overview && (
          <Stack gap={4}>
            <Grid gridTemplateColumns={[2, 2, 4]} gap={2}>
              <Stat label="Projects" value={overview.projects} />
              <Stat label="Experience" value={overview.experiences} />
              <Stat label="Tech stack" value={overview.techStack} />
              <Stat label="Unpublished drafts" value={overview.drafts} />
            </Grid>
            <Flex align="center" gap={2}>
              <Text size={1} weight="semibold">
                Content checklist
              </Text>
              <Badge tone={open ? 'caution' : 'positive'}>{open ? `${open} to do` : 'All done'}</Badge>
              {Boolean(overview.homePage?.hidden) && <Badge>{overview.homePage?.hidden} hidden section(s)</Badge>}
            </Flex>
            <Stack>
              {checks.map((check) => (
                <CheckRow key={check.label} check={check} />
              ))}
            </Stack>
          </Stack>
        )}
      </Box>
    </DashboardWidgetContainer>
  )
}

export const siteOverviewWidget = (props: Props = {}) => ({
  name: 'site-overview',
  component: () => <SiteOverviewWidget {...props} />,
  layout: {width: 'full' as const},
})
