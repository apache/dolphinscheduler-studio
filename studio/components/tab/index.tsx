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

import { defineComponent, watch, PropType, reactive } from 'vue'
import { NTabPane, NTabs } from 'naive-ui'
import { MonacoEditor } from '../monaco'
import utils from '@/utils'
import { useFileStore } from '@/store/file'
import { Log } from '../log'
import { createLogSocket } from '@/service/modules/log'
import type { Socket } from 'socket.io-client'

const props = {
  runId: {
    type: Number as PropType<number>,
    default: 0
  }
}

export const Tabs = defineComponent({
  name: 'tabs',
  props,
  setup(props) {
    const socketRef = reactive<{ [key: string]: Socket }>({})
    const fileStore = useFileStore()

    const updateContent = (value: string) => {
      fileStore.changeTab(value)
    }

    const handleClose = (fileName: string) => {
      fileStore.closeFile(fileName)
      socketRef[fileName].close()
    }

    const handleChange = (value: string) => {
      updateContent(value)
    }

    const getLogContent = (id: number) => {
      const file = fileStore.getOpenFiles.filter(
        (file) => file.name === fileStore.getCurrentFile
      )[0]

      if (!socketRef[file.name]) {
        socketRef[file.name] = createLogSocket(id)
      }

      const socket = socketRef[file.name]
      console.log(file.log)
      socket.on('log', (data) => (file.log += data))
    }

    watch(
      () => props.runId,
      () => getLogContent(props.runId)
    )

    return () => (
      <NTabs
        value={fileStore.currentFile}
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
            <NTabPane name={file.name} key={file.name} tab={file.name}>
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
