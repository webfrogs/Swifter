'use strict'

import { window, workspace } from 'vscode'
import cp = require('child_process')
import vscode = require('vscode')

let outputChannel = vscode.window.createOutputChannel('Swifter')

export function getSwiftNestPath(): string {
    return workspace.getConfiguration("swifter")
        .get("languageServerPath")
}

export function installSwiftNest(isUpdate = false, gitTag?: string) {
    outputChannel.clear()
    outputChannel.show()

    let extensionPath = vscode.extensions.getExtension('nswebfrog.swifter').extensionPath 
    var installCmd = extensionPath + "/res/shell/install-swift-nest.sh"
    if (gitTag) {
        installCmd += ` ${gitTag}`
    }

    let child = cp.exec(installCmd, (err, stdout, stderr) => {
        var logStr = err ? `Installation failed: ${stderr}` : `Installation successful`
        if (isUpdate) {
            logStr = err ? `Update failed: ${stderr}` : `Update successful`
        } 
        outputChannel.appendLine(logStr)
        if (!err) {
            var tip = 'SwiftNest is installed successfully.Reload VS Code window to take effect?'
            if (isUpdate) {
                tip = 'SwiftNest is updated successfully.Reload VS Code window to take effect?'
            }
            window.showInformationMessage(tip, 'Not now', 'Reload')
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

export function checkSwiftNestVersion() {
    let request = require('request')
    let options = {
        url: 'https://api.github.com/repos/webfrogs/SwiftNest/releases/latest',
        headers: {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "SwiftNest"
        }
    }
    request(options, (error, response, body) => {
        if (error) {
            console.log('Cannot fetch SwiftNest\'s latest release info.')
            return
        }
        let latestVersion = JSON.parse(body).tag_name 

        let currentSwiftNestVersionCmd = getSwiftNestPath() + ' --version'
        cp.exec(currentSwiftNestVersionCmd, (err, stdout, stderr) => {
            if (err) {
                console.log('Cannot get current version of SwiftNest');
                return
            }
            let currentVersion = stdout

            let semver = require('semver')
            if (semver.lt(currentVersion, latestVersion)) {
                window.showInformationMessage('[SwiftNest] New version released. Update now?', 'Cancel', 'OK')
                    .then((selected) => {
                        if (selected === 'OK') {
                            installSwiftNest(true, latestVersion)
                        }
                    })
            }
        })
    })
}
