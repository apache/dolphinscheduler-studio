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
import { ref, onMounted } from 'vue'
import { useLogHeight } from '@/hooks'

export function useLogOpen() {
  const logRef = ref()
  let logWindow: Window | null = null
  const { toggleFloatingLogHeight } = useLogHeight()

  const onMessage = (ev: MessageEvent) => {
    const { type } = ev.data
    if (type === 'close') {
      logWindow?.removeEventListener('message', onMessage)
      logWindow = null
      toggleFloatingLogHeight(false)
    }
  }

  const onDragEnd = (ev: DragEvent) => {
    if (
      ev.clientX > window.innerWidth - 50 ||
      ev.clientY > window.innerHeight - 50 ||
      ev.clientX < 50 ||
      ev.clientY < 50
    ) {
      if (logWindow) {
        logWindow.focus()
      } else {
        logWindow = window.open('/log', '_blank')
        logWindow?.addEventListener('message', onMessage)
      }
      toggleFloatingLogHeight(true)
    }
  }

  onMounted(() => {
    logRef.value.addEventListener('dragend', onDragEnd)
  })

  return { logRef }
}
