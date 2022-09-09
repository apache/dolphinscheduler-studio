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
import { NButton, NIcon, NTooltip } from 'naive-ui'
import {
  FileAddOutlined,
  FullscreenOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined
} from '@vicons/antd'
import { useLocale } from '@/hooks'
import styles from './index.module.scss'
import { useFileStore } from '@/store/file'
import { addFile, runFile, saveFile, stopFile } from '@/service/modules/file'
import { useWebSocketStore } from '@/store/websocket'
import { FileType } from '../studio-sider/types'

export const Toolbar = defineComponent({
  name: 'toolbar',
  setup() {
    const { t } = useLocale()

    const fileStore = useFileStore()
    const webSocketStore = useWebSocketStore()

    const handleSave = async () => {
      const file = fileStore.getCurrentFile
      await saveFile(file.id, { content: file.content })
      fileStore.updateContent(file)
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

    const openFile = async () => {
      const id = fileStore.getOpenFiles.length + 2
      const name = `name-${id}.py`
      const data = await addFile(0, {
        type: 'python' as FileType,
        name
      })
      fileStore.openFile({
        id: data.id,
        name,
        content: ''
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
          <NTooltip trigger='hover'>
            {{
              trigger: () => (
                <NButton text style={{ fontSize: '18px' }} onClick={handleSave}>
                  <NIcon>
                    <SaveOutlined />
                  </NIcon>
                </NButton>
              ),
              default: () => t('save')
            }}
          </NTooltip>
        </div>
        <div class={styles.operate}>
          <NTooltip trigger='hover'>
            {{
              trigger: () => (
                <NButton
                  text
                  style={{ fontSize: '18px' }}
                  onClick={runFlag.value ? handleStop : handleRun}
                >
                  <NIcon>
                    {runFlag.value ? (
                      <PauseCircleOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    )}
                  </NIcon>
                </NButton>
              ),
              default: () => (runFlag.value ? t('stop') : t('run'))
            }}
          </NTooltip>
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
