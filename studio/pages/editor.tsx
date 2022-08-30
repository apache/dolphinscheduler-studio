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

import {
  NButton,
  NIcon,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NTabPane,
  NTabs
} from 'naive-ui'
import { ref, defineComponent } from 'vue'
import {
  FullscreenOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  ToTopOutlined
} from '@vicons/antd'
import styles from './styles.module.scss'

export const EditorPage = defineComponent({
  name: 'editor-page',
  setup() {
    const fileRef = ref(1)

    const handleClose = () => {}

    const tabPanes = [1, 2, 3].map((item) => {
      return (
        <NTabPane name={item} key={item} tab={item.toString()}>
          {{ item }}
        </NTabPane>
      )
    })

    return () => (
      <NLayout>
        <NLayoutHeader>
          <div class={styles.toolbar}>
            <div class={styles.operate}>
              <NButton text style={{ fontSize: '24px' }}>
                <NIcon>
                  <SaveOutlined />
                </NIcon>
              </NButton>
            </div>
            <div class={styles.operate}>
              <NButton text style={{ fontSize: '24px' }}>
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
              <NButton text style={{ fontSize: '24px' }}>
                <NIcon>
                  <ToTopOutlined />
                </NIcon>
              </NButton>
            </div>
          </div>
        </NLayoutHeader>
        <NLayoutContent
          style={{
            height: '664px'
          }}
        >
          <NTabs
            value={fileRef.value}
            type='card'
            closable
            tabStyle={{ minWidth: '80px' }}
            onClose={handleClose}
          >
            {tabPanes}
          </NTabs>
        </NLayoutContent>
      </NLayout>
    )
  }
})
