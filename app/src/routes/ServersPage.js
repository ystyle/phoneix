/**
 * Created by Administrator on 2017/7/4.
 */
import React from 'react';
import { connect } from 'dva';
import ServersList from '../components/ServersList';

const Servers = ({ dispatch, servers }) => {
  function handleDelete(id) {
    dispatch({
      type: 'servers/delete',
      payload: id,
    });
  }
  return (
    <div>
      <h2>List of Servers</h2>
      <ServersList onDelete={handleDelete} servers={servers} />
    </div>
  );
};

// export default Products;
export default connect(({ servers }) => ({
  servers,
}))(Servers);
