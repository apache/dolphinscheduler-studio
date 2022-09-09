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

import { defineComponent, PropType, h } from 'vue'
import {
  NTabs,
  NTabPane,
  NLog,
  NConfigProvider,
  NSpace,
  NIcon,
  NButton
} from 'naive-ui'
import { UpOutlined } from '@vicons/antd'
import {
  ResizeHandler,
  ResizedOptions,
  HandlerPlacement
} from '../resize-handler'
import { useLayoutStore } from '@/store/layout'
import hljs from 'highlight.js/lib/core'
import { useLocale } from '@/hooks'
import styles from './index.module.scss'

const props = {
  value: {
    type: String as PropType<string>,
    default: ''
  }
}

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

export const Log = defineComponent({
  name: 'log',
  props,
  setup(props) {
    const { t } = useLocale()

    hljs.registerLanguage('studio-log', () => ({
      contains: [
        {
          scope: 'info',
          begin: 'INFO'
        },
        {
          scope: 'warning',
          begin: 'WARNING'
        },
        {
          scope: 'error',
          begin: 'ERROR'
        }
      ]
    }))

    const layoutStore = useLayoutStore()

    const onResized = (resized: ResizedOptions) => {
      let height = layoutStore.editorHeight - resized.y
      if (height < 40) height = layoutStore.getLogMinHeight
      if (height > layoutStore.getLogMaxHeight)
        height = layoutStore.getLogMaxHeight
      layoutStore.setLogHeight(height)
    }

    return () => {
      return (
        <div
          class={styles['log-wrap']}
          style={{ height: `${layoutStore.getLogHeight}px` }}
        >
          <NTabs type='card' closable size='small'>
            {{
              suffix: () => h(LogToolbar),
              default: () => [
                h(NTabPane, { name: t('run_log') }, () =>
                  h(
                    NConfigProvider,
                    {
                      hljs,
                      class: styles.hljs
                    },
                    () =>
                      h(NLog, {
                        log: props.value,
                        language: 'studio-log',
                        style: {
                          height:
                            layoutStore.getLogHeight -
                            layoutStore.getLogMinHeight
                        }
                      })
                  )
                )
              ]
            }}
          </NTabs>
          <ResizeHandler placement={HandlerPlacement.T} onResized={onResized} />
        </div>
      )
    }
  }
})
