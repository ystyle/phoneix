import React from "react";
import {connect} from "dva";
import Title from "react-title-component";
import {Button, Form, Input} from "antd";
const FormItem = Form.Item;


class modifySite extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const {dispatch} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'config/modify',
          payload: values,
        })
      }
    });
  }

  render() {
    const {name,url} = this.props.config;
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Title render="网站设置"/>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem label='网站名称'>
            {getFieldDecorator('name', {
              initialValue:name,
              rules: [{required: true, message: '请输入网站名称!'}],
            })(
              <Input placeholder="请输入网站名称"/>
            )}
          </FormItem>
          <FormItem label='网站URL' extra="用于生成WebHooks链接">
            {getFieldDecorator('url', {
              initialValue:url,
              rules: [{required: true, message: '请输入网站URL !'}],
            })(
              <Input placeholder="请输入网站URL"/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" size='large' htmlType="submit">
              修改网站信息
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(props) {
  const config = props.config;
  return {config};
}

export default connect(mapStateToProps)(Form.create()(modifySite));
