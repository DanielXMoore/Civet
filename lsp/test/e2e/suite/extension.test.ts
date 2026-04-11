import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Extension', () => {
  test('extension is registered', () => {
    const ext = vscode.extensions.getExtension('DanielX.civet')
    assert.ok(ext, 'extension should be registered')
  })

  test('extension activates', async () => {
    const ext = vscode.extensions.getExtension('DanielX.civet')
    assert.ok(ext, 'extension should be registered')
    await ext.activate()
    assert.ok(ext.isActive, 'extension should be active after activation')
  })
})
