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
import {
  NLayoutHeader,
  NGradientText,
  NSpace,
  NDropdown,
  NButton
} from 'naive-ui'
import { useLogHeight, useSiderWidth } from '@/hooks'
import styles from './index.module.scss'

export const StudioHeader = defineComponent({
  name: 'studio-header',
  setup() {
    const { toggleSider } = useSiderWidth()
    const { toggleLog, getIsLogFloating } = useLogHeight()
    const onSelect = (key: string) => {
      if (key === '1') {
        toggleSider()
        return
      }
      if (key === '2') {
        toggleLog()
        return
      }
    }
    return () => (
      <NLayoutHeader class={styles['studio-header']}>
        <NSpace justify='space-between' align='center'>
          <NGradientText type='primary' size={20}>
            DolphinScheduler Studio
          </NGradientText>
          <NDropdown
            trigger='click'
            onSelect={onSelect}
            options={[
              {
                key: '1',
                label: () => h('div', { class: styles['label-icon-vertical'] })
              },
              {
                key: '2',
                disabled: getIsLogFloating(),
                label: () =>
                  h('div', {
                    class: styles['label-icon-horizontal']
                  })
              }
            ]}
          >
            <NButton quaternary type='primary' class={styles['icon-button']}>
              <div class={styles['icon-vertical']}></div>
            </NButton>
          </NDropdown>
        </NSpace>
      </NLayoutHeader>
    )
  }
})
