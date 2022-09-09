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
import type { IFile, IFileState } from './types'

export const useFileStore = defineStore({
  id: 'file',
  state: (): IFileState => ({
    files: [],
    currentFileId: -1
  }),
  persist: true,
  getters: {
    getOpenFiles(): IFile[] {
      return this.files
    },
    getCurrentFile(): IFile {
      return (
        this.files.filter((file) => file.id === this.currentFileId)[0] || {}
      )
    },
    getFile(state): (id: number) => IFile {
      return (id: number) =>
        state.files.filter((file) => file.id === id)[0] || {}
    }
  },
  actions: {
    openFile(file: IFile): void {
      if (!this.files.filter((item) => item.id === file.id).length) {
        file.oldContent = file.content
        file.log = ''
        this.files = [...this.files, file]
      }
      this.currentFileId = file.id
    },
    closeFile(id: number): void {
      const index = this.files.findIndex((file) => file.id === id)
      this.files = this.files.filter((file) => file.id !== id)

      const nextIndex = index > 0 ? index - 1 : 0
      this.currentFileId = this.files.length ? this.files[nextIndex].id : -1
    },
    changeTab(id: number): void {
      this.currentFileId = id
    },
    run() {
      this.getCurrentFile.log = ''
      this.getCurrentFile.flag = true
    },
    stop() {
      this.getCurrentFile.flag = false
    },
    updateContent(file: IFile) {
      file.oldContent = file.content
    }
  }
})
