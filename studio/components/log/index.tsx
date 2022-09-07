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

import { NTabs, NTabPane, NLog, NConfigProvider } from 'naive-ui'
import { defineComponent, PropType } from 'vue'
import hljs from 'highlight.js/lib/core'
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

    return () => {
      return (
        <NTabs type='card' closable size='small'>
          <NTabPane name='运行日志'>
            <NConfigProvider hljs={hljs} class={styles.hljs}>
              <NLog log={props.value} language='studio-log' />
            </NConfigProvider>
          </NTabPane>
        </NTabs>
      )
    }
  }
})
