import {EditorState} from "@codemirror/next/state"
import {EditorView, keymap} from "@codemirror/next/view"
import {defaultKeymap} from "@codemirror/next/commands"
import React, {useEffect, useRef} from "react";
import {basicSetup} from "@codemirror/next/basic-setup";

const QueryEditor = () => {

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      let startState = EditorState.create({
        doc: "No autocomplete and syntax highlighting at all",
        extensions: [basicSetup, keymap(defaultKeymap)]
      })

      let view = new EditorView({
        state: startState,
        parent: ref.current
      })
    }

  }, [ref])

  return (
      <>
        <div ref={ref}></div>
      </>
  )
}

export default QueryEditor;