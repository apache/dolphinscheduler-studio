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

import { defineComponent, ref, PropType, onMounted } from 'vue'
import { NTabPane, NTabs } from 'naive-ui'
import { MonacoEditor } from '../monaco'
import { getFileContent } from '@/service/modules/file'

interface ITab {
  id: number
  name: string
}

const props = {
  value: {
    type: Array as PropType<ITab[]>,
    default: []
  }
}

export const Tabs = defineComponent({
  name: 'tabs',
  props,
  setup(props) {
    const fileRef = ref<string | number>()

    const updateContent = (value: number) => {
      fileRef.value = value
      getFileContent(value)
    }

    const handleClose = () => {}

    const handleChange = (value: number) => {
      updateContent(value)
    }

    const tabPanes = props.value.map((item) => {
      return (
        <NTabPane name={item.id} key={item.id} tab={item.name}>
          <MonacoEditor defaultValue={item.name} />
        </NTabPane>
      )
    })

    onMounted(() => {
      if (props.value.length) {
        updateContent(props.value[0].id)
      }
    })

    return () => (
      <NTabs
        value={fileRef.value}
        type='card'
        closable
        tabStyle={{ minWidth: '80px' }}
        size='small'
        onClose={handleClose}
        on-update:value={handleChange}
      >
        {tabPanes}
      </NTabs>
    )
  }
})
