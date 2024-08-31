// src/App.js
import React from 'react';
import { Layout, theme } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomHeader from './components/header';
import CustomContent from './components/Content';
import CustomSider from './components/Sider';

function App() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <CustomSider colorBgContainer={colorBgContainer} />
        <Layout>
          <CustomHeader colorBgContainer={colorBgContainer} />
          <CustomContent colorBgContainer={colorBgContainer} borderRadiusLG={borderRadiusLG} />
          <Layout.Footer style={{ textAlign: 'center' }}>
            Nhi Design ©{new Date().getFullYear()} Created by Ngoc Nhi
          </Layout.Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
