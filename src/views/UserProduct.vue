<template>
  <div class="container py-5">
    <div v-if="product.title" class="row">
      <!-- 商品主圖 -->
      <div class="col-md-6">
        <img
          :src="product.imageUrl"
          class="img-fluid rounded mb-3"
          alt="主圖"
        />

        <!-- 商品額外圖片 -->
        <div class="d-flex flex-wrap gap-2">
          <img
            v-for="(img, index) in product.imagesUrl"
            :key="index"
            :src="img"
            class="img-thumbnail"
            style="width: 100px; height: auto"
            alt="其他圖片"
          />
        </div>
      </div>

      <!-- 商品資訊 -->
      <div class="col-md-6">
        <h2 class="mb-3">{{ product.title }}</h2>
        <p class="text-muted">{{ product.category }}</p>
        <p>{{ product.description }}</p>
        <p class="text-secondary small">{{ product.content }}</p>
        <p class="h5 text-danger">售價：{{ product.price }} 元</p>
        <p class="text-muted text-decoration-line-through">
          原價：{{ product.origin_price }} 元
        </p>
        <p>單位：{{ product.unit }}</p>
        <button class="btn btn-primary mt-3">加入購物車</button>
      </div>
    </div>

    <!-- Loading 或找不到資料 -->
    <div v-else class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {},
    };
  },
  methods: {
    getProduct() {
      const id = this.$route.params.productId;
      console.log(id);
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${id}`;
      this.$http
        .get(url)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.product = res.data.product;
          }
        })
        .catch((err) => {
          console.error('載入商品失敗：', err);
        });
    },
  },
  created() {
    this.getProduct();
  },
};
</script>
