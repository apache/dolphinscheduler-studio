import { defineComponent } from 'vue'
import { Studio } from '../../studio'

export default defineComponent({
  name: 'studio-page',
  setup() {
    return () => (
      <>
        <Studio />
      </>
    )
  }
})
