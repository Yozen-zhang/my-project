<template>
  <UserNavbar></UserNavbar>
  <div class="container-fluid">
    <ToastMessages></ToastMessages>
    <router-view />
  </div>
</template>

<script>
import UserNavbar from '../components/UserNavbar.vue';
import emitter from '@/methods/emitter';
import ToastMessages from '@/components/ToastMessages.vue';

export default {
  components: {
    UserNavbar,
    ToastMessages,
  },
  provide() {
    return {
      emitter,
    };
  },
};
</script>
