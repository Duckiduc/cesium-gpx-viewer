const { notarize } = require('@electron/notarize')

module.exports = async (context) => {
  if (process.platform !== 'darwin') return

  console.log('aftersign hook triggered, start to notarize app.')

  if (!process.env.CI) {
    console.log(`skipping notarizing, not in CI.`)
    return
  }

  const { APPLE_ID, APPLE_ID_PASS, APPLE_TEAM_ID } = process.env

  if (!APPLE_ID || !APPLE_ID_PASS || !APPLE_TEAM_ID) {
    console.warn(
      'skipping notarizing, APPLE_ID, APPLE_ID_PASS and APPLE_TEAM_ID env variables must be set.'
    )
    return
  }

  const appId = 'com.cesium-gpx-viewer.app'

  const { appOutDir } = context

  const appName = context.packager.appInfo.productFilename

  try {
    await notarize({
      appPath: `${appOutDir}/${appName}.app`,
      appleId: APPLE_ID,
      appleIdPassword: APPLE_ID_PASS,
      teamId: APPLE_TEAM_ID
    })
  } catch (error) {
    console.error(error)
  }

  console.log(`done notarizing ${appId}.`)
}
