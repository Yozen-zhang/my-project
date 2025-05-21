<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/dashboard">後台</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/dashboard/products"
              exact-active-class="active"
            >
              產品列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/dashboard/orders"
              exact-active-class="active"
            >
              訂單
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/dashboard/coupons"
              exact-active-class="active"
            >
              優惠券
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="logout">登出</a>
          </li>
        </ul>
        <span class="navbar-text">Navbar text with an inline element</span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      const api = `${process.env.VUE_APP_API}logout`;
      this.$http.post(api, this.user).then((res) => {
        this.$router.push('/login');
        console.log(res);
      });
    },
  },
};
</script>
