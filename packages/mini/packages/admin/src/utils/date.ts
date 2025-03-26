// Parse the time to string --解析UTC的时间/日期为本地时间
export const parseFromUtcDateTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!time) {
      return null;
    }
    const tz = AppModule.timeZone;
    if (tz) {
      let timeZone = JSON.parse(tz);
      // 特殊处理utc 时间
      return moment(time)
        .add(timeZone.timeZoneHour, 'h')
        .add(timeZone.timeZoneMinute, 'm')
        .format(format);
    }
    return moment(time).format(format);
  };
  
  // Parse the time to utc-将时间解析为UTC时间
  export const parseToUtcDateTime = (
    time,
    format = 'YYYY-MM-DD HH:mm:ss'
  ) => {
    if (!time) {
      return null;
    }
  
    const tz = AppModule.timeZone;
  
    if (tz) {
      let timeZone = JSON.parse(tz);
      const hour = timeZone.timeZoneHour * -1;
      const minute = timeZone.timeZoneMinute * -1;
      return moment(time).add(hour, 'h').add(minute, 'm').format(format);
    }
    return null;
  };
  
  //Parse the time to utc-将时间解析为UTC时间，精确到日
  export const parseToUtcDate = (
    time,
    format = 'YYYY-MM-DD'
  ) => parseToUtcDateTime(time, format);
  
  
  /**
   * 查询条件起始日期
   * @param time
   * @param format
   * @returns
   */
  //处理开始时间/日期至utc时间给到后端
  export const parseToUtcStartQueryDateTime = (
    time,
    format = 'YYYY-MM-DD HH:mm:ss'
  ) => {
    if (!time) {
      return null;
    }
  
    let tz = AppModule.timeZone;
    if (tz) {
      let timeZone = JSON.parse(tz);
      let hour = timeZone.timeZoneHour * -1;
      let minute = timeZone.timeZoneMinute * -1;
      return moment(time).add(hour, 'h').add(minute, 'm').format(format);
    }
    return moment(time).format(format);
  };
  /**
   * 查询条件结束日期
   * @param time
   * @param format
   * @returns
   */
  //处理结束时间/日期至utc时间给到后端
  export const parseToUtcEndQueryDateTime = (
    time,
    format = 'YYYY-MM-DD HH:mm:ss'
  ) => {
    if (!time) {
      return null;
    }
    const tz = AppModule.timeZone;
    if (tz) {
      let timeZone = JSON.parse(tz);
      const hour = timeZone.timeZoneHour * -1;
      const minute = timeZone.timeZoneMinute * -1;
      return moment(time)
        .add(1, 'd')
        .add(-1, 's')
        .add(hour, 'h')
        .add(minute, 'm')
        .format(format);
    }
    return moment(time).add(1, 'd').add(-1, 's').format(format);

}