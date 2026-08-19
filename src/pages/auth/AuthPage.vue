<template>
  <AuthModal v-model="open" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AuthModal from './Login.vue'

export default defineComponent({
  name: 'AuthPage',
  components: { AuthModal },
  setup() {
    const open = ref(true)
    return { open }
  },
})
</script>
