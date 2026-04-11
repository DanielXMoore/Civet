import * as path from 'path'
import * as fs from 'fs'
import { runTests } from '@vscode/test-electron'

async function main() {
  const projectRoot = process.cwd()
  const extensionDevelopmentPath = projectRoot
  const extensionTestsPath = path.join(projectRoot, 'out/test/e2e/suite/index')

  const extensionTestsEnv: Record<string, string> = {}

  if (process.env.CIVET_COVERAGE === '1') {
    const coverageDir = path.join(projectRoot, 'coverage/e2e-raw')
    fs.mkdirSync(coverageDir, { recursive: true })
    extensionTestsEnv.NODE_V8_COVERAGE = coverageDir
  }

  try {
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      extensionTestsEnv,
    })
  } catch (err) {
    console.error('Failed to run e2e tests')
    process.exit(1)
  }
}

main()
