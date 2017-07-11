import React from 'react';
import { connect } from 'dva';
import Title, { flushTitle } from 'react-title-component'
import styles from './Login.css';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type: 'user/login',
          payload: values,
        })
      }
    });
  }
  render() {
    const userName = this.props.login
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Title render="登陆系统"/>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            initialValue:userName,
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" size='large' htmlType="submit" className={styles.loginFormButton}>
            登陆
          </Button>
        </FormItem>
      </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const login = state.login;
  return {login}
}

export default connect(mapStateToProps)(Form.create()(NormalLoginForm));
