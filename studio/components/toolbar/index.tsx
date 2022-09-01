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

import { defineComponent } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import {
  FullscreenOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  ToTopOutlined
} from '@vicons/antd'
import styles from './index.module.scss'
import { useFileStore } from '@/store/file'
import { runFile, saveFile } from '@/service/modules/file'

export const Toolbar = defineComponent({
  name: 'toolbar',
  setup() {
    const fileStore = useFileStore()

    const handleSave = () => {
      const file = fileStore.getOpenFiles.filter(
        (file) => file.name === fileStore.getCurrentFile
      )[0]
      saveFile(file.id, { content: file.content })
    }

    const handleRun = () => {
      const file = fileStore.getOpenFiles.filter(
        (file) => file.name === fileStore.getCurrentFile
      )[0]

      runFile(file.id)
    }

    const openFile = () => {
      const id = fileStore.getOpenFiles.length + 2
      const name = `name-${id}.py`
      fileStore.openFile({
        id,
        name,
        content: '',
        saved: true
      })
    }

    return () => (
      <div class={styles.toolbar}>
        <div class={styles.operate}>
          <NButton text style={{ fontSize: '24px' }} onClick={handleSave}>
            <NIcon>
              <SaveOutlined />
            </NIcon>
          </NButton>
        </div>
        <div class={styles.operate}>
          <NButton text style={{ fontSize: '24px' }} onClick={handleRun}>
            <NIcon>
              <PlayCircleOutlined />
            </NIcon>
          </NButton>
        </div>
        <div class={styles.operate}>
          <NButton text style={{ fontSize: '24px' }}>
            <NIcon>
              <FullscreenOutlined />
            </NIcon>
          </NButton>
        </div>
        <div class={styles.operate}>
          <NButton text style={{ fontSize: '24px' }} onClick={openFile}>
            <NIcon>
              <ToTopOutlined />
            </NIcon>
          </NButton>
        </div>
      </div>
    )
  }
})
