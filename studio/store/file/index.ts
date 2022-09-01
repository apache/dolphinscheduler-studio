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
import { IFile, IFileState } from './types'

export const useFileStore = defineStore({
  id: 'file',
  state: (): IFileState => ({
    files: [],
    fileNames: [],
    currentFile: ''
  }),
  persist: true,
  getters: {
    getOpenFiles(): IFile[] {
      return this.files
    },
    getCurrentFile(): string {
      return this.currentFile
    }
  },
  actions: {
    openFile(file: IFile): void {
      if (!this.fileNames.includes(file.name)) {
        file.oldContent = file.content
        this.files.push(file)
        this.fileNames.push(file.name)
      }
      this.currentFile = file.name
    },
    closeFile(fileName: string): void {
      const index = this.fileNames.findIndex((name) => name === fileName)
      this.fileNames = this.fileNames.filter((name) => name !== fileName)
      this.files = this.files.filter((file) => file.name !== fileName)

      const nextIndex = index > 0 ? index - 1 : 0
      this.currentFile = this.fileNames[nextIndex] || ''
    },
    changeTab(fileName: string): void {
      this.currentFile = fileName
    }
  }
})
