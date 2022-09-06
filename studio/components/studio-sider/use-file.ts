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
import { reactive, Ref, nextTick } from 'vue'
import type { IFileState, FileType, IFileRecord } from './types'

export const useFile = (inputRef: Ref, fileRef: Ref) => {
  const state = reactive({
    currentKey: 0,
    files: [],
    isCreating: false
  } as IFileState)

  const filesCached = {} as { [key: number]: IFileRecord }

  const freshFiles = () => {
    fileRef.value.refresh()
  }

  const getCurrentFolderKey = (): number => {
    if (state.currentKey === 0) return 0
    const currentRecord = filesCached[state.currentKey]
    return currentRecord.type ? currentRecord.pid : currentRecord.key
  }

  const create = async (isFile: boolean, type?: FileType) => {
    if (state.isCreating) return
    state.isCreating = true
    const currentFolderKey = getCurrentFolderKey()
    const record = {
      isCreate: true,
      key: Date.now(),
      label: '',
      pid: currentFolderKey
    } as IFileRecord

    isFile ? (record.type = type) : (record.children = [])

    filesCached[record.key] = record

    if (currentFolderKey === 0) {
      state.files.unshift(record)
    } else {
      filesCached[currentFolderKey].children.unshift(record)
    }

    state.currentKey = record.key

    freshFiles()
    await nextTick()
    inputRef.value?.focus()
  }

  const onCreateFile = (type: FileType) => void create(true, type)

  const onCreateFolder = () => void create(false)

  const onSelectFile = (key: number) => {
    state.currentKey = key
  }

  const onInputBlur = (value: string) => {
    state.isCreating = false
    if (!value) {
      const currentFolderKey = getCurrentFolderKey()

      currentFolderKey
        ? filesCached[currentFolderKey].children.shift()
        : state.files.shift()

      delete filesCached[state.currentKey]

      state.currentKey = currentFolderKey

      freshFiles()
      return
    }
    filesCached[state.currentKey].isCreate = false
    filesCached[state.currentKey].label = value
    freshFiles()
  }

  return { state, onCreateFile, onCreateFolder, onSelectFile, onInputBlur }
}
