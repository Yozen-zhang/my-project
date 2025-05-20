// 千分號
export function currency(num) {
  const n = parseInt(num, 10);
  return n.toLocaleString();
}
// 日期轉化
export function date(time) {
  const localDate = new Date(time * 1000);
  return localDate.toLocaleDateString();
}
