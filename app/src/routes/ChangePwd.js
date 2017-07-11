import React from 'react';
import { connect } from 'dva';
import styles from './ChangePwd.css';
import Title, { flushTitle } from 'react-title-component'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;


class ChangePwd extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/changePwd',
          payload: values,
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Title render="登陆系统"/>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('oldPassword', {
              rules: [{ required: true, message: '请输入旧密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入旧密码" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入新密码!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入新密码" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" size='large' htmlType="submit">
              修改密码
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Form.create()(ChangePwd));
