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
import { defineComponent, ref, PropType, onMounted, onUnmounted } from 'vue'
import { getDirection } from './helpers'
import styles from './index.module.scss'
import type { HandlerPlacement, ResizedOptions } from './types'

const resizeHandlerProps = {
  placement: {
    type: String as PropType<HandlerPlacement>,
    default: 'right'
  }
}

export { ResizedOptions }

export const ResizeHandler = defineComponent({
  name: 'resize-handler',
  props: resizeHandlerProps,
  emits: ['resized'],
  setup(props, { emit }) {
    const handlerRef = ref()
    const { placement } = props

    const getClasses = (placement: HandlerPlacement): string[] => {
      const classes = [
        styles['resize-handler'],
        styles[`resize-handler-${placement}`]
      ]
      const direction = getDirection(placement)
      classes.push(
        direction === 'x'
          ? styles['resize-handler-x']
          : styles['resize-handler-y']
      )
      return classes
    }
    const classes = getClasses(placement)

    const onMouseDown = (ev: MouseEvent) => {
      document.body.style['user-select' as any] = 'none'
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    const onMouseMove = (ev: MouseEvent) => {
      emit('resized', {
        x: ev.clientX,
        y: ev.clientY
      })
    }
    const onMouseUp = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style['user-select' as any] = 'auto'
    }

    onMounted(() => {
      if (handlerRef.value) {
        handlerRef.value.addEventListener('mousedown', onMouseDown)
      }
    })
    onUnmounted(() => {
      if (handlerRef.value) {
        handlerRef.value.removeEventListener('mousedown', onMouseDown)
      }
    })
    return () => <div ref={handlerRef} class={classes}></div>
  }
})
