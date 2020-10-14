const getTimeStamp = () => {

  var d = new Date(),
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    day = days[d.getDay()],
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    month = months[d.getMonth()],
    suf = ['th', 'st', 'nd', 'rd'],
    v = date % 100,
    date = d.getDate() + (suf[(v - 20) % 10] || suf[v] || suf[0]),
    hours = d.getHours(),
    minutes = d.getMinutes(),
    noon = '';
  // Display hours in 12-hour format, and set am/pm
  if (hours == 12) {
    noon = 'pm';
  } else if (hours > 12) {
    hours = hours - 12;
    noon = 'pm';
  } else {
    noon = 'am';
  }
  // Add '0' to minutes if less than 10
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  // Output the Timestamp
  var timestamp = day + ' ' + month + ' ' + date + ', ' + hours + ':' + minutes + ' ' + noon;

  //  ---- Time stamp setting ----
  const optionsForTime = {
    timeZone: "Asia/Taipei",
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  var formatter = new Intl.DateTimeFormat('zh-tw', optionsForTime); //  https://www.science.co.il/language/Locale-codes.php
  var localTime = formatter.format(new Date());

  return localTime;
};

exports.getTimeStamp = getTimeStamp;