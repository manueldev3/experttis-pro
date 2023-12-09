"use client";
import useAuth from "@/hook/auth_hook";
import { Container } from "react-bootstrap";

import { SearchOutlined } from "@ant-design/icons";
import { Divider, Input, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function ClientMainPage() {
    const router = useRouter();
    const { currentUser } = useAuth();

    return (
        <Container style={{ marginTop: 128 }}>
            <Title level={4}>
                {(`Welcome ${currentUser?.firstName}`).toUpperCase()}!
            </Title>
            <Divider />
            <div className="flex flex-col max-w-xl m-auto">
                <Input
                    size="large"
                    placeholder="Search experts by typing keywords"
                    className="rounded-full mx-auto"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            router.push(`/dashboard/clients/main/browse-experts?search=${e.currentTarget.value}`);
                        }
                    }}
                    suffix={<SearchOutlined />}
                />
            </div>
            <Divider />
            <div className=" bg-gray-200 p-2 rounded-lg text-center">
                <Title level={5}>
                    Your Consultancies
                </Title>
                <p>There are no consultancies yet to attend.</p>
            </div>
            <Divider />
        </Container>
    )
}