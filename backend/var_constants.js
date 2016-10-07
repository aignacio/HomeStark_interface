var clock_second = 1000,
    clock_minute = 1000*60,
    clock_hour   = 1000*60*60;
var exports = module.exports = {
  /**************************  Timers related to snmp_scan.js ***************************************************/
  'timeReqGet':clock_second/2,
  'timeCheckList': 30*clock_second,
  'timeResendGet': 15*clock_second
};
