import React from 'react'
import { useRef } from 'react';
import Editor from "@monaco-editor/react";
import { CodeSnippets } from './CodeSnippets';

function CodeEditor({codeEditorTheme,
  language,
  code ,
  setcode ,
  fontSize}
) {
  
  const editorRef = useRef(null);
  function onMount(editor) {
    editorRef.current = editor;
  }
  return (
    <Editor
    height="100%" // Ensures the editor takes full height
    width="100%"  // Ensures the editor takes full width
    theme={codeEditorTheme}
    language={language}
    defaultValue={CodeSnippets[language]}
    onMount={onMount}
    value={code}
    onChange={(newValue) => setcode(newValue)} // Handle code changes
    options={{
      fontSize: fontSize,
      minimap: { enabled: false }, // Disables the minimap
      scrollBeyondLastLine: false, // Optional: Prevents extra scrolling past last line
      scrollbar: {
        useShadows: false, // Disables shadows on scrollbars
        verticalHasArrows: true, // Enables vertical scrollbar arrows
        horizontalHasArrows: true, // Enables horizontal scrollbar arrows
        vertical: 'hidden', // Hides the vertical scrollbar
        horizontal: 'hidden', // Hides the horizontal scrollbar
        verticalScrollbarSize: 0, // Sets the size of the vertical scrollbar
        horizontalScrollbarSize: 17 // Sets the size of the horizontal scrollbar
      }
    }}
  />
  
  );
}

export default CodeEditor;
