import React from 'react';
import { connect } from 'dva';
import WebHooksList from '../components/WebHooksList';

const WebHooks = () => {
  return (
    <div>
      <h2>服务器列表</h2>
      <WebHooksList />
    </div>
  );
};

export default connect()(WebHooks);
