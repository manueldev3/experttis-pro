import Image from "next/image";
import loaderImg from "@/assets/gif/experttis-load.gif";
import { Col, Row, Typography } from "antd";

const { Title } = Typography;

export interface ExperttisLoaderInterface {
    tip?: string
}

export default function ExperttisLoader(porps: ExperttisLoaderInterface) {
    const { tip } = porps;
    return (
        <div style={{ display: "flex", flexDirection: 'column', height: '100vh', justifyContent: "center", alignItems: "center" }}>
            <Row style={{ height: "100vh", backgroundColor: 'white' }} align="middle">
                <Col span={24}>
                    <Row style={{ width: "100%" }} justify="center">
                        <Image
                            src={loaderImg}
                            width={150}
                            height={150}
                            alt="Experttis logo for load"
                            style={{
                                textAlign: "center",
                            }}
                        />
                    </Row>
                    <Row style={{ width: "100%" }} justify="center">
                        <Title
                            level={4}
                            style={{
                                textAlign: "center",
                            }}
                        >{tip}</Title>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}