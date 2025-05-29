import { defineStore } from 'pinia';
import { useStatusStore } from '@/stores/statusStore';
import axios from 'axios';
const status = useStatusStore();

export default defineStore('productStore', {
  state: () => {
    return {
      products: [],
    };
  },
  getters: {
    sortProducts: (state) => state.products.sort((a, b) => a.price - b.price),
  },
  actions: {
    getProducts() {
      
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      status.isLoading = true;
      axios.get(api).then((res) => {
        this.products = res.data.products;
        status.isLoading = false;
      });
    },
  },
});
