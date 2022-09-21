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

import { defineComponent, renderSlot } from 'vue'
import { NSpace, NButton, NCard } from 'naive-ui'
import { useLocale } from '@/hooks'

const Fullscreen = defineComponent({
  name: 'fullscreen',
  props: {
    isFullscreen: {
      type: Boolean
    },
    id: {
      type: String
    }
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    const { t } = useLocale()
    const onClose = () => {
      emit('close')
    }
    return () => (
      <div id={props.id}>
        {props.isFullscreen ? (
          <NCard style={{ height: '100vh' }}>
            <NSpace vertical>
              {renderSlot(slots, 'default')}
              <NSpace justify='end'>
                <NButton size='small' type='primary' onClick={onClose}>
                  {t('close')}
                </NButton>
              </NSpace>
            </NSpace>
          </NCard>
        ) : (
          renderSlot(slots, 'default')
        )}
      </div>
    )
  }
})

export default Fullscreen
