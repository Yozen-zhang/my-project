<template>
  <nav aria-label="Page navigation example" class="my-3">
    <ul class="pagination justify-content-center align-items-center flex-wrap">
      <!-- 第一頁 -->
      <li class="page-item" :class="{ disabled: pages.current_page === 1 }">
        <a class="page-link" href="#" @click.prevent="changePage(1)">第一頁</a>
      </li>

      <!-- 上一頁 -->
      <li class="page-item" :class="{ disabled: pages.current_page === 1 }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="changePage(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <!-- 頁碼列表 -->
      <li
        class="page-item"
        v-for="page in pages.total_pages"
        :key="page"
        :class="{ active: page === pages.current_page }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(page)">
          {{ page }}
        </a>
      </li>

      <!-- 下一頁 -->
      <li
        class="page-item"
        :class="{ disabled: pages.current_page === pages.total_pages }"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="changePage(pages.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

      <!-- 最後一頁 -->
      <li
        class="page-item"
        :class="{ disabled: pages.current_page === pages.total_pages }"
      >
        <a
          class="page-link"
          href="#"
          @click.prevent="changePage(pages.total_pages)"
          >最後一頁</a
        >
      </li>

      <!-- 跳轉輸入框 -->
      <li class="page-item ms-3 d-flex align-items-center">
        <span class="me-2">跳轉到</span>
        <input
          type="number"
          class="form-control"
          style="width: 80px"
          min="1"
          :max="pages.total_pages"
          v-model.number="inputPage"
          @keyup.enter="jumpToPage"
        />
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ['pages'],
  data() {
    return {
      inputPage: null, // 跳轉輸入值
    };
  },
  watch: {
    // 當分頁變動，清空輸入框
    'pages.current_page'() {
      this.inputPage = null;
    },
  },
  methods: {
    updatePage(page) {
      this.$emit('emit-pages', page);
    },
    changePage(page) {
      if (
        page >= 1 &&
        page <= this.pages.total_pages &&
        page !== this.pages.current_page
      ) {
        this.updatePage(page);
      }
    },
    jumpToPage() {
      if (this.inputPage >= 1 && this.inputPage <= this.pages.total_pages) {
        this.updatePage(this.inputPage);
      }
    },
  },
};
</script>
