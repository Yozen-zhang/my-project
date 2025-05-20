<template>
  <Loading :active="isLoading"></Loading>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>圖片</th>
        <th>商品名稱</th>
        <th>價格</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td><img :src="item.imageUrl" width="120px" /></td>
        <td>{{ item.title }}</td>
        <td>{{ item.price }}</td>
        <td>
          <div class="btn-group">
            <button
              class="btn btn-outline-primary btn-sm"
              @click="getinProduct(item.id)"
            >
              查看更多
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="addCart(item.id)"
              :disabled="status.loadingItem === item.id"
            >
              <div
                class="spinner-border spinner-border-sm text-danger"
                role="status"
                v-if="status.loadingItem === item.id"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              加到購物車
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      product: {},
      isLoading: false,
      status: {
        loadingItem: '',
      },
    };
  },
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        console.log(res);
        this.isLoading = false;
        this.products = res.data.products;
      });
    },
    getinProduct(id) {
      console.log(id);
      this.$router.push(`/user/product/${id}`);
    },
    addCart(id) {
      console.log(id);
      const cart = {
        product_id: id,
        qty: 1,
      };
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.status.loadingItem = id;
      this.$http.post(api, { data: cart }).then((res) => {
        console.log(res);
        this.status.loadingItem = '';
      });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
