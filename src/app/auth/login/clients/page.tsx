'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/firebase/config";
import useAuth from "@/hook/auth_hook";
import { signInWithEmailAndPassword } from "firebase/auth";

/* ------  Components ----- */
import Link from "next/link";
import ExperttisLoader from "@/components/Loader";
import { Button, Card, Divider, Form, Input, notification } from "antd";

/* Utils */
import Routes from "@/models/routes";
import { formStyles } from "@/static/formStyles";


export default function LoginPage() {
    const router = useRouter();
    const { currentUser, loadingAuth } = useAuth();

    useEffect(() => {
        if (currentUser) {
            router.replace(Routes.clients.dashboard);
        }
    }, [currentUser, router]);

    const onFinish = async (values: any) => {
        try {
            await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password,
            );

            notification.success({
                message: "User signed in",
                description: "User has been signed in successfully",
                placement: "topRight",
            });

            router.replace(Routes.clients.dashboard);
        } catch (e: any) {
            notification.error({
                message: e.code,
                description: e.message,
                placement: "topRight",
            });
        }
    }

    return loadingAuth ? <ExperttisLoader /> : (
        <section
            className="login"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Card style={{
                minWidth: 460,
                margin: 32,
            }}>
                <Form
                    name="login-consultants"
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <h4>LOGIN</h4>
                    <Form.Item
                        name="email"
                        label="Email address:"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email address",
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email address",
                            },
                        ]}
                    >
                        <Input
                            className={formStyles.input}
                            placeholder="Enter your email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password:"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your password",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter your password"
                        />
                    </Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="submit-button"
                    >
                        Sign in
                    </Button>
                    <Divider />
                    <div className="d-flex justify-content-end">
                        <Link href="/">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                        {`Don't have a account?`}
                        <Link href={Routes.clients.register} style={{ marginLeft: 8 }}>
                            Register
                        </Link>
                    </div>
                </Form>
            </Card>
        </section>
    );
}