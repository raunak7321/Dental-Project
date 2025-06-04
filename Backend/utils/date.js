// utils/dateUtils.js

exports.getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
  
    const end = new Date();
    end.setHours(23, 59, 59, 999);
  
    return { start, end };
  };
  
  exports.getSevenDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  };

  exports.getLastMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  };
  
  exports.getThreeMonthsAgo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  };
  