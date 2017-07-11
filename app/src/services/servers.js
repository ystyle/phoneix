/**
 * Created by Administrator on 2017/7/5.
 */
import request from "../utils/request";

export function fetch(token) {
  return request(`/api/servers`,{
    headers:{
      "token":token
    }
  });
}

export function remove(id,token) {
  return request(`/api/servers/${id}`,{
    method: 'DELETE',
    headers:{
      "token":token
    }
  });
}

export function modify(id, row,token) {
  return request(`/api/servers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(row),
    headers: {
      "token": token
    }
  });
}

export function create(row,token) {
  return request(`/api/servers`, {
    method: 'POST',
    body: JSON.stringify(row),
    headers: {
      "token": token
    }
  });
}
