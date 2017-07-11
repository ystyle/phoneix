/**
 * Created by Administrator on 2017/7/4.
 */
import React from "react";
import { connect } from 'dva';
import {Popconfirm, Table, Button} from "antd";
import styles from './ServersList.css'
import ServersModal from './ServersModal'


function Servers({dispatch,list: dataSource, loading}) {
  function deleteHandler(id) {
    dispatch({
      type: 'servers/remove',
      payload: id,
    });
  }

  function modifyHandler(id,row) {
    dispatch({
      type: 'servers/modify',
      payload: { id, row },
    });
  }

  function createHandler(values) {
    dispatch({
      type: 'servers/create',
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
      title: "Url",
      dataIndex: 'url',
      key: 'url'
    },
    {
      title: "用户名",
      dataIndex: 'user',
      key: 'user'
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
          <ServersModal row={row} onOk={modifyHandler.bind(null,row.id)}>
             <a>编辑</a>
          </ServersModal>
           <Popconfirm title="确定要删除吗?" onConfirm={deleteHandler.bind(null, row.id)}>
            <a href="#">删除</a>
           </Popconfirm>
         </span>
      )
    }
  ]

  return (
  <div>
    <ServersModal row={{}} onOk={createHandler}>
      <Button type="primary">新建服务器</Button>
    </ServersModal>
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
  const {list} = state.servers
  return {list,loading: state.loading.models.users,}
}

export default connect(mapStateToProps)(Servers);
