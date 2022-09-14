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

import { defineComponent } from 'vue'
import { enUS, NConfigProvider, NMessageProvider } from 'naive-ui'

const App = defineComponent({
  name: 'app',
  setup() {
    return () => (
      <NConfigProvider
        style={{ width: '100vw', height: '100vh' }}
        locale={enUS}
        theme={null}
        theme-overrides={{
          common: {
            bodyColor: '#f8f8fc',
            primaryColor: '#1890ff',
            primaryColorHover: '#40a9ff',
            primaryColorPressed: '#096dd9',
            primaryColorSuppl: '#1890ff',
            infoColor: '#1890ff',
            successColor: '#52c41a',
            warningColor: '#faad14',
            errorColor: '#ff4d4f'
          }
        }}
      >
        <NMessageProvider>
          <router-view />
        </NMessageProvider>
      </NConfigProvider>
    )
  }
})

export default App
