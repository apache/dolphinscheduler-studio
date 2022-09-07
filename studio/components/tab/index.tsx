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
import { NBadge, NTabPane, NTabs } from 'naive-ui'
import { MonacoEditor } from '../monaco'
import utils from '@/utils'
import { useFileStore } from '@/store/file'
import { Log } from '../log'
import { useWebSocketStore } from '@/store/websocket'

export const Tabs = defineComponent({
  name: 'tabs',
  setup() {
    const fileStore = useFileStore()
    const webSocketStore = useWebSocketStore()

    const updateContent = (value: number) => {
      fileStore.changeTab(value)
    }

    const handleClose = (fileId: number) => {
      fileStore.closeFile(fileId)
      webSocketStore.close(fileId)
    }

    const handleChange = (value: number) => {
      updateContent(value)
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
              <MonacoEditor
                v-model:value={file.content}
                options={{ language }}
              />
              <Log v-model:value={file.log} />
            </NTabPane>
          )
        })}
      </NTabs>
    )
  }
})
