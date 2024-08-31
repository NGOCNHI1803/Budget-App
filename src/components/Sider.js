// src/components/Sider.js
import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const items = [
  { label: 'Budget', key: '1', icon: <PieChartOutlined /> },
  { label: 'Option 2', key: '2', icon: <DesktopOutlined /> },
  {
    label: 'User',
    key: 'sub1',
    icon: <UserOutlined />,
    children: [
      { label: 'Tom', key: '3' },
      { label: 'Bill', key: '4' },
      { label: 'Alex', key: '5' },
    ],
  },
  {
    label: 'Team',
    key: 'sub2',
    icon: <TeamOutlined />,
    children: [
      { label: 'Team 1', key: '6' },
      { label: 'Team 2', key: '8' },
    ],
  },
  { label: 'Files', key: '9', icon: <FileOutlined /> },
];

const CustomSider = ({ colorBgContainer }) => {
  return (
    <Sider
      collapsible
      style={{
        background: colorBgContainer,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    </Sider>
  );
};

export default CustomSider;
