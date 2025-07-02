import { View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./index.less";

function TimeShow(props) {
  const { startTime } = props;
  const [time, setTime] = useState(dayjs().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View className="time-show">
      {startTime && (
        <>
          <View className="start-time">
            {dayjs(startTime).format("HH:mm:ss")}
          </View>
          -
        </>
      )}
      <View className="time">{time}</View>
    </View>
  );
}

export default TimeShow;
