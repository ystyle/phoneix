import React from "react";
import {connect} from "dva";
import styles from "./IndexPage.css";
import {Icon, Layout, Menu} from "antd";
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
import { Router, Route, Link } from 'react-router'
import Welcome from '../components/Welcome';


class IndexPage extends React.Component {
  logout = (e) => {
    localStorage.setItem("token","");
    location.reload()
  }

  render() {
    const {name} = this.props.config;
    return <Layout className={styles.layoutheight}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(collapsed, type) => {
        }}
      >
        <div className={styles.logo}>
          {name||'WebHooks管理系统'}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1">
            <Link to="/servers">
              <Icon type="cloud"/>
              <span className="nav-text">服务器</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/webhooks">
              <Icon type="check-circle"/>
              <span className="nav-text">WebHooks</span>
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={<span><Icon type="setting"/><span className="nav-text">设置</span></span>}
          >
            <Menu.Item key="5">
              <Link to="/changepwd">
              <Icon type="user"/>
                <span className="nav-text">修改密码</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/siteconfig">
                <Icon type="bars"/>
                <span className="nav-text">网站设置</span>
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <div className={styles.logout}><a onClick={this.logout}>注销</a></div>
        <Content style={{margin: '24px 16px 0'}}>
          <div style={{padding: 24, background: '#fff', minHeight: 360}}>
            {this.props.children || (<Welcome/>)}
          </div>
        </Content>
        <Footer style={{textAlign: 'center'}}>
          Phoneix ©2016 Created by YSTYLE
        </Footer>
      </Layout>
    </Layout>
  }
}

IndexPage.propTypes = {};

function mapStateToProps(props) {
  const config = props.config;
  return {config};
}


export default connect(mapStateToProps)(IndexPage);
