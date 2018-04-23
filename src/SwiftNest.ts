'use strict'

import { window } from 'vscode'
import cp = require('child_process')
import vscode = require('vscode')

let outputChannel = vscode.window.createOutputChannel('Swifter')


export function installSwiftNest() {
    outputChannel.show()
    // outputChannel.appendLine('installing SwiftNest...\n')

    let extensionPath = vscode.extensions.getExtension('nswebfrog.swifter').extensionPath 
    let installShellPath = extensionPath + "/res/shell/install-swift-nest.sh"


    let child = cp.exec(installShellPath, (err, stdout, stderr) => {
        outputChannel.appendLine(err ? `Installation failed: ${stderr}` : `Installation successful`)
        if (!err) {
            window.showInformationMessage("SwiftNest is installed successfully. Reload VS Code window to take effect?", 'Not now', 'Reload')
                .then(selected => {
                    if (selected === 'Reload') {
                        vscode.commands.executeCommand('workbench.action.reloadWindow')
                    }
                })
        }
    })
    child.stdout.on('data', (data) => {
        outputChannel.append(data.toString())
    })
}