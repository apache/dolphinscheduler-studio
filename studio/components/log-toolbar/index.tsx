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
import { NSpace, NIcon, NButton } from 'naive-ui'
import { UpOutlined } from '@vicons/antd'
import { useLayoutStore } from '@/store/layout'

export const LogToolbar = defineComponent({
  name: 'log-toolbar',
  setup() {
    const layoutStore = useLayoutStore()
    return () => (
      <NSpace>
        <NButton
          text
          style={{ fontSize: '16px' }}
          onClick={layoutStore.toggleLogUpAndDown}
        >
          <NIcon
            style={{
              transform: `rotate(${
                layoutStore.getLogHeight === layoutStore.getLogMinHeight
                  ? 0
                  : 180
              }deg)`,
              transition: '0.3'
            }}
          >
            <UpOutlined />
          </NIcon>
        </NButton>
      </NSpace>
    )
  }
})
