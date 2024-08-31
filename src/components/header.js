
import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const CustomHeader = ({ colorBgContainer }) => {
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    />
  );
};

export default CustomHeader;
