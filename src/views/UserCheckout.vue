<template>
  <div class="my-5 row justify-content-center">
    <form class="col-md-6" @submit.prevent="payOrder">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.products" :key="item.id">
            <td>{{ item.product.title }}</td>
            <td>{{ item.qty }}/{{ item.product.unit }}</td>
            <td class="text-end">{{ item.product.price }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="text-end">總計</td>
            <td class="text-end">{{ order.total }}</td>
          </tr>
        </tfoot>
      </table>

      <table class="table">
        <tbody>
          <tr>
            <th width="100">Email</th>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span>{{ order.is_paid ? '已付款完成' : '尚未付款' }}</span>
              <!-- 如果要動態顯示可用 v-if / v-else -->
              <!-- <span v-if="paid" class="text-success">付款完成</span> -->
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-end">
        <button
          type="submit"
          class="btn btn-danger"
          v-if="order && !order.is_paid"
        >
          確認付款去
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        products: [], // 確保初始為陣列
        user: {},
      },
    };
  },
  methods: {
    getOrder() {
      const id = this.$route.params.orderId;
      console.log(id);
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order/${id}`;
      this.$http
        .get(url)
        .then((res) => {
          this.order = res.data.order;
        })
        .catch((err) => {
          console.error('載入商品失敗：', err);
        });
    },
    payOrder() {
      const id = this.$route.params.orderId;
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/pay/${id}`;
      this.$http
        .post(url)
        .then((res) => {
          this.getOrder();
          alert(res.data.message);
        })
        .catch((err) => {
          console.error('付款失敗：', err);
        });
    },
  },
  created() {
    this.getOrder();
  },
};
</script>
