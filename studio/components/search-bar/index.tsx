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

import { defineComponent, h } from 'vue'
import { NSpace, NInput, NIcon, NButton, NDropdown } from 'naive-ui'
import {
  SearchOutlined,
  FileAddOutlined,
  FolderAddOutlined
} from '@vicons/antd'
import { FILE_TYPES } from '@/constants/file'
import styles from './index.module.scss'
import type { FileType } from '@/types/file'

export const SearchBar = defineComponent({
  name: 'search-bar',
  emits: ['fileClick', 'folderClick', 'search'],
  setup(props, { emit }) {
    const typesOptions = FILE_TYPES.map((type) => ({
      key: type,
      label: type
    }))
    const onFileClick = (type: FileType) => {
      emit('fileClick', type)
    }
    const onFolderClick = () => {
      emit('folderClick')
    }
    const onChange = (value: string) => {
      emit('search', value)
    }

    return () => (
      <NSpace size='small' align='center' wrapItem={false} wrap={false}>
        <NInput
          size='small'
          class={styles['search-input']}
          onUpdateValue={onChange}
        >
          {{
            prefix: () => h(NIcon, { component: SearchOutlined })
          }}
        </NInput>
        <NDropdown
          options={typesOptions}
          trigger='click'
          onSelect={onFileClick}
        >
          <NButton tertiary size='small'>
            {{ icon: () => h(NIcon, { component: FileAddOutlined }) }}
          </NButton>
        </NDropdown>
        <NButton tertiary size='small' onClick={onFolderClick}>
          {{ icon: () => h(NIcon, { component: FolderAddOutlined }) }}
        </NButton>
      </NSpace>
    )
  }
})
