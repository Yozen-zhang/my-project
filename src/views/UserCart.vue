<template>
  <Loading :active="isLoading" />
  <div class="container mt-4">
    <div class="row">
      <!-- 左側：商品列表 -->
      <div class="col-lg-6 mb-4">
        <h5 class="mb-3">商品列表</h5>
        <table class="table">
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
              <td><img :src="item.imageUrl" width="100" /></td>
              <td>{{ item.title }}</td>
              <td>{{ item.price }} 元</td>
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
      </div>

      <!-- 右側：購物車 -->
      <div class="col-lg-6">
        <h5 class="mb-3">購物車</h5>

        <button
          class="btn btn-danger btn-sm mb-3"
          @click="clearCart"
          :disabled="cart.length === 0"
        >
          清空購物車
        </button>

        <table class="table table-bordered align-middle" v-if="cart.length > 0">
          <thead class="table-light">
            <tr>
              <th>商品名稱</th>
              <th>數量</th>
              <th>價格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.id">
              <td>{{ item.product.title }}</td>
              <td>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    min="1"
                    v-model.number="item.qty"
                    @change="onQtyChange(item)"
                  />
                  <span class="input-group-text">{{ item.product.unit }}</span>
                </div>
              </td>
              <td>{{ item.product.price * item.qty }} 元</td>
              <td>
                <button
                  class="btn btn-sm btn-danger"
                  @click="removeItem(item.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-end fw-bold">總價格：</td>
              <td class="fw-bold">{{ finalPrice }} 元</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div v-else class="alert alert-info">購物車目前無商品</div>
        <!-- 優惠碼輸入區塊 -->
        <div class="mt-4">
          <h6>使用優惠碼</h6>
          <div class="input-group mb-2">
            <input
              type="text"
              class="form-control"
              v-model="couponcode"
              placeholder="輸入優惠碼，例如 SAVE10"
            />
            <button class="btn btn-primary" @click="applyCoupon">套用</button>
          </div>
          <div
            v-if="couponMessage"
            :class="['alert', isCouponValid ? 'alert-success' : 'alert-danger']"
          >
            {{ couponMessage }}
          </div>
        </div>
      </div>
    </div>
    <!-- 訂單資訊表單 -->
    <div class="mt-5">
      <h5>訂單資訊</h5>
      <form @submit.prevent="submitOrder">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            type="email"
            v-model="form.user.email"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <input
            id="name"
            type="text"
            v-model="form.user.name"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <input
            id="tel"
            type="tel"
            v-model="form.user.tel"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <input
            id="address"
            type="text"
            v-model="form.user.address"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            id="message"
            v-model="form.message"
            class="form-control"
            rows="3"
          ></textarea>
        </div>

        <button class="btn btn-success" type="submit">送出訂單</button>
      </form>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      products: [],
      cart: [],
      isLoading: false,
      status: {
        loadingItem: '',
      },
      couponcode: '',
      couponMessage: '',
      isCouponValid: false,
      finalPrice: 0,
      form: {
      user: {
        name: '',
        email: '',
        tel: '',
        address: ''
      },
      message: ''
    }
    };
  },
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.products = res.data.products;
        this.isLoading = false;
      });
    },
    getinProduct(id) {
      this.$router.push(`/user/product/${id}`);
    },
    addCart(productId) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.status.loadingItem = productId;
      this.$http
        .post(api, { data: { product_id: productId, qty: 1 } })
        .then(() => {
          this.status.loadingItem = '';
          this.getCart();
        })
        .catch(() => {
          this.status.loadingItem = '';
        });
    },
    getCart() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.cart = res.data.data.carts;
        this.finalPrice = res.data.data.final_total;
        this.isLoading = false;
      });
    },
    removeItem(cartId) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${cartId}`;
      this.$http.delete(api).then(() => {
        this.getCart();
      });
    },
    clearCart() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/carts`;
      this.$http
        .delete(api)
        .then(() => {
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message || '刪除全部失敗');
        });
    },
    onQtyChange(item) {
      if (item.qty < 1) {
        item.qty = 1;
      }
      this.updateCartQty(item.id, item.qty);
    },
    updateCartQty(cartId, qty) {
      const item = this.cart.find((i) => i.id === cartId);
      if (!item) return;

      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${cartId}`;
      this.$http
        .put(api, {
          data: {
            product_id: item.product.id,
            qty: qty,
          },
        })
        .then(() => {
          this.getCart();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    applyCoupon() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = { code: this.couponcode };
      this.isLoading = true;
      this.$http.post(api, { data: coupon }).then((res) => {
        this.isLoading = false;
        console.log(res);
        if (res.data.success) {
          this.getCart();
          this.couponMessage = res.data.message;
          this.isCouponValid = true;
        } else {
          this.couponMessage = res.data.message;
          this.isCouponValid = false;
        }
      });
    },
    submitOrder(){
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order`;
      const form = this.form
      this.isLoading = true;
      this.$http.post(api, { data: form }).then((res) => {
        this.isLoading = false;
        this.getCart(); 
        alert('訂單送出成功');
        this.form = {
          user: {
            name: '',
            email: '',
            tel: '',
            address: ''
          },
          message: ''
        };
      }).catch((err) => {
        this.isLoading = false;
        alert(err.response.data.message || '送出訂單失敗');
      });

    }
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>
