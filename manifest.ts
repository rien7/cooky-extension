import type { ManifestV3Export } from '@crxjs/vite-plugin'

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Cooky',
  version: '1.0.0',
  permissions: ['storage'],
  action: {
    default_popup: 'src/popup/index.html',
  },
  icons: {
    16: 'src/assets/icon-16.png',
    48: 'src/assets/icon-48.png',
    128: 'src/assets/icon-128.png',
  },
  content_scripts: [{
    matches: ['<all_urls>'],
    js: ['src/content-scripts/main.tsx'],
  }],
}

export default manifest
