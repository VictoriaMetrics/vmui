import {EditorState} from "@codemirror/next/state"
import {EditorView, keymap} from "@codemirror/next/view"
import {defaultKeymap} from "@codemirror/next/commands"
import React, {FC, useEffect, useRef, useState} from "react";
import { PromQLExtension } from 'codemirror-promql';
import { basicSetup } from '@codemirror/next/basic-setup';

export interface QueryEditorProps {
  setQuery: (query: string) => void;
  query: string;
}

// TODO: use value from input
const promQL = new PromQLExtension().setComplete({url: 'http://127.0.0.1:8428'})

const QueryEditor: FC<QueryEditorProps> = ({query, setQuery}) => {

  const ref = useRef<HTMLDivElement>(null)

  const [editorView, setEditorView] = useState<EditorView>();

  useEffect(() => {
    if (ref.current) {

      const listenerExtension = EditorView.updateListener.of(editorUpdate => {
        if (editorUpdate.docChanged) {
          setQuery(
              editorUpdate.state.doc.toJSON().map(el => el.trim()).join("")
          );
        }

      })

      setEditorView(new EditorView(
        {
          state: EditorState.create({
            doc: query,
            extensions: [basicSetup, keymap(defaultKeymap), listenerExtension, promQL.asExtension()]
          }),
          parent: ref.current
        })
      )
      return () => editorView?.destroy();
    }
  }, [])

  return (
      <>
        <div ref={ref}></div>
      </>
  )
}

export default QueryEditor;