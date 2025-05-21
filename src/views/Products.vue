<template>
  <Loading :active="isLoading"></Loading>
  <div class="text-end">
    <button class="btn btn-primary" type="button" @click="openModal(true)">
      增加產品
    </button>
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
          {{ $filters.currency(item.origin_price) }}
        </td>
        <td class="text-right">
          {{ $filters.currency(item.price) }}
        </td>
        <td>
          <span class="text-success">{{ item.is_enabled ? '啟用' : '不啟用' }}</span>
        </td>
        <td>
          <div class="btn-group">
            <button
              class="btn btn-outline-primary btn-sm"
              @click="openModal(false, item)"
            >
              編輯
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="triggerDeleteModal(item)"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <pagination :pages="pagination" @emit-pages="getProducts"></pagination>

  <Productmodal
    ref="productModal"
    :product="tempProduct"
    @update-product="updateProduct"
  ></Productmodal>
  
  <delete-modal
    ref="deleteModal"
    :item="tempProduct"
    @confirm-delete="deleteProduct"
  />
</template>

<script>
import Productmodal from '../components/ProductModal.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteModal from '@/components/DeleteModal.vue';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
    };
  },
  components: {
    Productmodal,
    Pagination,
    DeleteModal,
  },
  inject: ['emitter'],
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products/?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.isLoading = false;
        if (res.data.success) {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        }
      });
    },
    openModal(isNew, item = {}) {
      this.tempProduct = isNew ? {} : { ...item };
      this.isNew = isNew;
      this.$refs.productModal.showModal();
    },
    updateProduct(item) {
      this.tempProduct = { ...item };
      const productComponent = this.$refs.productModal;

      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';

      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
        httpMethod = 'put';
      }
      this.isLoading = true;
      this.$http[httpMethod](api, { data: this.tempProduct })
        .then((res) => {
          this.isLoading = false;
          productComponent.hideModal();
          if (res.data.success) {
            this.getProducts();
            this.emitter.emit('push-message', {
              style: 'success',
              title: '更新成功',
            });
          } else {
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '更新失敗',
              content: res.data.message.join('、'),
            });
          }
        })
        .catch((err) => {
          console.error('新增或更新失敗：', err.response);
        });
    },
    // 觸發刪除 Modal 並帶入該產品
    triggerDeleteModal(product) {
      this.tempProduct = { ...product };
      this.$refs.deleteModal.showModal();
    },
    // 確認刪除動作
    deleteProduct(product) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${product.id}`;
      this.isLoading = true;
      this.$http
        .delete(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.getProducts(); // 重新抓列表
            this.emitter.emit('push-message', {
              style: 'success',
              title: '已刪除產品',
            });
          } else {
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '刪除失敗',
              content: res.data.message,
            });
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除失敗',
            content: err.response?.data?.message || '系統錯誤',
          });
          console.error(err);
        });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
