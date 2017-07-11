/**
 * Created by Administrator on 2017/7/4.
 */
import React from 'react';
import { connect } from 'dva';
import ServersList from '../components/ServersList';
import Title, { flushTitle } from 'react-title-component'

const Servers = () => {
  return (
    <div>
      <h2>服务器列表</h2>
      <Title render="服务器列表"/>
      <ServersList />
    </div>
  );
};

export default connect()(Servers);
