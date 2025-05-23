<template>
  <Loading :active="isLoading"></Loading>
  <div class="container py-4">
    <h1 class="mb-4">優惠券管理</h1>
    <button class="btn btn-primary mb-3" @click="openModal(true)">
      新增優惠券
    </button>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>標題</th>
          <th>啟用</th>
          <th>折扣(%)</th>
          <th>到期日</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coupon, index) in coupons" :key="coupon.id || index">
          <td>{{ coupon.title }}</td>
          <td>{{ coupon.is_enabled ? '是' : '否' }}</td>
          <td>{{ coupon.percent }}</td>
          <td>{{ formatDate(coupon.due_date) }}</td>
          <td>
            <button
              class="btn btn-sm btn-warning"
              @click="openModal(false, coupon)"
            >
              編輯
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="triggerDeleteModal(coupon)"
            >
              刪除
            </button>
          </td>
        </tr>
        <tr v-if="coupons.length === 0">
          <td colspan="5" class="text-center">目前無優惠券</td>
        </tr>
      </tbody>
    </table>
    <pagination :pages="pagination" @emit-pages="getCoupons"></pagination>

    <coupon-modal
      ref="couponModal"
      :coupon="tempCoupon"
      @update-coupon="updateCoupon"
    ></coupon-modal>

    <delete-modal
      ref="deleteModal"
      :item="tempCoupon"
      @confirm-delete="deleteCoupon"
    ></delete-modal>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue';
import CouponModal from '@/components/CouponModal.vue';
import DeleteModal from '@/components/DeleteModal.vue'; 

export default {
  components: {
    Pagination,
    CouponModal,
    DeleteModal,
  },
  data() {
    return {
      coupons: [],
      pagination: {},
      tempCoupon: {},
      isNew: false,
      isLoading: false,
    };
  },
  inject: ['emitter'],
  methods: {
    getCoupons(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.isLoading = false;
        if (res.data.success) {
          this.coupons = res.data.coupons;
          this.pagination = res.data.pagination;
        }
      });
    },
    openModal(isNew, coupon = {}) {
      this.isNew = isNew;
      this.tempCoupon = isNew ? {} : { ...coupon };
      this.$refs.couponModal.showModal();
    },
    updateCoupon(coupon) {
      const apiBase = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
      let api = apiBase;
      let method = 'post';

      if (!this.isNew) {
        api = `${apiBase}/${coupon.id}`;
        method = 'put';
      }

      this.isLoading = true;
      this.$http[method](api, { data: coupon })
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.getCoupons();
            this.$refs.couponModal.hideModal();
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
          this.isLoading = false;
          console.error('新增或更新失敗:', err.response);
        });
    },
    triggerDeleteModal(coupon) {
      this.tempCoupon = { ...coupon };
      this.$refs.deleteModal.showModal(); // 這裡改成 deleteModal
    },
    deleteCoupon(coupon) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${coupon.id}`;
      this.isLoading = true;

      this.$http
        .delete(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.getCoupons();
            this.emitter.emit('push-message', {
              style: 'success',
              title: '已刪除優惠券',
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
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString();
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
