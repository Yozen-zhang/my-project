<template>
  <div class="modal fade" id="couponModal" tabindex="-1" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ tempCoupon.id ? '編輯優惠券' : '新增優惠券' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCoupon">
            <input type="hidden" v-model="tempCoupon.id" />

            <div class="mb-3">
              <label class="form-label">標題</label>
              <input type="text" class="form-control" v-model="tempCoupon.title" required />
            </div>

            <div class="mb-3">
              <label class="form-label">啟用</label>
              <select class="form-select" v-model.number="tempCoupon.is_enabled">
                <option :value="1">是</option>
                <option :value="0">否</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">折扣百分比</label>
              <input type="number" class="form-control" v-model.number="tempCoupon.percent" placeholder="預設為 100" />
            </div>

            <div class="mb-3">
              <label class="form-label">到期日</label>
              <input type="date" class="form-control" v-model="dateInput" required />
            </div>

            <div class="mb-3">
              <label class="form-label">優惠碼</label>
              <input type="text" class="form-control" v-model="tempCoupon.code" required />
            </div>

            <button type="submit" class="btn btn-success">儲存</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalMixins from '@/mixins/modalMixins';

export default {
  props: {
    coupon: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tempCoupon: {},
      dateInput: '', // 日期 input 綁定
    };
  },
  watch: {
    coupon: {
      handler(newVal) {
        this.tempCoupon = { ...newVal };

        // 將 Unix timestamp 轉為 YYYY-MM-DD 給 <input type="date">
        if (newVal.due_date) {
          const date = new Date(newVal.due_date * 1000);
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          this.dateInput = `${yyyy}-${mm}-${dd}`;
        } else {
          this.dateInput = '';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mixins: [ModalMixins],
  methods: {
    saveCoupon() {
      // ✅ 避免 aria-hidden 焦點警告
      if (document.activeElement) {
        document.activeElement.blur();
      }

      // 將 YYYY-MM-DD 轉為 Unix timestamp
      if (this.dateInput) {
        this.tempCoupon.due_date = Math.floor(new Date(this.dateInput).getTime() / 1000);
      }

      // 若 percent 未填寫則預設為 100
      if (!this.tempCoupon.percent && this.tempCoupon.percent !== 0) {
        this.tempCoupon.percent = 100;
      }

      this.$emit('update-coupon', this.tempCoupon);
    },
  },
};
</script>
