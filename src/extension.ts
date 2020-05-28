import * as vscode from "vscode";
import { TextEditor, TextEditorEdit, Selection } from "vscode";

const wordRegex = /[A-Za-z0-9]+/;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "transpose-words.transposeWords",
      (textEditor: TextEditor, edit: TextEditorEdit) => {
        const document = textEditor.document;

        textEditor.selections.forEach((selection: Selection) => {
          if (!selection.isEmpty) {
            return;
          }

          const forwardRange = document.getWordRangeAtPosition(
            selection.active,
            wordRegex
          );

          if (!forwardRange || forwardRange.start.character === 0) {
            return;
          }

          const backwardRange = document.getWordRangeAtPosition(
            forwardRange.start.translate({ characterDelta: -1 }),
            wordRegex
          );

          if (!backwardRange) {
            return;
          }

          const forwardWord = document.getText(forwardRange);
          const backwardWord = document.getText(backwardRange);

          edit.replace(forwardRange, backwardWord);
          edit.replace(backwardRange, forwardWord);
        });
      }
    )
  );
}

export function deactivate() {}
