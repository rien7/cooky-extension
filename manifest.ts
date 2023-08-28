import type { ManifestV3Export } from '@crxjs/vite-plugin'

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'My Extension',
  version: '1.0.0',
  action: {
    default_popup: 'index.html',
  }
}

export default manifest