//  context 扩展
export default {
  $echo(message: string) {
    return `hello, ${message} extend with context`;
  },
  get Instance() {
    return 'Instance attribute extend with context';
  },
};
