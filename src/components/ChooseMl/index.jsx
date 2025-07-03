import { View } from "@tarojs/components";
import { mlList } from "../../pages/index/const";
import "./index.less";

function ChooseMl(props) {
  const { value, onChange } = props;

  return (
    <View className="choose-ml">
      {mlList.map((item, i) => {
        return (
          <View
            key={i}
            className={`item-ml ${item === value ? "active" : ""}`}
            onClick={() => onChange(item)}
          >
            {item}ml
          </View>
        );
      })}
    </View>
  );
}

export default ChooseMl;
