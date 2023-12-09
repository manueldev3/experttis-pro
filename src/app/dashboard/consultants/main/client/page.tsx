"use client";
import useAuth from "@/hook/auth_hook";
import { Container } from "react-bootstrap";

import { BookOutlined, ClockCircleOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Statistic, Table, Typography } from "antd";

const { Title } = Typography;

export default function ConsultantsMainPage() {
    const { currentUser } = useAuth();

    return (
        <Container style={{ marginTop: 128 }}>
            <Title level={4}>
                {(`Welcome ${currentUser?.firstName}`).toUpperCase()}!
            </Title>
            <Row gutter={[16, 16]} style={{ marginTop: "64px" }}>
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            backgroundColor: "#007bff",
                        }}
                        bordered={false}
                    >
                        <Statistic
                            title={<div
                                style={{ color: "white", opacity: 0.5 }}
                            >Consultant Booked</div>}
                            valueStyle={{
                                color: "white",
                                fontSize: 32,
                            }}
                            prefix={<BookOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            backgroundColor: "#26c6da",
                        }}
                        bordered={false}
                    >
                        <Statistic
                            title={<div
                                style={{ color: "white", opacity: 0.5 }}
                            >Consultancies Acummulated Time</div>}
                            valueStyle={{
                                color: "white",
                                fontSize: 32,
                            }}
                            prefix={<ClockCircleOutlined style={{ marginTop: -16 }} />}
                            suffix="Hrs"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            backgroundColor: "#66bb6a",
                        }}
                        bordered={false}
                    >
                        <Statistic
                            title={<div
                                style={{ color: "white", opacity: 0.5 }}
                            >Billing In Period</div>}
                            valueStyle={{
                                color: "white",
                                fontSize: 32,
                            }}
                            value={0.00}
                            prefix="US$"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card
                        bordered={false}
                    >
                        <Statistic
                            title={<div
                                style={{ opacity: 0.5 }}
                            >Received Evaluations</div>}
                            valueStyle={{
                                fontSize: 32,
                            }}
                            prefix={<StarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Divider />
            <Title level={5}>
                QUICK QUESTIONS
            </Title>
            <div>There are no quick questions yet to answer.</div>
            <Divider />
            <Title level={5}>
                PENDING CONSULTANCIES
            </Title>
            <Table
                columns={[
                    {
                        title: "Consultancy ID",
                        dataIndex: "id",
                        key: "id",
                        width: 256,
                    },
                    {
                        title: "Client",
                        dataIndex: "client",
                        key: "client",
                        width: 128,
                    },
                    {
                        title: "Scheduled at",
                        dataIndex: "scheduled",
                        key: "scheduled",
                    },
                    {
                        title: "",
                        dataIndex: "actions",
                        key: "actions",
                        width: 128,
                    },
                ]}
                dataSource={[
                    {
                        key: 1,
                        id: "ojofdjfod",
                        client: "Manuel Fern'andez",
                        scheduled: "lun - vie",
                        actions: <Button>hola mundo</Button>
                    }
                ]}
            />
        </Container>
    )
}