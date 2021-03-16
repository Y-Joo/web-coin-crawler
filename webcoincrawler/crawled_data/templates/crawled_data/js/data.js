let DATA = {
  // todolist 목록
};

Date.prototype.format = function () {  // 현재 날짜 보기좋게 출력 / 사용방법: newDate().format() 으로 사용가능
  var yyyy = this.getFullYear();
  var month = (this.getMonth() + 1);
  var dd = this.getDate();
  var format = [yyyy, month, dd].join('-');
  return format;
}

Date.prototype.format2 = function () {  // 현재 날짜 보기좋게 출력 / 사용방법: newDate().format() 으로 사용가능
  var yyyy = this.getFullYear();
  var month = (this.getMonth() + 1);
  var format = [yyyy, month].join('-');
  return format;
}