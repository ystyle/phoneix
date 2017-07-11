/**
 * Created by Administrator on 2017/7/11.
 */
import request from "../utils/request";

export function fetch(token) {
  return request(`/api/webhooks`, {
    headers: {
      "token": token
    }
  });
}


export function remove(id, token) {
  return request(`/api/webhooks/${id}`, {
    method: 'DELETE',
    headers: {
      "token": token
    }
  });
}

export function modify(id, row, token) {
  return request(`/api/webhooks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(row),
    headers: {
      "token": token
    }
  });
}

export function create(row, token) {
  return request(`/api/webhooks`, {
    method: 'POST',
    body: JSON.stringify(row),
    headers: {
      "token": token
    }
  });
}
