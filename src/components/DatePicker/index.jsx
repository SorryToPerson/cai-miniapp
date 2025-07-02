import React, { useState } from "react";
import { Calendar } from "@nutui/nutui-react-taro";
import { Feedback } from "@nutui/icons-react-taro";
import { View } from "@tarojs/components";

const DatePicker = (props) => {
  const { value, onChange } = props;
  const [isVisible, setIsVisible] = useState(false);

  const openSwitch = () => {
    setIsVisible(true);
  };

  const closeSwitch = () => {
    setIsVisible(false);
  };

  const setChooseValue = (param) => {
    onChange(param[3]);
  };

  return (
    <>
      <View
        onClick={openSwitch}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <Feedback size={20} color="blue" />
        选择日期
      </View>
      <Calendar
        visible={isVisible}
        defaultValue={value}
        startDate="2025/06/15"
        endDate={null}
        onClose={closeSwitch}
        onConfirm={setChooseValue}
        showToday
      />
    </>
  );
};
export default DatePicker;
