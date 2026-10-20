<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onClick: {
    type: Function,
    default: () => {},
  },
  style: {
    type: String,
    default: 'filled',
    validator: (value) => ['outlined', 'filled'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
  },
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const stylePrefix = props.style === 'outlined' ? 'btn-outline' : 'btn'
  const sizeClass = props.size === 'small' ? 'btn-sm' : props.size === 'large' ? 'btn-lg' : ''

  return ['btn', `${stylePrefix}-${props.color}`, sizeClass].filter(Boolean)
})

const handleClick = (event) => {
  props.onClick(event)
  emit('click', event)
}
</script>
