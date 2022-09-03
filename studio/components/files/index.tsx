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

import { defineComponent, PropType, h, VNodeChild, Ref, ref } from 'vue'
import { NTree, NInput } from 'naive-ui'
import { FILE_TYPES_SUFFIX } from '@/constants/file'
import styles from './index.module.scss'
import type { IFileRecord, TreeOption } from '@/types/file'

const props = {
  data: {
    type: Array as PropType<IFileRecord[]>,
    default: []
  },
  inputRef: {
    type: Object as PropType<Ref>
  }
}

export const Files = defineComponent({
  name: 'files',
  props,
  emits: ['select', 'inputBlur'],
  setup(props, { emit, expose }) {
    const keyRef = ref()

    const onSelect = (keys: string[]) => {
      keys[0] && emit('select', keys[0])
    }
    const onBlur = (ev: FocusEvent) => {
      emit('inputBlur', (ev.target as HTMLInputElement)?.value)
    }

    const refresh = () => {
      keyRef.value = Date.now()
    }

    expose({ refresh })

    const renderLabel = (info: { option: TreeOption }): VNodeChild => {
      const { isCreate, label, type } = info.option as IFileRecord
      return !isCreate
        ? `${label}${type ? '.' + FILE_TYPES_SUFFIX[type] : ''}`
        : h(
            NInput,
            {
              size: 'tiny',
              autofocus: true,
              onBlur: onBlur,
              ref: props.inputRef
            },
            { suffix: () => (type ? '.' + FILE_TYPES_SUFFIX[type] : '') }
          )
    }
    return () => (
      <NTree
        block-line
        selectable
        data={props.data}
        on-update:selected-keys={onSelect}
        class={styles['files']}
        renderLabel={renderLabel}
        key={keyRef.value}
        defaultExpandAll
        expand-on-click
      ></NTree>
    )
  }
})
