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
import { NTabs, NTabPane, NLog, NConfigProvider } from 'naive-ui'
import {
  ResizeHandler,
  ResizedOptions,
  HandlerPlacement
} from '../resize-handler'
import { useLogHeight } from '@/hooks'
import hljs from 'highlight.js/lib/core'
import { useLocale } from '@/hooks'
import { LogToolbar } from '../log-toolbar'
import styles from './index.module.scss'

const props = {
  value: {
    type: String as PropType<string>,
    default: ''
  }
}

export const Log = defineComponent({
  name: 'log',
  props,
  setup(props) {
    const { t } = useLocale()
    const {
      setLogHeight,
      getLogHeight,
      getLogMaxHeight,
      getLogMinHeight,
      getEditorHeight
    } = useLogHeight()
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

    const onResized = (resized: ResizedOptions) => {
      let height = getEditorHeight() - resized.y
      if (height < 40) height = getLogMinHeight()
      if (height > getLogMaxHeight()) height = getLogMaxHeight()
      setLogHeight(height)
    }

    return () => {
      return (
        <div
          class={styles['log-wrap']}
          style={{
            height: `${getLogHeight()}px`,
            display: getLogHeight() ? 'block' : 'none'
          }}
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
                          height: getLogHeight() - getLogMinHeight()
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
