export default function formatDateTime(dateTime: Date) {
  let year = dateTime.getFullYear() + "";
  let month = dateTime.getMonth() + 1 + "";
  let date = dateTime.getDate() + "";
  let hour = dateTime.getHours() + "";
  let minutes = dateTime.getMinutes() + "";
  month.length === 1 && (month = "0" + month);
  date.length === 1 && (date = "0" + date);
  hour.length === 1 && (hour = "0" + hour);
  minutes.length === 1 && (minutes = "0" + minutes);
  return year + "-" + month + "-" + date + " " + hour + ":" + minutes;
}
