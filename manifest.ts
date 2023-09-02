import type { ManifestV3Export } from '@crxjs/vite-plugin'

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'My Extension',
  version: '1.0.0',
  permissions: ['storage'],
  action: {
    default_popup: 'src/popup/index.html',
  },
  content_scripts: [{
    matches: ['<all_urls>'],
    js: ['src/content-scripts/main.tsx'],
  }],
}

export default manifest
