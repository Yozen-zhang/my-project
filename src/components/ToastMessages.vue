<template>
  <div class="toast-container position-absolute pe-3 top-0 end-0">
    <Toast
      v-for="msg in messages"
      :key="msg.id"
      :msg="msg"
      @dismiss="removeToast(msg.id)"
    />
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue';

export default {
  components: { Toast },
  data() {
    return {
      messages: [],
    };
  },
  inject: ['emitter'],
  mounted() {
    this.emitter.on('push-message', (message) => {
      const { style = 'success', title, content } = message;
      this.messages.push({
        id: Date.now(), // 或使用 uuid 生成唯一 id
        style,
        title,
        content,
      });
    });
  },
  methods: {
    removeToast(id) {
      this.messages = this.messages.filter((msg) => msg.id !== id);
    },
  },
};
</script>
