/**
 * Created by Administrator on 2017/7/5.
 */
import request from "../utils/request";
import {TOKEN} from "../constants";

export function fetch() {
  return request(`/api/servers`,{
    headers:{
      "token":TOKEN
    }
  });
}

export function remove(id) {
  return request(`/api/servers/${id}`,{
    method: 'DELETE',
    headers:{
      "token":TOKEN
    }
  });
}

export function modify(id, row) {
  return request(`/api/servers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(row),
    headers: {
      "token": TOKEN
    }
  });
}

export function create(row) {
  return request(`/api/servers`, {
    method: 'POST',
    body: JSON.stringify(row),
    headers: {
      "token": TOKEN
    }
  });
}
