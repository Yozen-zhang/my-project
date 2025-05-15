<template>
  <div class="text-end">
    <button class="btn btn-primary" type="button" @click="$refs.productModal.showModal">增加產品</button>
  </div>
  <table class="table mt-4">
  <thead>
    <tr>
      <th width="120">分類</th>
      <th>產品名稱</th>
      <th width="120">原價</th>
      <th width="120">售價</th>
      <th width="100">是否啟用</th>
      <th width="200">編輯</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in products" :key="item.id">
      <td>{{ item.category }}</td>
      <td>{{ item.title }}</td>
      <td class="text-right">
        {{ item.origin_price }}
      </td>
      <td class="text-right">
         {{ item.price }}
      </td>
      <td>
        <span class="text-success">{{ item.is_enabled ? '啟用' : '不啟用' }}</span>
      </td>
      <td>
        <div class="btn-group">
          <button class="btn btn-outline-primary btn-sm">編輯</button>
          <button class="btn btn-outline-danger btn-sm">刪除</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
<Productmodal ref="productModal"></Productmodal>
</template>

<script>
import Productmodal from '../components/ProductModal.vue'

export default {
  data(){
    return {
      products: [],
      pagination:{}
    }
  },
  components: {
     Productmodal,
  },
  methods:{
    getProducts(){
       const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products`
      this.$http.get(api)
        .then((res) => {
          if(res.data.success){
            this.products = res.data.products;
            this.pagination = res.data.pagination;
            console.log(res.data)
          }
        })
    }
  },
  created() {
    this.getProducts()
  }
}
</script>