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

import { createLogSocket } from '@/service/modules/log'
import { defineStore } from 'pinia'
import { Socket } from 'socket.io-client'
import type { IWebSocketState } from './types'

export const useWebSocketStore = defineStore({
  id: 'websocket',
  state: (): IWebSocketState => ({
    sockets: {}
  }),
  persist: true,
  getters: {
    getSockets(): Socket[] {
      return Object.values(this.sockets)
    }
  },
  actions: {
    open(id: number, key: number): Socket {
      if (!this.sockets[key]) {
        this.sockets[key] = createLogSocket(id)
      }
      return this.sockets[key]
    },
    close(key: number): void {
      const socket = this.sockets[key]
      if (socket) {
        socket.close()
        delete this.sockets[key]
      }
    }
  }
})
