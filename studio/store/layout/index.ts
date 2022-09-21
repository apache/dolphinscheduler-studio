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

import { defineStore } from 'pinia'
import type { ILayoutState } from './types'

export const useLayoutStore = defineStore({
  id: 'layout',
  state: (): ILayoutState => ({
    siderWidth: 300,
    prevSiderWidth: 300,
    logHeight: 400,
    prevLogHeight: 400,
    editorHeight: 0,
    filesLogHeight: {}
  }),
  persist: true,
  getters: {
    getSiderWidth(): number {
      return this.siderWidth
    },
    getLogHeight(): number {
      return this.logHeight
    },
    getEditorHeight(): number {
      return this.editorHeight
    },
    getLogMaxHeight(): number {
      return this.editorHeight - 40 - 40 - 10
    },
    getLogMinHeight(): number {
      return 43
    },
    getPrevLogHeight(): number {
      return this.prevLogHeight
    }
  },
  actions: {
    toggleSider() {
      if (this.siderWidth) this.prevSiderWidth = this.siderWidth
      this.siderWidth = this.siderWidth ? 0 : this.prevSiderWidth
    },
    setSiderWidth(siderWidth: number) {
      this.siderWidth = siderWidth
    },
    toggleLog() {
      if (this.logHeight) this.prevLogHeight = this.logHeight
      this.logHeight = this.logHeight ? 0 : this.prevLogHeight
    },
    setLogHeightByFileId(id: number) {
      this.logHeight = this.filesLogHeight[id] || 0
    },
    setEditorHeight(editorHeight: number) {
      this.editorHeight = editorHeight
    },
    setLogHeight(logHeight: number) {
      this.logHeight = logHeight
    },
    setFileLogHeight(id: number, logHeight: number) {
      this.filesLogHeight[id] = logHeight
      this.logHeight = logHeight
    },
    setPrevLogHeight(logHeight: number) {
      this.prevLogHeight = logHeight
    }
  }
})
