import {defineCliConfig} from 'sanity/cli'

// Filled in once you've created a Sanity project (see studio/README.md).
// These can also be provided via SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET env vars.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  studioHost: 'obscura-archive',
})
