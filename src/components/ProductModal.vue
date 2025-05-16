<template>
  <div class="modal fade" tabindex="-1" ref="modal" role="dialog">
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">新增產品</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="image" class="form-label">輸入圖片網址</label>
                <input
                  type="text"
                  class="form-control"
                  id="image"
                  v-model="tempProduct.imageUrl"
                  placeholder="請輸入圖片連結"
                >
              </div>

              <div class="mb-3">
                <label for="customFile" class="form-label">或 上傳圖片
                  <i class="fas fa-spinner fa-spin"></i>
                </label>
                <input
                  type="file"
                  id="customFile"
                  class="form-control"
                  @change="uploadFile"
                  ref="fileInput"
                >
              </div>

              <img
                class="img-fluid"
                :src="tempProduct.imageUrl"
                alt="預覽圖片"
              >

              <!-- 多圖 -->
              <div class="mt-5">
                <div class="mb-3 input-group">
                  <input type="url" class="form-control" placeholder="請輸入連結" />
                  <button type="button" class="btn btn-outline-danger">移除</button>
                </div>
                <button class="btn btn-outline-primary btn-sm d-block w-100">新增圖片</button>
              </div>
            </div>

            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="tempProduct.title"
                  placeholder="請輸入標題"
                >
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    type="text"
                    class="form-control"
                    id="category"
                    v-model="tempProduct.category"
                    placeholder="請輸入分類"
                  >
                </div>
                <div class="mb-3 col-md-6">
                  <label for="unit" class="form-label">單位</label>
                  <input
                    type="text"
                    class="form-control"
                    id="unit"
                    v-model="tempProduct.unit"
                    placeholder="請輸入單位"
                  >
                </div>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    type="number"
                    class="form-control"
                    id="origin_price"
                    v-model.number="tempProduct.origin_price"
                    placeholder="請輸入原價"
                  >
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    type="number"
                    class="form-control"
                    id="price"
                    v-model.number="tempProduct.price"
                    placeholder="請輸入售價"
                  >
                </div>
              </div>

              <hr>

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  class="form-control"
                  id="description"
                  v-model="tempProduct.description"
                  placeholder="請輸入產品描述"
                ></textarea>
              </div>

              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  class="form-control"
                  id="content"
                  v-model="tempProduct.content"
                  placeholder="請輸入產品說明內容"
                ></textarea>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="is_enabled"
                    v-model="tempProduct.is_enabled"
                    :true-value="1"
                    :false-value="0"
                  >
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >取消</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('update-product', tempProduct)"
          >確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'

export default {
  props: {
    product: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  watch: {
    product: {
      handler(newVal) {
        this.tempProduct = { ...newVal }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      modal: {},
      tempProduct: {},
    }
  },
  methods: {
    showModal() {
      this.modal.show()
    },
    hideModal() {
      this.modal.hide()
    },
    uploadFile() {
      const uploadedFile = this.$refs.fileInput.files[0]
      if (!uploadedFile) {
        alert('請選擇圖片')
        return
      }

      const maxSizeMB = 1 // 限制1MB
      if (uploadedFile.size / 1024 / 1024 > maxSizeMB) {
        alert(`圖片容量不能超過 ${maxSizeMB} MB`)
        return
      }

      const formData = new FormData()
      formData.append('file-to-upload', uploadedFile)

      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/upload`

      this.$http.post(api, formData)
        .then((res) => {
          if (res.data.success) {
            this.tempProduct.imageUrl = res.data.imageUrl
            alert('圖片上傳成功！')
          } else {
            alert('圖片上傳失敗：' + res.data.message)
          }
        })
        .catch((err) => {
          console.error('圖片上傳錯誤：', err)
          alert('圖片上傳失敗，請確認網路與 API 設定')
        })
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal)
  },
}
</script>
