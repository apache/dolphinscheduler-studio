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

import { computed, defineComponent } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import {
  FileAddOutlined,
  FullscreenOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined
} from '@vicons/antd'
import styles from './index.module.scss'
import { useFileStore } from '@/store/file'
import { runFile, saveFile, stopFile } from '@/service/modules/file'
import { useWebSocketStore } from '@/store/websocket'

export const Toolbar = defineComponent({
  name: 'toolbar',
  setup() {
    const fileStore = useFileStore()
    const webSocketStore = useWebSocketStore()

    const handleSave = () => {
      const file = fileStore.getCurrentFile
      saveFile(file.id, { content: file.content })
    }

    const runFlag = computed(() => {
      const file = fileStore.getCurrentFile
      return file && !!file.flag
    })

    const handleRun = () => {
      const file = fileStore.getCurrentFile
      runFile(file.id)
      fileStore.run()
      const socket = webSocketStore.open(1, file.id)
      socket.on('log', (data) => (file.log += data))
    }

    const handleStop = () => {
      const file = fileStore.getCurrentFile
      webSocketStore.close(file.id)
      fileStore.stop()
      stopFile(file.id)
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
          <NButton text style={{ fontSize: '18px' }} onClick={openFile}>
            <NIcon>
              <FileAddOutlined />
            </NIcon>
          </NButton>
        </div>
        <div class={styles.operate}>
          <NButton text style={{ fontSize: '18px' }} onClick={handleSave}>
            <NIcon>
              <SaveOutlined />
            </NIcon>
          </NButton>
        </div>
        <div class={styles.operate}>
          <NButton
            text
            style={{ fontSize: '18px' }}
            onClick={runFlag.value ? handleStop : handleRun}
          >
            <NIcon>
              {runFlag.value ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            </NIcon>
          </NButton>
        </div>
        <div class={styles.operate}>
          <NButton text style={{ fontSize: '18px' }}>
            <NIcon>
              <FullscreenOutlined />
            </NIcon>
          </NButton>
        </div>
      </div>
    )
  }
})
