<template>
  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">編輯訂單</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>

        <div class="modal-body">
          <div v-if="tempOrder && tempOrder.user">
            <p><strong>用戶：</strong> {{ tempOrder.user.name }}</p>
            <p><strong>付款方式：</strong> {{ tempOrder.payment_method }}</p>

            <div class="mb-3">
              <label class="form-label">是否已付款</label>
              <select class="form-select" v-model="tempOrder.is_paid">
                <option :value="true">是</option>
                <option :value="false">否</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">總金額</label>
              <input type="number" class="form-control" v-model.number="tempOrder.total" />
            </div>
          </div>
          <div v-else>
            <p>載入中...</p>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          <button type="button" class="btn btn-primary" @click="submitEdit">儲存</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ModalMixins from '@/mixins/modalMixins';

export default {
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tempOrder: {},
    };
  },
  watch: {
    order: {
      handler(newVal) {
        this.tempOrder = { ...newVal };
      },
      deep: true,
      immediate: true,
    },
  },
  mixins: [ModalMixins],
  methods: {
    submitEdit() {
      // 取消 activeElement 焦點，避免 modal 警告
      if (document.activeElement) {
        document.activeElement.blur();
      }

      this.$emit('update-order', this.tempOrder);
    },
  },
};
</script>
