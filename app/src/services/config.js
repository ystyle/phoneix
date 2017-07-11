/**
 * Created by Administrator on 2017/7/11.
 */
import request from "../utils/request";

export function fetch() {
  return request(`/api/config`);
}

export function modify(config,token) {

  return request(`/api/modifySite`,{
    method: 'POST',
    body:JSON.stringify(config),
    headers:{
      "token":token
    }
  });
}
