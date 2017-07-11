import React from "react";
import { connect } from 'dva';
import {Popconfirm, Table, Button} from "antd";
import styles from './WebHooksList.css'
import WebHooksModal from './WebHooksModal'


function Webhooks({dispatch,list: dataSource, loading}) {
  function deleteHandler(id) {
    dispatch({
      type: 'webhooks/remove',
      payload: id,
    });
  }

  function modifyHandler(id,row) {
    dispatch({
      type: 'webhooks/modify',
      payload: { id, row },
    });
  }

  function createHandler(values) {
    dispatch({
      type: 'webhooks/create',
      payload: values,
    });
  }

  const columns = [
    {
      title: "名称",
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: "Jenkins服务器",
      dataIndex: 'jenkinsName',
      key: 'jenkinsName'
    },
    {
      title: "jenkins项目",
      dataIndex: 'jenkinsProject',
      key: 'jenkinsProject'
    },
    {
      title: "jenkins Token",
      dataIndex: 'jenkinsToken',
      key: 'jenkinsToken'
    },
    {
      title: "git 项目",
      dataIndex: 'gitProject',
      key: 'gitProject'
    },
    {
      title: "git 分支",
      dataIndex: 'gitBranch',
      key: 'gitBranch'
    },
    {
      title: "备注",
      dataIndex: 'remarks',
      key: 'remarks'
    },
    {
      title: "更新日期",
      dataIndex: 'updateDate',
      key: 'updateDate'
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, row) => (
        <span className={styles.operation}>
          <WebHooksModal row={row} onOk={modifyHandler.bind(null,row.id)}>
             <a>编辑</a>
          </WebHooksModal>
           <Popconfirm title="确定要删除吗?" onConfirm={deleteHandler.bind(null, row.id)}>
            <a href="#">删除</a>
           </Popconfirm>
         </span>
      )
    }
  ]

  return (
    <div>
      <WebHooksModal row={{}} onOk={createHandler}>
        <Button type="primary">新建WrbHooks</Button>
      </WebHooksModal>
      <Table
        dataSource={dataSource}
        bordered
        rowKey={record => record.id}
        columns={columns}
      />
    </div>
  )
}

function mapStateToProps(state) {
  let {list} = state.webhooks;
  const servers = state.servers.list;
  list = _.map(list,(row) => _.assign(row,{jenkinsName:_.find(servers,{id:row.jenkinsId}).name}));
  return {list,loading: state.loading.models.webhooks}
}

export default connect(mapStateToProps)(Webhooks);
