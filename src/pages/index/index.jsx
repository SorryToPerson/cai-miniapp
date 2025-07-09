import { useEffect, useState } from "react";
import { Image, View } from "@tarojs/components";
import {
  Cell,
  ConfigProvider,
  Button,
  Switch,
  Popup,
  SafeArea,
  Tag,
  Radio,
  Empty,
} from "@nutui/nutui-react-taro";
import {
  Plus,
  MaskClose,
  ArrowLeftSmall,
  ArrowRightSmall,
} from "@nutui/icons-react-taro";
import Taro from "@tarojs/taro";
import TimeShow from "../../components/TimeShow";
import DatePicker from "../../components/DatePicker";
import ChooseMl from "../../components/ChooseMl";
import { typeList, mlList, mlMap } from "./const";
import { getTimeDiffStr } from "../../utils/time";
import dayjs from "dayjs";
import nullImage from "./null.svg";
import "./index.less";

function Index() {
  const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
  const [curDay, setCurDay] = useState(dayjs().format("YYYY/MM/DD"));
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(["母乳", "50ml"]);
  const [list, setList] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [type, setType] = useState("母乳");
  const [ml, setMl] = useState(60);
  const [d3, setD3] = useState(false);
  const [time, setTime] = useState();

  const show = () => {
    Taro.vibrateShort({
      type: "medium",
    });
    setVisible(true);
    setStartTime(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  };

  const add = () => {
    Taro.vibrateShort({
      type: "medium",
    });
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const newList = [
      {
        type: type,
        ml: ml + "ml",
        startTime: startTime,
        d3: d3,
        endTime: time,
        interval: getTimeDiffStr(startTime, time),
      },
      ...list,
    ];

    const timeInterval = getTimeDiffStr(
      startTime,
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    );
    setTime(timeInterval);
    setD3(false);
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

  useEffect(() => {
    const timer = setInterval(() => {
      if (list[0]) {
        const timeInterval = getTimeDiffStr(
          list[0].startTime,
          dayjs().format("YYYY-MM-DD HH:mm:ss")
        );
        setTime(timeInterval);
      } else {
        setTime("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [list]);

  return (
    <ConfigProvider
      theme={{
        nutuiColorPrimaryIcon: "#4d6def",
        nutuiColorPrimaryStop1: "#4d6def",
        nutuiColorPrimaryStop2: "#4d6def",
        nutuiSwitchActiveBackgroundColor: "#4d6def",
        nutuiSwitchHeight: "20px",
        nutuiTagFontSize: "12px",
      }}
    >
      <SafeArea position="top" />
      <View
        className="page-container"
        style={{
          paddingTop: `${menuButtonInfo.top}px`,
        }}
      >
        <View
          className="header"
          style={{
            height: menuButtonInfo.height,
            lineHeight: menuButtonInfo.height + "px",
          }}
        >
          <ArrowLeftSmall
            onClick={() => {
              setCurDay(dayjs(curDay).subtract(1, "day").format("YYYY/MM/DD"));
            }}
          />
          {curDay}
          <ArrowRightSmall
            onClick={() => {
              setCurDay(dayjs(curDay).add(1, "day").format("YYYY/MM/DD"));
            }}
          />
        </View>

        <View className="status">
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
          <View>D3：{list.filter((item) => item.d3)?.length}</View>
        </View>

        {time && <View className="time-interval">距离最近一次：{time}</View>}

        {list.length ? (
          <View className="list-container">
            {list.map((item, i) => (
              <Cell key={i} className="list-item">
                <View className="item-top">
                  <View className="item-time">
                    {dayjs(item.endTime).format("HH:mm:ss")}
                  </View>
                  <View className="item-ml">
                    {list[i + 1]?.startTime && (
                      <Tag background="#4d6def" color="#fff">
                        {getTimeDiffStr(list[i + 1].startTime, item.startTime)}
                      </Tag>
                    )}
                  </View>
                  <View className="item-action">
                    <Tag type="primary">{item.ml}</Tag>
                    <Tag
                      mark
                      plain
                      background={item.type === "母乳" ? "#51c14b" : "orange"}
                    >
                      {item.type}
                    </Tag>
                    <MaskClose color="gray" onClick={() => remove(i)} />
                  </View>
                </View>
                <View className="time-bottom">
                  <View className="left">
                    <View>{dayjs(item.startTime).format("HH:mm:ss")}</View>
                    <View>-</View>
                    <View>{dayjs(item.endTime).format("HH:mm:ss")}</View>
                  </View>

                  <View className="flex-1">
                    {item.d3 && <Tag background="#cc13ff">D3</Tag>}
                  </View>

                  <Tag className="flex-1" type="warning">
                    间隔：{item.interval}
                  </Tag>
                </View>
              </Cell>
            ))}
          </View>
        ) : (
          <View className="empty">
            <Image
              style={{
                width: "80px",
                height: "80px",
              }}
              src={nullImage}
            ></Image>
            <View>今天还没有记录哦</View>
          </View>
        )}

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
            <Switch
              activeText="D3"
              checked={d3}
              onChange={(val) => setD3(val)}
            />
            <Radio.Group
              direction="horizontal"
              value={type}
              shape="button"
              onChange={(value) => setType(value)}
              options={typeList.map((item) => ({ label: item, value: item }))}
            />
            <ChooseMl value={ml} onChange={(value) => setMl(value)} />

            {/* <Cell
              style={{
                padding: "40px 18px",
              }}
            >
              <Range
                min={30}
                max={240}
                step={10}
                value={ml}
                onChange={(value) => setMl(value)}
              />
            </Cell> */}

            {/* <PickerView
              value={value}
              options={[
                typeList.map((item) => ({ label: item, value: item })),
                mlList.map((item) => ({ label: item, value: item })),
              ]}
              onChange={({ value }) => {
                setValue(value);
              }}
            /> */}

            <Button block type="primary" onClick={add} size="large">
              确认
            </Button>
            <SafeArea position="bottom" />
          </View>
        </Popup>

        <SafeArea position="bottom" />
      </View>
    </ConfigProvider>
  );
}

export default Index;
