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

export const Toolbar = defineComponent({
  name: 'toolbar',
  setup() {
    return () => (
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
    )
  }
})
