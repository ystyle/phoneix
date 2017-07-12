/**
 * Created by Administrator on 2017/7/12.
 */
import {message} from "antd";


export default function show({Status,Message},title){
  if (Status == 1) {
    message.success(`${title}成功！`)
  } else {
    message.error(`${title}失败！` + Message)
  }
}
