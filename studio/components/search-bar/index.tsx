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
import { NSpace, NInput, NIcon, NButton } from 'naive-ui'
import {
  SearchOutlined,
  FileAddOutlined,
  FolderAddOutlined
} from '@vicons/antd'
import styles from './index.module.scss'

export const SearchBar = defineComponent({
  name: 'search-bar',
  emits: ['fileClick', 'folderClick'],
  setup(props, { emit }) {
    const onFileClick = () => {
      emit('fileClick')
    }
    const onFolderClick = () => {
      emit('folderClick')
    }

    return () => (
      <NSpace size='small' align='center' wrapItem={false} wrap={false}>
        <NInput size='small' class={styles['search-input']}>
          {{
            prefix: () => h(NIcon, { component: SearchOutlined })
          }}
        </NInput>
        <NButton tertiary size='small' onClick={onFileClick}>
          {{ icon: () => h(NIcon, { component: FileAddOutlined }) }}
        </NButton>
        <NButton tertiary size='small' onClick={onFolderClick}>
          {{ icon: () => h(NIcon, { component: FolderAddOutlined }) }}
        </NButton>
      </NSpace>
    )
  }
})
