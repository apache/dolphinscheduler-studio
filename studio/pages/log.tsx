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

import { defineComponent, onMounted, ref } from 'vue'
import { NTabs, NTabPane, NCard, NIcon, NSpace, NButton } from 'naive-ui'
import { LogComponent } from '@/components/log'
import { useLocale } from '@/hooks'
import { LineOutlined } from '@vicons/antd'

const LogToolbar = defineComponent({
  name: 'page-log-toolbar',
  emits: ['close'],
  setup(props, { emit }) {
    const onClose = () => {
      emit('close')
    }
    return () => (
      <NSpace wrapItem={false} style={{ padding: '0px 10px' }}>
        <NButton text style={{ fontSize: '16px' }} onClick={onClose}>
          <NIcon>
            <LineOutlined />
          </NIcon>
        </NButton>
      </NSpace>
    )
  }
})

export const LogPage = defineComponent({
  name: 'log-page',
  setup() {
    const height = window.innerHeight - 85
    const logValueRef = ref()
    const { t } = useLocale()

    const onClose = () => {
      window.opener.postMessage({ type: 'close' })
      window.close()
    }

    let beginTime = 0
    onMounted(() => {
      window.opener.addEventListener('message', (ev: MessageEvent) => {
        const { type, data } = ev.data
        if (type === 'log') {
          logValueRef.value = data
        }
      })
      window.addEventListener('beforeunload', () => {
        beginTime = Date.now()
      })
      window.addEventListener('unload', () => {
        const diffTime = Date.now() - beginTime
        if (diffTime < 10) {
          onClose()
        }
      })
    })

    return () => (
      <NTabs type='card' size='small'>
        {{
          suffix: <LogToolbar onClose={onClose} />,
          default: () => (
            <NTabPane name={t('run_log')}>
              <NCard>
                <LogComponent
                  v-model:value={logValueRef.value}
                  height={height}
                />
              </NCard>
            </NTabPane>
          )
        }}
      </NTabs>
    )
  }
})
