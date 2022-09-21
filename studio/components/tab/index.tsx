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
import { NBadge, NButton, NSpace, NTabPane, NTabs, useDialog } from 'naive-ui'
import { MonacoEditor } from '../monaco'
import { Toolbar } from '../toolbar'
import utils from '@/utils'
import { useFileStore } from '@/store/file'
import { Log } from '../log'
import { useWebSocketStore } from '@/store/websocket'
import { saveFile } from '@/service/modules/file'
import { useLocale, useLogHeight } from '@/hooks'
import Fullscreen from './fullscreen'
import { useFullscreen } from './use-fullscreen'

export const Tabs = defineComponent({
  name: 'tabs',
  setup() {
    const { t } = useLocale()
    const dialog = useDialog()
    const fileStore = useFileStore()
    const { setCurrentLogHeight, getEditorHeight, getLogHeight } =
      useLogHeight()
    const webSocketStore = useWebSocketStore()
    const { isFullscreen, toggleFullscreen } = useFullscreen()

    const updateContent = (value: number) => {
      fileStore.changeTab(value)
      setCurrentLogHeight()
    }

    const onClose = (fileId: number) => {
      fileStore.closeFile(fileId)
      webSocketStore.close(fileId)
    }

    const handleClose = (fileId: number) => {
      const file = fileStore.getFile(fileId)
      if (file.content !== file.oldContent) {
        dialog.warning({
          title: t('close_tips'),
          content: t('close_content'),
          action: () => (
            <NSpace>
              <NButton
                onClick={async () => {
                  saveFile(file.id, { content: file.content })
                  fileStore.updateContent(file)
                  dialog.destroyAll()
                }}
              >
                {t('save')}
              </NButton>
              <NButton
                onClick={() => {
                  onClose(fileId)
                  dialog.destroyAll()
                }}
              >
                {t('force_close')}
              </NButton>
              <NButton onClick={() => dialog.destroyAll()} type='primary'>
                {t('cannel')}
              </NButton>
            </NSpace>
          )
        })
      } else {
        onClose(fileId)
      }
    }

    const handleChange = (value: number) => {
      updateContent(value)
    }

    const handleFullscreen = (id: number) => {
      toggleFullscreen('file-editor-' + id)
    }

    return () => (
      <NTabs
        value={fileStore.getCurrentFile.id}
        type='card'
        closable
        tabStyle={{ minWidth: '80px', height: '100%' }}
        size='small'
        onClose={handleClose}
        on-update:value={handleChange}
      >
        {fileStore.getOpenFiles.map((file) => {
          const language = utils.getLanguageByName(file.name)
          return (
            <NTabPane
              name={file.id}
              key={file.name}
              tab={() => (
                <div>
                  {file.name}{' '}
                  {file.oldContent !== file.content && (
                    <NBadge dot type='warning' />
                  )}
                </div>
              )}
            >
              <Toolbar onFullscreen={() => void handleFullscreen(file.id)} />
              <Fullscreen
                id={'file-editor-' + file.id}
                isFullscreen={isFullscreen.value}
                onClose={() => void handleFullscreen(file.id)}
              >
                <MonacoEditor
                  v-model:value={file.content}
                  options={{ language }}
                  height={
                    !isFullscreen.value
                      ? `${getEditorHeight() - getLogHeight() - 40 - 45}px`
                      : 'calc(100vh - 70px)'
                  }
                />
              </Fullscreen>
              <Log v-model:value={file.log} />
            </NTabPane>
          )
        })}
      </NTabs>
    )
  }
})
