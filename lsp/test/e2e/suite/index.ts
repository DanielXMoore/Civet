import * as path from 'path'
import Mocha from 'mocha'

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: 'bdd',
    timeout: 10000,
    reporter: 'spec',
  })

  mocha.addFile(path.join(__dirname, 'extension.test.js'))

  return new Promise((resolve, reject) => {
    mocha.run((failures) => {
      if (failures > 0) {
        reject(new Error(`${failures} test(s) failed`))
      } else {
        resolve()
      }
    })
  })
}
