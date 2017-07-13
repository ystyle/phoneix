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
                })(<Input placeholder="WebHooks name"/>)
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
                  placeholder="Select a Server"
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
                })(<Input placeholder="Jenkins project name"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="Jenkins token">
              {
                getFieldDecorator('jenkinsToken',{
                  initialValue:jenkinsToken
                })(<Input type="password" placeholder="Jenkins project token"/>)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="git 项目" extra="不为空时则在触发WebHooks时校验项目名，不一致时不触发Jenkins build。">
              {
                getFieldDecorator('gitProject',{
                  initialValue:gitProject
                })(<Input placeholder="input git project name" />)
              }
            </FormItem>
            <FormItem {...formItemLayout} label="git 分支" extra="不为空时则在触发WebHooks时校验git分支，不一致时不触发Jenkins build。">
              {
                getFieldDecorator('gitBranch',{
                  initialValue:gitBranch
                })(<Input placeholder="git branch"/>)
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


function mapStateToProps(state) {
  const {list} = state.servers;
  return {servers:list}
}

export default connect(mapStateToProps)(Form.create()(WebHooksEditModal));
