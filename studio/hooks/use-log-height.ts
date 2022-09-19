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

import { useFileStore } from '@/store/file'
import { useLayoutStore } from '@/store/layout'

export function useLogHeight() {
  const fileStore = useFileStore()
  const layoutStore = useLayoutStore()

  const setLogHeight = (height: number) => {
    layoutStore.setFileLogHeight(fileStore.getCurrentFileId, height)
  }
  const setCurrentLogHeight = () => {
    if (layoutStore.getIsLogFloating) return
    layoutStore.setLogHeightByFileId(fileStore.getCurrentFileId)
  }
  const getLogMaxHeight = () => layoutStore.getLogMaxHeight
  const getLogMinHeight = () => layoutStore.getLogMinHeight
  const getLogHeight = () => layoutStore.getLogHeight
  const getEditorHeight = () => layoutStore.getEditorHeight
  const getIsLogFloating = () => layoutStore.getIsLogFloating
  const setEditorHeight = (height: number) => {
    layoutStore.setEditorHeight(height)
  }
  const toggleLogUpAndDown = () => {
    const logHeight =
      layoutStore.getLogHeight === layoutStore.getLogMinHeight
        ? layoutStore.getLogMaxHeight
        : layoutStore.getLogMinHeight
    setLogHeight(logHeight)
  }
  const toggleLog = () => {
    if (layoutStore.getIsLogFloating) return
    if (layoutStore.logHeight) {
      layoutStore.setPrevLogHeight(layoutStore.logHeight)
    }
    const logHeight = layoutStore.logHeight ? 0 : layoutStore.getPrevLogHeight
    setLogHeight(logHeight)
  }
  const toggleFloatingLogHeight = (logFloating: boolean) => {
    layoutStore.setIsLogFloating(logFloating)
    if (logFloating) {
      layoutStore.setLogHeight(0)
    } else {
      setCurrentLogHeight()
    }
  }

  return {
    setLogHeight,
    getLogHeight,
    getLogMaxHeight,
    getLogMinHeight,
    getEditorHeight,
    getIsLogFloating,
    setCurrentLogHeight,
    toggleLogUpAndDown,
    toggleLog,
    setEditorHeight,
    toggleFloatingLogHeight
  }
}
