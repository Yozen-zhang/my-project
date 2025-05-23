<template>
  <Loading :active="isLoading"></Loading>
  <div class="container mt-5">
    <h2>訂單列表</h2>

    <table class="table table-bordered table-hover mt-3">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>訂單編號</th>
          <th>用戶</th>
          <th>總金額</th>
          <th>付款狀態</th>
          <th>下單日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in orders" :key="order.id">
          <td>{{ index + 1 }}</td>
          <td>{{ order.id }}</td>
          <td>{{ order.user?.name || '—' }}</td>
          <td>${{ order.total }}</td>
          <td>
            <span
              class="badge"
              :class="order.is_paid ? 'bg-success' : 'bg-secondary'"
            >
              {{ order.is_paid ? '已付款' : '未付款' }}
            </span>
          </td>
          <td>{{ formatDate(order.create_at) }}</td>
          <td>
            <button class="btn btn-sm btn-info me-2" @click="openModal(order)">
              修改
            </button>
            <button class="btn btn-sm btn-danger" @click="triggerDeleteModal(order)">刪除</button>
          </td>
        </tr>
        <tr v-if="orders.length === 0">
          <td colspan="7" class="text-center">載入中或沒有訂單資料</td>
        </tr>
      </tbody>
    </table>

    <pagination :pages="pagination" @emit-pages="getOrders" />

    <!-- Modal component -->
    <OrderModal
      ref="orderModal"
      :order="tempOrder"
      @update-order="updateOrder"
    />
     <delete-modal
      ref="deleteModal"
      :item="tempOrder"
      @confirm-delete="deleteOrder"
    ></delete-modal>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue';
import OrderModal from '@/components/OrderModal.vue';
import DeleteModal from '@/components/DeleteModal.vue'; 

export default {
  components: {
    Pagination,
    OrderModal,
    DeleteModal,
  },
  inject: ['emitter'],
  data() {
    return {
      orders: [],
      pagination: {},
      tempOrder: {},
      isLoading: false,
    };
  },
  methods: {
    getOrders(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.isLoading = false;
        if (res.data.success) {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
        }
      });
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    },
    openModal(order) {
      this.tempOrder = { ...order };
      this.$refs.orderModal.showModal();
    },
    updateOrder(order) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${order.id}`;
      this.isLoading = true;
      this.$http
        .put(api, { data: order })
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.getOrders();
            this.$refs.orderModal.hideModal();
            this.emitter.emit('push-message', {
              style: 'success',
              title: '更新成功',
            });
          } else {
            this.emitter.emit('push-message', {
              style: 'danger',
              title: '更新失敗',
              content: res.data.message?.join('、') || res.data.message,
            });
          }
        })
        .catch((err) => {
          this.isLoading = false;
          console.error('更新失敗:', err.response);
        });
    },
    triggerDeleteModal(order) {
      this.tempOrder = { ...order };
      this.$refs.deleteModal.showModal(); // 這裡改成 deleteModal
    },
    deleteOrder(order) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${order.id}`;
      this.isLoading = true;

      this.$http
        .delete(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.getOrders();
            this.emitter.emit('push-message', {
              style: 'success',
              title: '已刪除訂單',
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
          console.error('刪除失敗:', err.response);
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '刪除失敗',
            content: err.response?.data?.message || '系統錯誤',
          });
        });
    },
  },
  created() {
    this.getOrders();
  },
};
</script>
