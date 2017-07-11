import React, {Component} from "react";
import { connect } from 'dva';
import {Form, Modal, Input,Select} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

class WebHooksEditModal extends Component {
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
    const {name, jenkinsId, jenkinsProject, jenkinsToken,gitProject,gitBranch, remarks} = this.props.row;
    const servers = this.props.servers;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14}
    };
    const serversELS = servers.map((v,k) => ( <Option key={k} value={v.id}>{v.name}</Option>))

    return (
      <span>
        <span onClick={this.showModelHandler}>
          {children}
        </span>
        <Modal
          title="编辑WehHooks"
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
                })(<Input/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="jenkins服务器">
              {
                getFieldDecorator('jenkinsId',{
                  initialValue:jenkinsId,
                  rules: [{
                    required: true,
                    message: '必填',
                  }],
                })(<Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  // onChange={handleChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {serversELS}
                </Select>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="jenkins项目">
              {
                getFieldDecorator('jenkinsProject',{
                  initialValue:jenkinsProject,
                  rules: [{
                    required: true,
                    message: '必填',
                  }],
                })(<Input/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="Jenkins token">
              {
                getFieldDecorator('jenkinsToken',{
                  initialValue:jenkinsToken
                })(<Input type="password"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="git 项目">
              {
                getFieldDecorator('gitProject',{
                  initialValue:gitProject
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="git 分支">
              {
                getFieldDecorator('gitBranch',{
                  initialValue:gitBranch
                })(<Input />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {
                getFieldDecorator('remarks',{
                  initialValue:remarks
                })(<Input/>)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    )
  }

}


function mapStateToProps(state) {
  const {list} = state.servers;
  return {servers:list}
}

export default connect(mapStateToProps)(Form.create()(WebHooksEditModal));
