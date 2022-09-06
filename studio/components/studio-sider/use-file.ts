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
import { useMessage } from 'naive-ui'
import { addFile } from '@/service/modules/file'
import { useLocale } from '@/hooks'
import { sameNameValidator } from './helper'
import type { IFileState, FileType, IFileRecord } from './types'

export const useFile = (inputRef: Ref, fileRef: Ref) => {
  const state = reactive({
    currentKey: 0,
    files: [],
    isCreating: false
  } as IFileState)

  const message = useMessage()
  const { t } = useLocale()

  const filesCached = {} as { [key: number]: IFileRecord }

  const freshFiles = () => {
    fileRef.value.refresh()
  }

  const getCurrentFolderKey = (): number => {
    if (state.currentKey === 0) return 0
    const currentRecord = filesCached[state.currentKey]
    return currentRecord.type ? currentRecord.pid : currentRecord.id
  }

  const create = async (isFile: boolean, type?: FileType) => {
    if (state.isCreating) return
    state.isCreating = true
    const currentFolderKey = getCurrentFolderKey()
    const record = {
      isEditing: true,
      id: Date.now(),
      name: '',
      pid: currentFolderKey
    } as IFileRecord

    isFile ? (record.type = type) : (record.children = [])

    filesCached[record.id] = record

    if (currentFolderKey === 0) {
      state.files.unshift(record)
    } else {
      filesCached[currentFolderKey].children.unshift(record)
    }

    state.currentKey = record.id

    freshFiles()
    await nextTick()
    inputRef.value?.focus()
  }

  const save = async () => {
    const currentRecord = filesCached[state.currentKey]
    try {
      const { id } = await addFile(currentRecord.pid, {
        type: currentRecord.type || '',
        name: currentRecord.name
      })
      message.success(t('saved_successfully'))
      currentRecord.id = id
      return true
    } catch (err) {
      return false
    }
  }

  const onCreateFile = (type: FileType) => void create(true, type)

  const onCreateFolder = () => void create(false)

  const onSelectFile = (key: number) => {
    state.currentKey = key
  }

  const onInputBlur = async (value: string) => {
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

    const pid = filesCached[state.currentKey].pid
    const isSame = sameNameValidator(
      value,
      pid ? filesCached[pid].children : state.files
    )
    if (isSame) {
      message.error(t('same_name_tips'))
      return
    }

    const result = await save()
    if (result) {
      filesCached[state.currentKey].isEditing = false
      filesCached[state.currentKey].name = value
      freshFiles()
    }
  }

  return { state, onCreateFile, onCreateFolder, onSelectFile, onInputBlur }
}
