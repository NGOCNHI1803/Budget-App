// src/components/Content.js
import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import BudgetApp from './BudgetApp';

const { Content } = Layout;

const CustomContent = ({ colorBgContainer, borderRadiusLG }) => {
  return (
    <Content
      style={{
        margin: '0 16px',
      }}
    >
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Bill</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <BudgetApp/>
      </div>
    </Content>
  );
};

export default CustomContent;
