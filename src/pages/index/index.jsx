import { useEffect, useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import {
  Cell,
  ConfigProvider,
  Button,
  PickerView,
  Popup,
  SafeArea,
  Tag,
} from "@nutui/nutui-react-taro";
import { Plus, MaskClose, PlayCircleFill } from "@nutui/icons-react-taro";
import Taro from "@tarojs/taro";
import TimeShow from "../../components/TimeShow";
import DatePicker from "../../components/DatePicker";
import { typeList, mlList } from "./const";
import { getTimeDiffStr } from "../../utils/time";
import dayjs from "dayjs";
import "./index.less";

function Index() {
  const windowInfo = Taro.getWindowInfo();
  const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
  const [curDay, setCurDay] = useState(dayjs().format("YYYY/MM/DD"));
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(["母乳", "50ml"]);
  const [list, setList] = useState([]);
  const [startTime, setStartTime] = useState("");

  const show = () => {
    setVisible(true);
    setStartTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  };

  const add = () => {
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const newList = [
      {
        type: value[0],
        ml: value[1],
        startTime: startTime,
        endTime: time,
        interval: getTimeDiffStr(startTime, time),
      },
      ...list,
    ];
    setList(newList);
    Taro.setStorageSync(curDay, newList);
    setVisible(false);
  };

  const remove = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
    Taro.setStorageSync(curDay, newList);
  };

  useEffect(() => {
    if (curDay) {
      const list = Taro.getStorageSync(curDay) || [];
      setList(list);
    }
  }, [curDay]);

  return (
    <ConfigProvider
      theme={{
        nutuiColorPrimaryIcon: "#4d6def",
        nutuiColorPrimaryStop1: "#4d6def",
        nutuiColorPrimaryStop2: "#4d6def",
      }}
    >
      <View
        className="container"
        style={{
          paddingTop: menuButtonInfo.top,
          paddingBottom: windowInfo.safeArea.bottom,
          height: windowInfo.windowHeight,
        }}
      >
        <View
          style={{
            height: menuButtonInfo.height,
            lineHeight: menuButtonInfo.height + "px",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {curDay}
        </View>

        <View
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <DatePicker
            value={curDay}
            onChange={(value) => {
              setCurDay(value);
            }}
          />
          <View>
            母乳：{list.filter((item) => item.type === "母乳")?.length}
          </View>
          <View>
            奶粉：{list.filter((item) => item.type === "奶粉")?.length}
          </View>
          <View>总计：{list?.length}</View>
        </View>

        <ScrollView
          className="list"
          scrollWithAnimation
          style={{
            marginTop: 10,
            scrollbarWidth: "none",
            height:
              windowInfo.safeArea.height -
              menuButtonInfo.height -
              windowInfo.safeArea.top,
          }}
          scrollY
        >
          {list.map((item, i) => (
            <Cell key={i} className="list-item">
              <View className="item-time">
                <View>{dayjs(item.startTime).format("HH:mm:ss")}</View>
                <View>~</View>
                <View>{dayjs(item.endTime).format("HH:mm:ss")}</View>
              </View>
              <View className="item-ml">
                <Tag type="warning">间隔:{item.interval}min</Tag>
                {list[i + 1]?.startTime && (
                  <Tag background="#4d6def" color="#fff" size="small">
                    距离上一次:
                    {getTimeDiffStr(list[i + 1].startTime, item.startTime)}
                  </Tag>
                )}
              </View>
              <View className="item-action">
                <Tag type="primary">{item.ml}</Tag>
                <Tag background={item.type === "母乳" ? "#51c14b" : "orange"}>
                  {item.type}
                </Tag>
                <MaskClose color="gray" onClick={() => remove(i)} />
              </View>
            </Cell>
          ))}
        </ScrollView>

        <View className="add" onClick={show}>
          <Plus size={40} />
        </View>

        <Popup
          position="bottom"
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
        >
          <View className="popup">
            <TimeShow startTime={startTime} />
            <PickerView
              value={value}
              options={[
                typeList.map((item) => ({ label: item, value: item })),
                mlList.map((item) => ({ label: item, value: item })),
              ]}
              onChange={({ value }) => {
                setValue(value);
              }}
            />

            <Button block type="primary" onClick={add}>
              提交
            </Button>
            <SafeArea position="bottom" />
          </View>
        </Popup>
      </View>
    </ConfigProvider>
  );
}

export default Index;
