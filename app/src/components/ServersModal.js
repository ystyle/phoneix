import React, {Component} from "react";
import {Form, Modal, Input} from "antd";
const FormItem = Form.Item

class ServersEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true
    })
  }

  hideModelHandler = () => {
    this.setState({
      visible: false
    })
  }

  okHandle = () => {
    const {onOk} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    })
  }

  render() {
    const {children} = this.props;
    const {getFieldDecorator } = this.props.form;
    const {name, url, user, passwd, remarks} = this.props.row;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    }

    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title="编辑服务器"
          visible={this.state.visible}
          onOk={this.okHandle}
          onCancel={this.hideModelHandler}
        >
          <Form layout="horizontal" onSubmit={this.okHandle}>
            <FormItem {...formItemLayout} label="名称">
              {
                getFieldDecorator('name',{
                  initialValue:name,
                  rules: [{
                    required: true,
                    message: '必填',
                  }],
                })(<Input placeholder="server name"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="Url">
              {
                getFieldDecorator('url',{
                  initialValue:url,
                  rules: [{
                    required: true,
                    message: '必填',
                  }],
                })(<Input placeholder="jenkins url"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="用户名">
              {
                getFieldDecorator('user',{
                  initialValue:user
                })(<Input placeholder="jenkins login name"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {
                getFieldDecorator('passwd',{
                  initialValue:passwd
                })(<Input type="password" placeholder="jenkins login password"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {
                getFieldDecorator('remarks',{
                  initialValue:remarks
                })(<Input placeholder="input a remarks"/>)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    )
  }

}

export default Form.create()(ServersEditModal);
