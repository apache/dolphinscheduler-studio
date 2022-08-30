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

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import _ from 'lodash'

/**
 * @description Log and display errors
 * @param {Error} error Error object
 */
const handleError = (res: AxiosResponse<any, any>) => {
  // Print to console
  if (import.meta.env.MODE === 'development') {
    // eslint-disable-next-line no-console
    console.error(res)
  }
}

const baseRequestConfig: AxiosRequestConfig = {
  baseURL: '/',
  timeout: 1500,
  transformRequest: (params) => {
    if (_.isPlainObject(params)) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    } else {
      return params
    }
  },
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
}

const service = axios.create(baseRequestConfig)

// The response to intercept
service.interceptors.response.use(async (res: AxiosResponse) => {
  if (res.data.code === undefined) {
    return res.data
  }

  switch (res.data.code) {
    case 0:
      return res.data.data
    default:
      handleError(res)
      throw new Error()
  }
})

export { service as axios }
