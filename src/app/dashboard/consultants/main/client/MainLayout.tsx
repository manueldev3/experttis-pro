"use client";
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import useAuth from '@/hook/auth_hook';

import {
    CalendarOutlined,
    LogoutOutlined,
    PieChartOutlined,
    UserOutlined,
    MessageOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Col, Layout, Menu, Row, Skeleton, theme } from 'antd';

import Routes from "@/models/routes";

/* Components */
import Link from 'next/link';
import Image from "next/image";
import ExperttisLoader from '@/components/Loader';

/* Assets */
import logo from "@/assets/logos/logo.png";
import tripeNuts from '@/assets/logos-ext/triple-nuts.svg';
import defaultAvatar from '@/assets/avatars/avatar.png';

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Dashboard', Routes.consultants.dashboard, <PieChartOutlined />),
    getItem('Profile', Routes.consultants.profile, <UserOutlined />),
    getItem('Chat', Routes.consultants.chat, <MessageOutlined />),
    getItem('Schedule', Routes.consultants.schedule, <CalendarOutlined />),
    // getItem('User', 'sub1', <UserOutlined />, [
    //   getItem('Tom', '3'),
    //   getItem('Bill', '4'),
    //   getItem('Alex', '5'),
    // ]),
    getItem('Logout', 'logout', <LogoutOutlined />),
];

interface MainLayoutProps {
    children: ReactNode;
    breadcrumbs?: ReactNode;
    currentPage: string;
}

export default function MainLayout(props: MainLayoutProps) {
    const { currentUser, loadingAuth } = useAuth();
    const router = useRouter();

    const { children, breadcrumbs, currentPage } = props;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        if (!loadingAuth && !currentUser) {
            router.push(Routes.consultants.login);
        }
    }, [currentUser, loadingAuth, router])

    return loadingAuth ? (
        <ExperttisLoader />
    ) : (
        <Layout style={{ minHeight: '100vh', minWidth: '100vw' }}>
            <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                {collapsed ?
                    <Row justify="center" style={{ marginTop: 16 }}>
                        <Link href={'/'}>
                            <Image
                                src={tripeNuts}
                                width={64}
                                alt="Logo Experttis"
                                style={{ margin: '40px 0 0 0' }}
                            />
                        </Link>
                    </Row> :
                    <Row justify="center">
                        <Link href={'/'}>
                            <Image
                                src={logo}
                                width={160}
                                alt="Logo Experttis"
                                style={{ margin: '40px 0 0 0' }}
                            />
                        </Link>
                    </Row>
                }
                <Row justify="center" style={{
                    margin: "32px 0"
                }}>
                    <Col>
                        <Row justify="center">
                            <Image
                                style={{
                                    borderRadius: 72,
                                    border: "1px solid black",
                                    padding: 4,
                                }}
                                src={currentUser?.avatar || defaultAvatar}
                                width={72}
                                height={72}
                                alt="User avatar"
                            />
                        </Row>
                        <br />
                        {!currentUser ?
                            <Skeleton paragraph /> :
                            <h6 style={{
                                textAlign: "center",
                            }}>
                                {collapsed ?
                                    `${currentUser!.firstName.substring(0, 1)}. ${currentUser!.lastName.substring(0, 1)}.` :
                                    `${currentUser!.firstName} ${currentUser!.lastName.split(" ")[0]}`
                                }
                            </h6>
                        }
                        <h6 style={{
                            textAlign: "center",
                            fontWeight: 100,
                            color: "grey",
                        }}>Consultant</h6>
                    </Col>
                </Row>
                <Menu
                    theme="light"
                    defaultSelectedKeys={[currentPage]}
                    mode="inline"
                    items={items}
                    onClick={async ({ key }) => {
                        switch (key) {
                            case "logout":
                                await signOut(auth);
                                router.replace(Routes.consultants.login);
                                break;
                            default: router.push(key);
                        }
                    }}
                />
            </Sider>
            <Layout>
                <Content style={{ padding: '0 16px', width: "100%" }}>
                    {breadcrumbs}
                    {children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Copyright © 2019 Experttis. All rights reserved
                </Footer>
            </Layout>
        </Layout>
    );
};