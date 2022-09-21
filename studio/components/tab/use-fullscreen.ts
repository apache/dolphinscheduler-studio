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
import { ref, onMounted, onUnmounted } from 'vue'
import screenfull from 'screenfull'

export function useFullscreen() {
  const isFullscreen = ref(false)

  const toggleFullscreen = (idSelector: string) => {
    const Ele = document.getElementById(idSelector)
    if (Ele) screenfull.toggle(Ele)
  }

  onMounted(() => {
    screenfull.on(
      'change',
      () => void (isFullscreen.value = screenfull.isFullscreen)
    )
  })

  onUnmounted(() => {
    screenfull.on(
      'change',
      () => void (isFullscreen.value = screenfull.isFullscreen)
    )
  })

  return {
    isFullscreen,
    toggleFullscreen
  }
}
