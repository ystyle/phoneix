/**
 * Created by Administrator on 2017/7/11.
 */
import request from "../utils/request";
import {TOKEN} from "../constants";

export function fetch() {
  return request(`/api/webhooks`,{
    headers:{
      "token":TOKEN
    }
  });
}


export function remove(id) {
  return request(`/api/webhooks/${id}`,{
    method: 'DELETE',
    headers:{
      "token":TOKEN
    }
  });
}

export function modify(id, row) {
  return request(`/api/webhooks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(row),
    headers: {
      "token": TOKEN
    }
  });
}

export function create(row) {
  return request(`/api/webhooks`, {
    method: 'POST',
    body: JSON.stringify(row),
    headers: {
      "token": TOKEN
    }
  });
}
