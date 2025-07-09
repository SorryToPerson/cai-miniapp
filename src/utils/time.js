/**
 * 计算两个时间点的间隔，返回格式为*h*m*s
 * @param {string} start - 开始时间，格式为HH:mm:ss
 * @param {string} end - 结束时间，格式为HH:mm:ss
 * @returns {string} 间隔字符串
 */
import dayjs from "dayjs";

export function getTimeDiffStr(start, end) {
  let diffSeconds = dayjs(end, "HH:mm:ss").diff(
    dayjs(start, "HH:mm:ss"),
    "second"
  );
  if (diffSeconds < 0) diffSeconds += 24 * 60 * 60;

  if (diffSeconds < 60) {
    return `${diffSeconds}秒`;
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;
    return seconds === 0 ? `${minutes}分` : `${minutes}分${seconds}秒`;
  } else {
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    return minutes === 0 ? `${hours}时` : `${hours}时${minutes}分`;
  }
}
