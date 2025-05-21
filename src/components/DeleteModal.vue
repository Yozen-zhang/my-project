<template>
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true" ref="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">請確認是否刪除</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="關閉"></button>
        </div>
        <div class="modal-body">
          <p class="mb-0">此操作無法復原，是否確定要刪除？</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">確定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalMixins from '@/mixins/modalMixins';

export default {
  name: 'DeletModal',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  mixins: [ModalMixins],
  methods: {
    confirmDelete() {
      this.$emit('confirm-delete', this.item);
      this.hideModal();
    },
  },
};
</script>
