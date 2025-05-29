import { defineStore } from 'pinia';
import { useStatusStore } from './statusStore';
import axios from 'axios';

const status = useStatusStore();
export default defineStore('cartStore', {
  state: () => ({
    cart: [],
    couponcode: '',
    couponMessage: '',
    isCouponValid: false,
    finalPrice: 0,
  }),
  actions: {
    addCart(productId) {
      
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;

      status.loadingItem = productId;
      axios.post(api, { data: { product_id: productId, qty: 1 } })
        .then(() => {
          status.loadingItem = '';
          this.getCart();
        })
        .catch(() => {
          status.loadingItem = '';
        });
    },

    getCart() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;

      status.isLoading = true;
      axios.get(api).then((res) => {
        this.cart = res.data.data.carts;
        this.finalPrice = res.data.data.final_total;
        status.isLoading = false;
      });
    },

    removeItem(cartId) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${cartId}`;
      axios.delete(api).then(() => {
        this.getCart();
      });
    },

    clearCart() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/carts`;
      axios.delete(api)
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
      axios.put(api, {
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
      status.isLoading = true;
      axios.post(api, { data: coupon }).then((res) => {
        status.isLoading = false;
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
  },
});
