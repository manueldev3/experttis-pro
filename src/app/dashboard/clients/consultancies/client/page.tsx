"use client";
import { Container } from "react-bootstrap";
import { DatePicker, Select } from 'antd';

import { CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { Divider, Typography } from "antd";

const { Title } = Typography;

export default function ClientConsultanciesPage() {
    const { RangePicker } = DatePicker;
    return (
        <Container style={{ marginTop: 128 }}>
            <Title level={4}>
                My consultancies
            </Title>
            <Divider />
            <div className="flex justify-center items-center flex-col max-w-xl m-auto">
                <h3 className="block text-lg mb-2 text-gray-500">
                    Select a date range <CalendarOutlined />
                </h3>
                <div className="flex justify-center items-center gap-2 my-4">
                    <RangePicker />
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={[
                            {
                                value: '1',
                                label: 'All',
                            }
                        ]}
                    />
                </div>
                <button className="w-80 bg-green-300 rounded-lg p-2 hover:bg-green-400 transition-all text-base font-bold">
                    Search <SearchOutlined />
                </button>
            </div>
            <Divider />
            <div className=" bg-gray-200 p-2 rounded-lg">
                <Title level={5} className="text-center">
                    No results
                </Title>
            </div>
            <Divider />
        </Container>
    )
}