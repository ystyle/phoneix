import React from 'react';
import { connect } from 'dva';
import WebHooksList from '../components/WebHooksList';
import Title, { flushTitle } from 'react-title-component'

const WebHooks = () => {
  return (
    <div>
      <h2>WebHooks列表</h2>
      <Title render="WebHooks列表"/>
      <WebHooksList />
    </div>
  );
};

export default connect()(WebHooks);
