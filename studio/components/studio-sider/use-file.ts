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
import { reactive, Ref, nextTick, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { addFile, deleteFile, getFiles } from '@/service/modules/file'
import { useLocale } from '@/hooks'
import { remove } from 'lodash'
import { sameNameValidator } from './helper'
import { useFileStore } from '@/store/file'
import { getNameByType } from '@/utils/file'
import type { IFileState, FileType, IFileRecord } from './types'

export const useFile = (inputRef: Ref, fileRef: Ref) => {
  const state = reactive({
    currentKey: 0,
    files: [],
    isCreating: false
  } as IFileState)

  const message = useMessage()
  const { t } = useLocale()
  const fileStore = useFileStore()

  const filesCached = {} as { [key: number]: IFileRecord }

  const refreshFiles = () => {
    fileRef.value.refresh()
  }

  const getCurrentFolderKey = (): number => {
    if (state.currentKey === 0) return 0
    const currentRecord = filesCached[state.currentKey]
    return currentRecord.type ? currentRecord.pid : currentRecord.id
  }

  const pullFiles = async () => {
    const files = await getFiles()
    state.files = files

    const loop = (list: IFileRecord[]) => {
      list.forEach((file) => {
        filesCached[file.id] = file
        if (file.type) delete file.children
        if (file.children) loop(file.children)
      })
    }
    loop(files)
  }

  const create = async (isFile: boolean, type: FileType | '') => {
    if (state.isCreating) return
    state.isCreating = true
    const currentFolderKey = getCurrentFolderKey()
    const record = {
      isEditing: true,
      id: Date.now(),
      name: '',
      pid: currentFolderKey
    } as IFileRecord

    record.type = type
    !isFile && (record.children = [])

    filesCached[record.id] = record

    if (currentFolderKey === 0) {
      state.files.unshift(record)
    } else {
      filesCached[currentFolderKey].children?.unshift(record)
    }

    state.currentKey = record.id

    refreshFiles()
    await nextTick()
    inputRef.value?.focus()
  }

  const save = async (name: string) => {
    const currentRecord = filesCached[state.currentKey]
    try {
      const { id } = await addFile(currentRecord.pid, {
        type: currentRecord.type || '',
        name
      })
      message.success(t('saved_successfully'))
      currentRecord.id = id
      state.currentKey = id
      delete filesCached[state.currentKey]
      filesCached[id] = currentRecord
      if (currentRecord.type) {
        fileStore.openFile({
          id,
          name: getNameByType(currentRecord.type, name),
          content: ''
        })
      }
      return true
    } catch (err) {
      return false
    }
  }

  const add = async (value: string) => {
    if (!value) {
      const currentFolderKey = getCurrentFolderKey()

      currentFolderKey
        ? filesCached[currentFolderKey].children?.shift()
        : state.files.shift()

      delete filesCached[state.currentKey]

      state.currentKey = currentFolderKey

      refreshFiles()
      return
    }
    const pid = filesCached[state.currentKey].pid
    const isSame = sameNameValidator(
      value,
      pid ? filesCached[pid].children || [] : state.files
    )
    if (isSame) {
      message.error(t('same_name_tips'))
      return
    }

    const result = await save(value)
    if (result) {
      filesCached[state.currentKey].isEditing = false
      filesCached[state.currentKey].name = value
      refreshFiles()
    }
  }

  const rename = async (value: string) => {
    if (!value) {
      message.error(t('empty_name_tips'))
      return
    }
    filesCached[state.currentKey].isEditing = false
    filesCached[state.currentKey].name = value
    refreshFiles()
  }

  const onCreateFile = (type: FileType) => void create(true, type)

  const onCreateFolder = () => void create(false, '')

  const onSelectFile = (key: number) => {
    state.currentKey = key
  }

  const onInputBlur = async (value: string) => {
    if (state.isCreating) {
      state.isCreating = false
      add(value)
      return
    }
    rename(value)
  }

  const onDelete = async (id: number) => {
    const deletedRecord = filesCached[id]
    if (!deletedRecord.type && deletedRecord.children?.length) {
      message.error(t('delete_tips'))
      return
    }
    await deleteFile(id)

    const children =
      deletedRecord.pid === 0
        ? state.files
        : filesCached[deletedRecord.pid].children || []

    remove(children, (record) => record.id === id)

    delete filesCached[id]
  }

  const onRename = (id: number) => {
    const currentRecord = filesCached[id]
    currentRecord.isEditing = true
    state.currentKey = id
    refreshFiles()
  }

  const onDoubleClick = (id: number) => {
    const currentRecord = filesCached[id]
    if (!currentRecord.type) return
    if (currentRecord.isEditing) return
    fileStore.openFile({
      id,
      name: getNameByType(currentRecord.type, currentRecord.name),
      content: ''
    })
  }

  onMounted(() => {
    pullFiles()
  })

  return {
    state,
    onCreateFile,
    onCreateFolder,
    onSelectFile,
    onInputBlur,
    onDelete,
    onRename,
    onDoubleClick
  }
}
