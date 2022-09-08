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

import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import { Server } from 'socket.io'
import Datastore from 'nedb-promises'

const app = express()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const httpServer = http.createServer(app)
const io = new Server(httpServer)
const db = new Datastore()

const recursiveChild = async (file, data) => {
  const children = await db.find({ pid: file.id })
  data.children = []
  if (children.length) {
    for (let i = 0; i < children.length; i += 1) {
      data.children.push({
        type: children[i].type,
        name: children[i].name,
        id: children[i].id,
        content: children[i].content,
        pid: file.id
      })
      await recursiveChild(children[i], data.children[i])
    }
  }
}

app.get('/files', async (req, res) => {
  const files = await db.find({ pid: 0 })
  const data = []

  for (let i = 0; i < files.length; i += 1) {
    data.push({
      id: files[i].id,
      type: files[i].type,
      name: files[i].name,
      content: files[i].content,
      pid: files[i].pid
    })
    await recursiveChild(files[i], data[i])
  }

  res.json({
    code: 0,
    data
  })
})

app.put('/files/:pid/add', async (req, res) => {
  const pid = Number(req.params.pid)
  const all = await db.find({})
  const id = all.length + 1
  const data = {
    id: id,
    type: req.body.type,
    name: req.body.name,
    content: req.body.content,
    pid
  }
  await db.insert(data)
  res.json({
    code: 0,
    data: {
      id
    }
  })
})

app.delete('/files/:id', async (req, res) => {
  const id = Number(req.params.id)
  await db.remove({ id })
  await db.remove({ pid: id })
  res.json({
    code: 0,
    data: {
      id
    }
  })
})

app.get('/files/:id', async (req, res) => {
  const id = Number(req.params.id)
  const files = await db.find({ id })
  const data = files.length
    ? {
        content: files[0].content
      }
    : {}
  res.json({
    code: 0,
    data
  })
})

app.post('/files/:id/save', async (req, res) => {
  const id = Number(req.params.id)
  const content = req.body.content
  await db.update({ id }, { $set: { content } })
  res.json({
    code: 0,
    data: {
      id,
      content
    }
  })
})

app.post('/files/:id/run', async (req, res) => {
  res.json({
    code: 0,
    data: {
      instance: 1
    },
    success: true,
    msg: '文件运行成功'
  })
})

app.post('/files/:id/stop', async (req, res) => {
  res.json({
    code: 0,
    data: {},
    success: true,
    msg: '程序已停止'
  })
})

const socketMap = {}
io.on('connection', (socket) => {
  console.log(`a new socket connected, socket id: ${socket.id}`)
  socketMap[socket.id] = socket

  io.emit('log', '2022-09-07 14:23:18 ERROR Shell run failed!\r\n')
  io.emit(
    'log',
    '2022-09-07 14:23:18 INFO --- Invocation of Shell command completed ---\n'
  )
  socket.on('disconnect', (socket) => {
    delete socketMap[socket.id]
    console.log('a socket closed')
  })
})

httpServer.listen(4001, () => {
  console.log('listening on *:4001')
})
