import { defineComponent } from 'vue'
import { enUS, NConfigProvider, NMessageProvider } from 'naive-ui'

const App = defineComponent({
  name: 'app',
  setup() {
    return () => (
      <NConfigProvider
        style={{ width: '100vw', height: '100vh' }}
        locale={enUS}
      >
        <NMessageProvider>
          <router-view />
        </NMessageProvider>
      </NConfigProvider>
    )
  }
})

export default App
