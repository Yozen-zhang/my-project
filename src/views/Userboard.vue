<template>
  <Navbar></Navbar>
  <div class="container-fluid">
    <ToastMessages></ToastMessages>
    <router-view />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import emitter from '@/methods/emitter';
import ToastMessages from '@/components/ToastMessages.vue';

export default {
  components: {
    Navbar,
    ToastMessages,
  },
  provide() {
    return {
      emitter,
    };
  },
};
</script>
