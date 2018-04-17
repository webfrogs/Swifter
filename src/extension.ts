'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, ExtensionContext } from 'vscode';
import { Executable, ServerOptions, LanguageClientOptions, LanguageClient } from 'vscode-languageclient'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    console.log('Extension "Swifter" is now active!');

    let serverCommand: string = workspace.getConfiguration("swifter")
        .get("languageServerPath")

    let runner: Executable = { command: serverCommand }
    let debug: Executable = runner
    let serverOption: ServerOptions = {
        run: runner,
        debug: debug
    }

    let clientOptions: LanguageClientOptions = {
        documentSelector: ['swift'],
        synchronize: {
            configurationSection: 'swift',
            fileEvents: [
                workspace.createFileSystemWatcher('**/*.swift', false, true, false),
                workspace.createFileSystemWatcher('**/.build/{debug,release}.yaml', false, false, false)
            ]
        }
    }

    let client = new LanguageClient('swift', serverOption, clientOptions)

    context.subscriptions.push(client.start())
}

// this method is called when your extension is deactivated
export function deactivate() {
}