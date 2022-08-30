/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineComponent, onMounted, ref, PropType } from 'vue'
import * as monaco from 'monaco-editor'
import { useFormItem } from 'naive-ui/es/_mixins'
import { call } from 'naive-ui/es/_utils'
import type {
  MaybeArray,
  OnUpdateValue,
  OnUpdateValueImpl,
  monaco as Monaco
} from './types'

const props = {
  value: {
    type: String as PropType<string>,
    default: ''
  },
  defaultValue: {
    type: String as PropType<string>
  },
  'onUpdate:value': [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
  onUpdateValue: [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
  options: {
    type: Object as PropType<Monaco.editor.IStandaloneEditorConstructionOptions>,
    default: () => ({
      readOnly: false,
      language: 'shell'
    })
  }
}

export const MonacoEditor = defineComponent({
  name: 'monaco-editor',
  props,
  emits: ['change', 'focus', 'blur'],
  setup(props, ctx) {
    const editorRef = ref()
    let editor = null as monaco.editor.IStandaloneCodeEditor | null
    const formItem = useFormItem({})

    const initMonacoEditor = () => {
      const dom = editorRef.value
      if (dom) {
        editor = monaco.editor.create(dom, {
          ...props.options,
          value: props.defaultValue ?? props.value,
          automaticLayout: true,
          theme: 'vs'
        })
        editor.onDidChangeModelContent(() => {
          const { onUpdateValue, 'onUpdate:value': _onUpdateValue } = props
          const value = editor?.getValue() || ''

          if (onUpdateValue) call(onUpdateValue as OnUpdateValueImpl, value)
          if (_onUpdateValue) call(_onUpdateValue as OnUpdateValueImpl, value)
          ctx.emit('change', value)

          formItem.nTriggerFormChange()
          formItem.nTriggerFormInput()
        })
        editor.onDidBlurEditorWidget(() => {
          ctx.emit('blur')
          formItem.nTriggerFormBlur()
        })
        editor.onDidFocusEditorWidget(() => {
          ctx.emit('focus')
          formItem.nTriggerFormFocus()
        })
      }
    }

    onMounted(() => initMonacoEditor())
    return () => (
      <div
        ref={editorRef}
        style={{
          height: '300px',
          width: '100%',
          border: '1px solid #eee'
        }}
      />
    )
  }
})
