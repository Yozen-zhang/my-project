<template>
   <Loading :active="isLoading"></Loading>
  <div class="text-end">
    <button class="btn btn-primary" type="button" @click="openModal(true)">增加產品</button>
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
          <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
          <button class="btn btn-outline-danger btn-sm" >刪除</button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
<Productmodal ref="productModal" :product="tempProduct" @update-product="updateProduct"></Productmodal>
</template>

<script>
import Productmodal from '../components/ProductModal.vue'

export default {
  data(){
    return {
      products: [],
      pagination:{},
      tempProduct:{},
      isNew: false,
      isLoading:false,
    }
  },
  components: {
     Productmodal,
  },
  methods:{
    getProducts(){
       const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products`
       this.isLoading = true
       this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          if(res.data.success){
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }
        })
    },
    openModal(isNew,item){
      if(isNew){
        this.tempProduct = {};
      }else{
        this.tempProduct = {...item}
      }
      this.isNew = isNew
      const productComponent = this.$refs.productModal;
      productComponent.showModal();
    },
    updateProduct(item){
  this.tempProduct = { ...item }; // ← 安全地更新
  const productComponent = this.$refs.productModal;

  let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`;
  let httpMethod = 'post';

  if (!this.isNew) {
    api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
    httpMethod = 'put';
  }
  this.isLoading = true
  this.$http[httpMethod](api, { data: this.tempProduct })
    .then((res) => {
      console.log(res);
      this.isLoading = false
      productComponent.hideModal();
      this.getProducts();
    })
    .catch((err) => {
      console.error('新增或更新失敗：', err.response);
    });
   },
  },
  created() {
    this.getProducts()
  }
}
</script>