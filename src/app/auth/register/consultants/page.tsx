'use client'
import Image from 'next/image';
import { useEffect, useState, Fragment } from 'react';
import { useRouter } from "next/navigation";

/* --------- antds ---------- */
import { Button, Checkbox, Form, Input, Select, Space, notification } from "antd";
import { useForm } from "antd/lib/form/Form";

/* --------- firebase ---------- */
import { Timestamp, collection, getDocs, query } from "firebase/firestore";
import { auth, firestore } from "@/firebase/config";
import useAuth from "@/hook/auth_hook";

/* --------- interfaces ---------- */
import { consultantFormValuesInterface } from "@/interfaces/forms/consultantFormValues";

/* --------- models ---------- */
import User from "@/models/user";

/* --------- components ---------- */
import Agreement from '@/components/Agreement';

/* --------- utils ---------- */
import Routes from "@/models/routes";
import UsersControllers from "@/services/user/index";
import { formStyles } from '@/static/formStyles';

export default function RegisterConsultantsPage() {
    const { currentUser, loadingAuth } = useAuth();
    const { Option } = Select;

    const [form] = useForm();
    const router = useRouter();

    /* ----------- States ------------ */
    const [email, setEmail] = useState("");
    const [phoneCodes, setPhoneCodes] = useState<any[]>([]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [alternatePhoneNumber, setAlternatePhoneNumber] = useState("");
    const [selectedPhoneCode, setSelectedPhoneCode] = useState("");
    const [selectedAlternatePhoneCode, setSelectedAlternatePhoneCode] = useState("");

    const [acceptedAgreement, setAcceptedAgreement] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);

    const formPersonalInfo = [
        {
            name: "firstName",
            label: "First Name",
            rules: [
                { required: true, message: "Enter your first name" }
            ],
            placeholder: "Enter your first name",
        },
        {
            name: "middleName",
            label: "Middle Name",
            rules: [
                { required: true, message: "Enter your middle name" }
            ],
            placeholder: "Enter your middle name",
        },
        {
            name: "lastName",
            label: "Last Name",
            rules: [
                { required: true, messaage: "Enter your last name" }
            ],
            placeholder: "Enter your last name",
        },
        {
            name: "email",
            label: "Email",
            rules: [
                { required: true, message: "The input is not valid e-mail" }
            ],
            placeholder: "Enter your email",
        },
        {
            name: "phone",
            label: "Phone Number",
            placeHolder: "Enter your phone number",
            inputValue: phoneNumber,
            selectValue: selectedPhoneCode,
            inputPrefix: selectedPhoneCode,
            inputType: "text",
            selectOnChange: (value: any) => {
                setSelectedPhoneCode(value);
            },
            inputOnChange: (value: any) => {
                setPhoneNumber(value);
            },
        },
        {
            name: "alternatePhone",
            label: "Alternate Phone",
            placeHolder: "Enter your alternate phone number",
            inputValue: alternatePhoneNumber,
            selectValue: selectedAlternatePhoneCode,
            inputPrefix: selectedAlternatePhoneCode,
            inputType: "text",
            selectOnChange: (value: any) => {
                setSelectedAlternatePhoneCode(value)
            },
            inputOnChange: (value: any) => {
                setAlternatePhoneNumber(value);
            },
        }
    ]

    const signUpInfo = [
        {
            name: "userName",
            label: "UserName",
            rules: [
                { required: true, message: "Enter your userName" }
            ],
            placeholder: `${email.length > 0 ? email : "Your email"}`,
            inputType: "email",
        },
        {
            name: "password",
            label: "Password",
            rules: [{ required: true, message: "This field is required!" }],
            placeholder: "Enter your password",
            autoComplete: "new-password",
        },
        {
            name: "passwordConfirmation",
            label: "Password confirmation",
            rules: [{ required: true, message: "This field is required!" }],
            placeholder: "Confirm your password",
            autoComplete: "new-password",
        },
    ]

    const onFinishForm = async (values: consultantFormValuesInterface) => {
        setLoadingButton(true);
        console.log('registrando usuario =>')
        try {
            await UsersControllers.register(
                new User({
                    uid: "",
                    displayName: `${values.firstName} ${values.lastName}`,
                    firstName: values.firstName,
                    middleName: values.middleName,
                    email: values.email,
                    phoneCode: selectedPhoneCode,
                    phone: phoneNumber,
                    alternatePhoneCode: selectedAlternatePhoneCode,
                    alternatePhone: alternatePhoneNumber,
                    lastName: values.lastName,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                    status: "In Review",
                }),
                values.password,
            );
            form.resetFields();

            notification.success({
                message: "Good job!",
                description: "User registered successfully",
                placement: "topRight",
            });

            router.replace(Routes.consultants.login);
        } catch (error: any) {
            notification.error({
                message: error.code,
                description: error.message,
                placement: "topRight",
            });
        }
        setLoadingButton(false);
    }

    const getPhoneCodes = async () => {
        try {
            const _query = query(
                collection(firestore, "countries"),
            )

            const _countriesDocuments = await getDocs(_query);
            const _phoneCodes: any[] = [];
            _countriesDocuments.forEach((document) => {
                const { flag, name, phoneCode } = document.data();
                _phoneCodes.push({
                    flag,
                    name,
                    code: phoneCode,
                });
            });

            setPhoneCodes(_phoneCodes);
            setSelectedPhoneCode(_phoneCodes[0].code);
            setSelectedAlternatePhoneCode(_phoneCodes[0].code);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            return router.replace(Routes.consultants.dashboard);
        }
        getPhoneCodes();
    }, [currentUser, router]);

    return (
        <section className="flex flex-col registration border max-w-[1180px] mx-auto my-4 p-4">
            <h2 className="w-max font-semibold">CONSULTANT REGISTRATION</h2>

            <div className="flex flex-col border my-4 p-4">
                <h3>PERSONAL INFORMATION</h3>

                <Form
                    form={form}
                    name="registration_consultant"
                    layout={'vertical'}
                    onFinish={onFinishForm}
                    style={formStyles.form as object}
                >
                    {
                        formPersonalInfo.map((formItem, index) => {
                            const showPhoneInputs = formItem.name === 'phone' || formItem.name === 'alternatePhone'
                            const showExceptPhones = formItem.name != 'phone' && formItem.name != 'alternatePhone'
                            return (
                                <Fragment key={index + formItem.name}>
                                    {
                                        showExceptPhones &&
                                        <Form.Item
                                            name={formItem.name}
                                            label={formItem.label}
                                            rules={formItem.rules}
                                            style={formStyles.formItem}
                                        >
                                            <Input
                                                className={formStyles.input}
                                                placeholder={formItem.placeholder}
                                            />
                                        </Form.Item >
                                    }
                                    {
                                        showPhoneInputs &&
                                        <Form.Item
                                            name={formItem.name}
                                            label={formItem.label}
                                            style={formStyles.formItem}
                                        >
                                            <Space.Compact style={{ width: "100%" }}>
                                                <Select
                                                    style={{ display: 'flex', width: "40%", float: "left" }}
                                                    value={formItem.selectValue}
                                                    onChange={formItem.selectOnChange}>
                                                    {
                                                        phoneCodes.map((item, index) => (
                                                            <Option
                                                                key={index}
                                                                value={item.code}
                                                                style={{ display: 'flex', width: "100%", padding: 0 }}
                                                            >
                                                                <Image
                                                                    src={item.flag}
                                                                    width={16}
                                                                    height={16}
                                                                    alt={item.name}
                                                                    style={{ marginBottom: 2 }}
                                                                />
                                                                {" "}{item.name}
                                                            </Option>
                                                        ))
                                                    }
                                                </Select>
                                                <Input
                                                    value={formItem.inputValue}
                                                    style={{ width: "60%" }}
                                                    type="text"
                                                    className={formStyles.input}
                                                    placeholder={formItem.placeholder}
                                                    onChange={(e) => {
                                                        setPhoneNumber(e.target.value);
                                                    }}
                                                />
                                            </Space.Compact>
                                        </Form.Item>
                                    }
                                </Fragment>
                            )
                        })
                    }
                </Form>
            </div>

            <div className="flex flex-col border my-4 p-4">
                <h3>Sign Up</h3>
                <Form
                    form={form}
                    name="signUp_consultant"
                    layout={'vertical'}
                    onFinish={onFinishForm}
                    style={formStyles.form as object}
                >
                    {
                        signUpInfo.map((formItem, index) => {
                            const typeInputValidation = formItem.name === 'password' || formItem.name === 'passwordConfirmation'
                            return (
                                <Fragment key={index + formItem.name}>
                                    <Form.Item
                                        name={formItem.name}
                                        label={formItem.label}
                                        rules={formItem.rules}
                                        style={formStyles.formItem}
                                    >
                                        {
                                            formItem.name === 'userName' &&
                                            <Input
                                                className={formStyles.input}
                                                placeholder={formItem.placeholder}
                                            />
                                        }
                                        {
                                            typeInputValidation &&
                                            <Input.Password
                                                className={formStyles.input}
                                                placeholder={formItem.placeholder}
                                            />
                                        }
                                    </Form.Item >
                                </Fragment>
                            )
                        })
                    }
                </Form>
            </div>

            <Agreement />

            <Checkbox checked={acceptedAgreement} style={{ margin: "16px 0" }}
                onChange={(_) => {
                    setAcceptedAgreement(!acceptedAgreement);
                }}>
                I declare and acknowledge that I have read and AGREE with the Terms, Conditions and Policies to become a registered Consultant for the EXPERTTIS platform.
            </Checkbox>

            <Button
                loading={loadingButton}
                disabled={!acceptedAgreement}
                htmlType="submit"
                type="primary"
                className="submit-button max-w-max"
            >
                Register
            </Button>
        </section>
    );
}