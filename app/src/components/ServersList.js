/**
 * Created by Administrator on 2017/7/4.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';

const ServersList = ({ onDelete, servers }) => {
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
  }, {
    title: 'Actions',
    render: (text, record) => {
      return (
        <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
          <Button>Delete</Button>
        </Popconfirm>
      );
    },
  }];
  return (
    <Table
      dataSource={servers}
      columns={columns}
    />
  );
};

ServersList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  servers: PropTypes.array.isRequired,
};

export default ServersList;
