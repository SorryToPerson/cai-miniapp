import { View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import "./index.less";

function TimeShow() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour12: false })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour12: false }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View className="time-show">
      <View className="time">{time}</View>
    </View>
  );
}

export default TimeShow;
