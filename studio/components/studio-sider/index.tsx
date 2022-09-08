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
import { defineComponent, ref } from 'vue'
import { NLayoutSider, NSpace } from 'naive-ui'
import { ResizeHandler, ResizedOptions } from '../resize-handler'
import { SearchBar, Files } from '@/components'
import { useFile } from './use-file'
import styles from './index.module.scss'

export const StudioSider = defineComponent({
  name: 'studio-sider',
  setup() {
    const widthRef = ref(300)
    const inputRef = ref()
    const fileRef = ref()
    const {
      state,
      onCreateFile,
      onCreateFolder,
      onSelectFile,
      onInputBlur,
      onDelete,
      onRename
    } = useFile(inputRef, fileRef)

    return () => (
      <NLayoutSider class={styles['studio-sider']} width={widthRef.value}>
        <NSpace
          vertical
          class={styles['studio-sider-content']}
          wrapItem={false}
        >
          <SearchBar
            onFileClick={onCreateFile}
            onFolderClick={onCreateFolder}
          />
          <Files
            data={state.files}
            onSelect={onSelectFile}
            onInputBlur={onInputBlur}
            onDelete={onDelete}
            onRename={onRename}
            inputRef={inputRef}
            selected-keys={[state.currentKey]}
            ref={fileRef}
          />
        </NSpace>
        <ResizeHandler
          onResized={(resized: ResizedOptions) => {
            let width = resized.x
            if (width < 100) width = 100
            if (width > window.innerWidth * 0.5) width = window.innerWidth * 0.5
            widthRef.value = width
          }}
        />
      </NLayoutSider>
    )
  }
})
