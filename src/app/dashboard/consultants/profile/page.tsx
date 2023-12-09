"use client";
import moment from "moment";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { auth, firestore, storage } from "@/firebase/config";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";

/* Firebase */
import useAuth from "@/hook/auth_hook";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { DocumentReference, Timestamp, collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";

/* Antd */
import { Container } from "react-bootstrap";
import { useForm } from "antd/lib/form/Form";
import Checkbox from "antd/es/checkbox/Checkbox";
import { Card, Col, Form, Input, Row, Select, Space, Tabs, Typography, Button, notification, Divider, Popover, Radio, InputNumber, message, Upload, UploadProps } from "antd";
import { InboxOutlined, MinusOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";

/* Utils */
import Routes from "@/models/routes";
import { countries, langs } from "@/constants/langs";
import CertificationController from "@/services/certifications/index";
import DisciplineController from "@/services/disciplines/index";
import GradeController from "@/services/grade/index";
import ProfessionController from "@/services/professions/index";
import RelevantExperienceController from "@/services/relevant/experiences";
import RelevantPositionController from "@/services/relevant/positions";
import UserController from "@/services/user/index";

/* Models */
import Grade from "@/models/grade";
import Skill from "@/models/skill";
import Country from "@/models/country";
import Language from "@/models/language";
import RelevantExperience from "@/models/relevantExperience";
import Discipline, { DisciplineInterface } from "@/models/disciplines";
import Profession, { ProfessionInterface } from "@/models/profession";
import Certification, { CertificationInterface } from "@/models/certification";
import RelevantPosition, { RelevantPositionInterface } from "@/models/relevantPosition";
import User, { FinancialInfoInterface, PersonalInfoInterface, ProfessionalInfoInterface } from "@/models/user";

/* Components */
import MainLayout from "@/app/dashboard/consultants/main/client/MainLayout";
import ExperttisLoader from "@/components/Loader";


const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const labelStyle = 'original'
const timezones = {
    ...allTimezones,
}

export default function ConsultantscurrentUserPage() {
    const { currentUser, loadingAuth } = useAuth();

    const [personalInfoForm] = useForm();
    const [professionalInfoForm] = useForm();
    const [financialInfoForm] = useForm();

    const personalInfoValues = Form.useWatch([], personalInfoForm);
    const professionalInfoValues = Form.useWatch([], professionalInfoForm);
    const financialInfoFormValues = Form.useWatch([], financialInfoForm);

    const { options, parseTimezone } = useTimezoneSelect({ labelStyle, timezones });

    const [loadingSaveButton, setLoadingSaveButton] = useState<boolean>(false);
    const [resumeFile, setResumeFile] = useState<any>(null);
    const [tabIndex, setTabIndex] = useState<string>("1");
    const [selectedPhoneCode, setSelectedPhoneCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [selectedAlternatePhoneCode, setSelectedAlternatePhoneCode] = useState<string>("");
    const [alternatePhoneNumber, setAlternatePhoneNumber] = useState<string>("");
    const [phoneCodes, setPhoneCodes] = useState<Country[]>([]);
    const [minMaxRate, setMinMaxRate] = useState<number[]>([0, 0]);

    //Personal info
    const [selectedTimezone, setSelectedTimezone] = useState<string>(
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    );

    //Professional info
    // disciplines
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [searchDisciplines, setSearchDisciplines] = useState<Discipline[]>([]);
    const [otherDiscipline, setOtherDiscipline] = useState<string>("");
    const [loadingAddOtherDiscipline, setLoadingAddOtherDiscipline] = useState<boolean>(false);
    // professions
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [searchProfessions, setSearchProfessions] = useState<Profession[]>([]);
    const [otherProfession, setOtherProfession] = useState<string>("");
    const [loadingAddOtherProfession, setLoadingAddOtherProfession] = useState<boolean>(false);
    // certifications
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [searchCertifications, setSearchCertifications] = useState<Certification[]>([]);
    const [otherCertifications, setOtherCertifications] = useState<string>("");
    const [loadingAddOtherCertifications, setLoadingAddOtherCertifications] = useState<boolean>(false);
    // Relevant Positions
    const [relevantPositions, setRelevantPositions] = useState<RelevantPosition[]>([]);
    const [searchRelevantPositions, setSearchRelevantPositions] = useState<RelevantPosition[]>([]);
    const [otherRelevantPositions, setOtherRelevantPositions] = useState<string>("");
    const [loadingAddOtherRelevantPositions, setLoadingAddOtherRelevantPositions] = useState<boolean>(false);
    // Grades
    const [grades, setGrades] = useState<Grade[]>([]);
    // Relevant experience
    const [relevantExperiences, setRelevantExperiences] = useState<RelevantExperience[]>([]);

    const [rate, setRate] = useState<number>(65);

    const [languages, setLanguages] = useState<Language[]>([
        new Language({
            code: 'en',
            name: 'English',
            slug: 'english',
            level: 'Native',
        }),
    ]);
    const [conferences, setConferences] = useState<Skill[]>([
        new Skill({
            quantity: 1,
            topicDescription: '',
        }),
    ]);
    const [awards, setAwards] = useState<Skill[]>([
        new Skill({
            quantity: 1,
            topicDescription: '',
        }),
    ]);

    // financialInfo
    const [searchCountries, setSearchCountries] = useState<{ abbreviation: string, name: string }[]>([]);

    useEffect(() => {
        let unsubscribeDisciplines = () => { },
            unsubscribeProfessions = () => { },
            unsubscribeCertifications = () => { },
            unsubscribeRelevantPositions = () => { };
        if (currentUser !== null) {
            (async () => {
                if (currentUser.professionalInfo) {
                    setLanguages(currentUser.professionalInfo.languages.map(item => new Language(item)));
                }
                // Disciplines snapshot
                unsubscribeDisciplines = onSnapshot(
                    query(
                        collection(firestore, Discipline.collectionPath),
                        where(
                            "userID",
                            "in",
                            ["admin", currentUser.uid],
                        ),
                        orderBy("name")
                    ),
                    (snapshot) => {
                        setDisciplines(snapshot.docs.map(
                            (document) => {
                                return new Discipline({
                                    ...document.data() as Discipline,
                                    id: document.id,
                                });
                            }
                        ));
                    }
                );
                // Professions snapshot
                unsubscribeProfessions = onSnapshot(
                    query(
                        collection(firestore, Profession.collectionPath),
                        where(
                            "userID",
                            "in",
                            ["admin", currentUser.uid],
                        ),
                        orderBy("name")
                    ),
                    (snapshot) => {
                        console.log(snapshot.size)
                        setProfessions(snapshot.docs.map(
                            (document) => {
                                return new Profession({
                                    ...document.data() as Profession,
                                    id: document.id,
                                });
                            }
                        ));
                    }
                );
                // Certifications snapshot
                unsubscribeCertifications = onSnapshot(
                    query(
                        collection(firestore, Certification.collectionPath),
                        where(
                            "userID",
                            "in",
                            ["admin", currentUser.uid],
                        ),
                        orderBy("name")
                    ),
                    (snapshot) => {
                        setCertifications(snapshot.docs.map(
                            (document) => {
                                return new Certification({
                                    ...document.data() as Certification,
                                    id: document.id,
                                });
                            }
                        ));
                    }
                );
                // Relevant Positions snapshot
                unsubscribeRelevantPositions = onSnapshot(
                    query(
                        collection(firestore, RelevantPosition.collectionPath),
                        where(
                            "userID",
                            "in",
                            ["admin", currentUser.uid],
                        ),
                        orderBy("name")
                    ),
                    (snapshot) => {
                        setRelevantPositions(snapshot.docs.map(
                            (document) => {
                                return new RelevantPosition({
                                    ...document.data() as RelevantPosition,
                                    id: document.id,
                                });
                            }
                        ));
                    }
                );

                setGrades(await GradeController.index());

                const firstRelevantExperiences = await RelevantExperienceController.index()
                setRelevantExperiences(firstRelevantExperiences);
                setMinMaxRate([firstRelevantExperiences[0].minRate, firstRelevantExperiences[0].maxRate]);

                setPhoneCodes(await UserController.getPhoneCodes());
            })();
        }

        return () => {
            unsubscribeDisciplines();
            unsubscribeProfessions();
            unsubscribeCertifications();
            unsubscribeRelevantPositions();
        };
    }, [currentUser]);

    const onFinishPersonalInfo = async (values: Object): Promise<boolean> => {
        setLoadingSaveButton(true);
        try {
            await UserController.updatePersonalInfo(
                currentUser!,
                values as PersonalInfoInterface,
            );

            notification.success({
                message: 'Update personal info successfull!',
            });
            setLoadingSaveButton(false);
            return true;
        } catch (e: any) {
            notification.error({
                message: e.toString(),
            });
            setLoadingSaveButton(false);
            return false;
        }
    }

    const onFinishProfessionalInfo = async (values: any): Promise<boolean> => {
        setLoadingSaveButton(true);
        try {
            let resumeURL = currentUser?.professionalInfo?.resumeURL ?? "";
            if (resumeFile !== null) {
                const resumeRef = ref(storage, `${currentUser?.uid}/resume.${resumeFile.type.split("/")[1]}`);
                const resumeSnapshot = await uploadBytes(resumeRef, resumeFile.originFileObj, {
                    contentType: resumeFile.type,
                });
                resumeURL = await getDownloadURL(resumeSnapshot.ref)
            }
            await UserController.updateProfessionalInfo(
                currentUser!,
                {
                    ...values as ProfessionalInfoInterface,
                    disciplinesRefs: values.disciplines.map(
                        (id: string) => doc(
                            firestore,
                            Discipline.collectionPath,
                            id,
                        ),
                    ),
                    professionsRefs: values.professions.map(
                        (id: string) => doc(
                            firestore,
                            Discipline.collectionPath,
                            id,
                        ) as DocumentReference,
                    ),
                    relevantExperienceRef: doc(
                        firestore,
                        RelevantExperience.collectionPath,
                        values.relevantExperience,
                    ),
                    grades: {
                        inTheFieldsOfExpertise: values.inTheFieldsOfExpertise,
                        outTheFieldsOfExpertise: values.outTheFieldsOfExpertise,
                    },
                    certificationsRefs: values.certifications.map(
                        (id: string) => doc(
                            firestore,
                            Discipline.collectionPath,
                            id,
                        ) as DocumentReference,
                    ),
                    languages: languages.map(item => { return { ...item } }),
                    relevantPositionsRefs: values.relevantPositions.map(
                        (id: string) => doc(
                            firestore,
                            Discipline.collectionPath,
                            id,
                        ) as DocumentReference,
                    ),
                    internationalExperience: values.internationalExperience.map((item: string) => JSON.parse(item)),
                    authorizedToWorkIn: values.authorizedToWorkIn.map((item: string) => JSON.parse(item)),
                    conferences: conferences.map(item => { return { ...item } }),
                    awards: awards.map(item => { return { ...item } }),
                    resumeURL,
                },
            );

            notification.success({
                message: 'Update profesional info successfull!',
            });
            setLoadingSaveButton(false);
            return true;
        } catch (e: any) {
            console.log(e)
            notification.error({
                message: e.toString(),
            });
            setLoadingSaveButton(false);
            return false;
        }
    }

    const onFinishFinancialInfo = async (values: any): Promise<boolean> => {
        setLoadingSaveButton(true);
        try {
            await UserController.updateFinancialInfo(
                currentUser!,
                {
                    useHomeAddress: values.useHomeAddress,
                    firstName: values.firstName ?? "",
                    middleName: values.middleName ?? "",
                    lastName: values.lastName ?? "",
                    street: values.street ?? "",
                    appartment: values.appartment ?? "",
                    city: values.city ?? "",
                    state: values.state ?? "",
                    zipCode: values.zipCode ?? "",
                    country: values.country ?? "",
                    phoneNumber: values.phoneNumber ? `${values.phoneCode} ${values.phoneNumber}` : "",
                    paypalAccount: values.paypalAccount ?? "",
                },
            );
            notification.success({
                message: 'Update financial info successfull!',
            });
            setLoadingSaveButton(false);
            return true;
        } catch (e: any) {
            notification.error({
                message: e.toString(),
            });
            setLoadingSaveButton(false);
            return false;
        }
    }

    return loadingAuth ?
        (
            <ExperttisLoader
                tip="Check Consultant Profile..."
            />
        ) : currentUser === null ? (
            <ExperttisLoader
                tip="Wait for user info..."
            />
        ) : (
            <MainLayout
                currentPage={Routes.consultants.profile}
            >
                <Container className="py-4">
                    <Row justify={"space-between"} style={{
                        width: "100%",
                    }}>
                        <Col>
                            <Title level={3} style={{ marginBottom: 0 }}>
                                USER INFORMATION
                            </Title>
                            Account Status:{' '}
                            <span style={{ color: "red" }}>
                                {currentUser.status}
                            </span>
                            {currentUser.reviewAt &&
                                <div>
                                    Last Review:{" "}
                                    {moment.unix(
                                        currentUser.reviewAt.seconds,
                                    ).format("YYYY-MM-DD hh:mm:ss")}
                                </div>
                            }
                        </Col>
                        <Col>
                            Expert Registry Reference
                            <Title level={5}>
                                {currentUser.uid}
                            </Title>
                        </Col>
                    </Row>
                    <br />
                    <Card>
                        <Tabs
                            activeKey={tabIndex}
                            defaultActiveKey={tabIndex}
                            onChange={(activeKey: string) => {
                                setTabIndex(activeKey);
                            }}
                            items={[
                                {
                                    label: "Personal Information",
                                    key: "1",
                                    children: <Row>
                                        <Col span={24}>
                                            <Row justify={"center"}>
                                                <Title level={4}>
                                                    Personal Information
                                                </Title>
                                            </Row>
                                            <br />
                                            <Form
                                                form={personalInfoForm}
                                                layout="vertical"
                                                onFinish={onFinishPersonalInfo}
                                                initialValues={{
                                                    ...currentUser,
                                                    ...currentUser.toJson(),
                                                    ...currentUser.personalInfo,
                                                }}
                                            >
                                                <Row gutter={[16, 16]}>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="firstName"
                                                            label="First Name:"
                                                            rules={[
                                                                { required: true },
                                                                { type: "string" },
                                                            ]}
                                                        >
                                                            <Input
                                                                placeholder="Enter your first name"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="middleName"
                                                            label="Middle Name:"
                                                        >
                                                            <Input
                                                                placeholder="Enter your middle name"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="lastName"
                                                            label="Last Name:"
                                                            rules={[
                                                                { required: true },
                                                                { type: "string" },
                                                            ]}
                                                        >
                                                            <Input
                                                                width={"100%"}
                                                                placeholder="Enter your last name"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            label="Phone:"
                                                            className="experttis-input"
                                                            style={{
                                                                display: "inline",
                                                            }}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                }
                                                            ]}
                                                        >
                                                            <Select
                                                                style={{ width: "40%", float: "left" }}
                                                                value={
                                                                    selectedPhoneCode.length > 0 ?
                                                                        selectedPhoneCode :
                                                                        currentUser?.phoneCode
                                                                }
                                                                onChange={(value) => {
                                                                    setPhoneNumber(value);
                                                                    setSelectedPhoneCode(value);
                                                                }}
                                                            >
                                                                {phoneCodes.map((item, index) => (
                                                                    <Option key={index} value={item.code}>
                                                                        <Image
                                                                            src={item.flagURL}
                                                                            width={16}
                                                                            height={16}
                                                                            alt={item.name}
                                                                            style={{ marginBottom: 2 }}
                                                                        />
                                                                        {" "}{item.name}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                            <Input
                                                                value={
                                                                    phoneNumber.length > 0 ?
                                                                        phoneNumber :
                                                                        currentUser?.phone
                                                                }
                                                                style={{ width: "60%" }}
                                                                type="text"
                                                                placeholder="Enter your phone number"
                                                                onChange={(e) => {
                                                                    if (e.target.value !== "+") {
                                                                        const value = parseInt(e.target.value.split(selectedPhoneCode)[1].substring(0, 10));
                                                                        const formatter = `${selectedPhoneCode}${isNaN(value) ? "" : value}`;
                                                                        setPhoneNumber(formatter);
                                                                    }
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="alternatePhone"
                                                            label="Alternate Phone:"
                                                            className="experttis-input"
                                                            style={{
                                                                display: "inline"
                                                            }}
                                                        >
                                                            <Select
                                                                style={{ width: "40%", float: "left" }}
                                                                value={
                                                                    selectedAlternatePhoneCode.length > 0 ?
                                                                        selectedAlternatePhoneCode :
                                                                        currentUser?.alternatePhoneCode
                                                                }
                                                                onChange={(value) => {
                                                                    setAlternatePhoneNumber(value);
                                                                    setSelectedAlternatePhoneCode(value);
                                                                }}
                                                            >
                                                                {
                                                                    phoneCodes.map((item, index) => (
                                                                        <Option key={index} value={item.code}>
                                                                            <Image
                                                                                src={item.flagURL}
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
                                                                value={
                                                                    alternatePhoneNumber.length > 0 ?
                                                                        alternatePhoneNumber :
                                                                        currentUser?.alternatePhone
                                                                }
                                                                style={{ width: "60%" }}
                                                                type="text"
                                                                placeholder="Enter your alternate phone number"
                                                                onChange={(e) => {
                                                                    if (e.target.value !== "+") {
                                                                        const value = parseInt(e.target.value.split(selectedPhoneCode)[1].substring(0, 10));
                                                                        const formatter = `${selectedPhoneCode}${isNaN(value) ? "" : value}`;
                                                                        setAlternatePhoneNumber(formatter);
                                                                    }
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="timezone"
                                                            label="Timezone:"
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Select
                                                                showSearch
                                                                onChange={(value) => {
                                                                    setSelectedTimezone(value);
                                                                }}
                                                            >
                                                                {options.map((option, index) => (
                                                                    <Option key={index} value={option.value}>
                                                                        {option.label}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Item
                                                            name="email"
                                                            label="Email:"
                                                        >
                                                            <Input disabled />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Item
                                                            name="alternateEmail"
                                                            label="Alternate Email:"
                                                            rules={[
                                                                {
                                                                    type: 'email',
                                                                }
                                                            ]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="street"
                                                            label="Street Address:"
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="appartment"
                                                            label="Apartment, suite, etc.:"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="city"
                                                            label="City:"
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="state"
                                                            label="State:"
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="zipCode"
                                                            label="Zip Code:"
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            name="country"
                                                            label="Country"
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Row justify="end">
                                                            <Space>
                                                                {currentUser.personalInfo &&
                                                                    <Button
                                                                        loading={loadingSaveButton}
                                                                        htmlType="submit"
                                                                        type="primary"
                                                                    >
                                                                        SAVE
                                                                    </Button>
                                                                }
                                                                <Button
                                                                    loading={loadingSaveButton}
                                                                    onClick={async () => {
                                                                        try {
                                                                            await personalInfoForm.validateFields();
                                                                            const success = await onFinishPersonalInfo(
                                                                                personalInfoValues
                                                                            );
                                                                            if (success) {
                                                                                setTabIndex('2');
                                                                            }
                                                                        } catch (e: any) {
                                                                            personalInfoForm.submit();
                                                                        }
                                                                    }}
                                                                    type="primary"
                                                                >
                                                                    SAVE AND NEXT
                                                                </Button>
                                                            </Space>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                },
                                {
                                    label: "Professional Information",
                                    key: "2",
                                    disabled: !currentUser.personalInfo,
                                    children: <Row>
                                        <Col span={24}>
                                            <Row justify={"center"}>
                                                <Title level={4}>
                                                    Personal Information
                                                </Title>
                                            </Row>
                                            <br />
                                            <Form
                                                form={professionalInfoForm}
                                                layout="vertical"
                                                onFinish={onFinishProfessionalInfo}
                                                initialValues={{
                                                    ...currentUser.professionalInfo,
                                                    rate: minMaxRate[0],
                                                    authorizedToWorkIn: currentUser?.professionalInfo?.authorizedToWorkIn.map(
                                                        item => JSON.stringify(item)
                                                    ),
                                                    internationalExperience: currentUser?.professionalInfo?.internationalExperience.map(
                                                        item => JSON.stringify(item)
                                                    ),
                                                    inTheFieldsOfExpertise: currentUser?.professionalInfo?.grades.inTheFieldsOfExpertise,
                                                    outTheFieldsOfExpertise: currentUser?.professionalInfo?.grades.outTheFieldsOfExpertise
                                                }}
                                            >
                                                <Row gutter={[16, 16]}>
                                                    <Col md={16}>
                                                        <Form.Item
                                                            name="disciplines"
                                                            label="Disciplines:"
                                                            rules={[
                                                                { required: true },
                                                            ]}
                                                        >
                                                            <Select
                                                                mode="multiple"
                                                                filterOption={false}
                                                                onSearch={(value: string) => {
                                                                    setSearchDisciplines(
                                                                        disciplines.filter(
                                                                            item => item.name.toLowerCase().includes(
                                                                                value.toLowerCase()
                                                                            )
                                                                        )
                                                                    );
                                                                }}
                                                                onSelect={() => {
                                                                    setSearchDisciplines([]);
                                                                }}
                                                                showSearch
                                                                allowClear
                                                            >
                                                                {!searchDisciplines.length
                                                                    ? disciplines.map((option, index) => (
                                                                        <Option key={index} value={option.id}>
                                                                            {option.name.toLocaleUpperCase()}
                                                                        </Option>
                                                                    )) :
                                                                    searchDisciplines.map((option, index) => (
                                                                        <Option key={index} value={option.id}>
                                                                            {option.name.toLocaleUpperCase()}
                                                                        </Option>
                                                                    ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            label="Other:"
                                                        >
                                                            <Space.Compact style={{ width: '100%' }}>
                                                                <Input
                                                                    value={otherDiscipline}
                                                                    placeholder="Enter other discipline"
                                                                    onChange={(e) => setOtherDiscipline(
                                                                        e.target.value
                                                                    )}
                                                                />
                                                                <Button
                                                                    loading={loadingAddOtherDiscipline}
                                                                    disabled={!otherDiscipline.length}
                                                                    type="primary"
                                                                    onClick={async () => {
                                                                        setLoadingAddOtherDiscipline(true);
                                                                        try {
                                                                            await DisciplineController.create(
                                                                                new Discipline({
                                                                                    id: "",
                                                                                    name: otherDiscipline,
                                                                                    userID: auth.currentUser!.uid,
                                                                                    createdAt: Timestamp.now(),
                                                                                    updatedAt: Timestamp.now(),
                                                                                } as DisciplineInterface)
                                                                            );
                                                                            setOtherDiscipline("");
                                                                            notification.success({
                                                                                message: "Other discipline add Successfull!"
                                                                            });
                                                                        } catch (e: any) {
                                                                            notification.error({
                                                                                message: e.toString(),
                                                                            });
                                                                        }
                                                                        setLoadingAddOtherDiscipline(false);
                                                                    }}
                                                                >
                                                                    Add
                                                                </Button>
                                                            </Space.Compact>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            name="knowledgeAndExperience"
                                                            label={'Knowledge And Experience:'}
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Input.TextArea
                                                                maxLength={4200}
                                                                rows={5}
                                                                placeholder="Describe your fields of relevant experience, knowledge, skills, professional developments and findings that qualify you to provide specific consultancy services. Be as specific as possible."
                                                                showCount
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="expertiseSummary"
                                                            label={<Space>
                                                                Expertise Summary
                                                                <Popover
                                                                    content={
                                                                        <p style={{ width: 256 }}>
                                                                            Write a summary of your previous
                                                                            description. This parragraph must tell
                                                                            users the specific areas and how you can
                                                                            be helpful for them. This is the
                                                                            description users will see first when they
                                                                            search for Consultants.Take your time to
                                                                            advertise your service here.`
                                                                        </p>
                                                                    }
                                                                >
                                                                    <QuestionCircleOutlined />
                                                                </Popover>:
                                                            </Space>}
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Input.TextArea
                                                                maxLength={1500}
                                                                rows={3}
                                                                placeholder="Briefly describe your level of experience to provide consulting services."
                                                                showCount
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col md={12}>
                                                        <Form.Item
                                                            name="relevantExperience"
                                                            label="Relevant experience in the fields of expertise (years):"
                                                            initialValue={relevantExperiences[0]?.id}
                                                        >
                                                            <Radio.Group
                                                                onChange={(e) => {
                                                                    const values = relevantExperiences.filter(item => item.id === e.target.value);
                                                                    const item = values[0];
                                                                    setMinMaxRate([item.minRate, item.maxRate]);
                                                                }}
                                                            >
                                                                {relevantExperiences.map((option, index) => (
                                                                    <Radio key={index} value={option.id}>
                                                                        {option.name}
                                                                    </Radio>
                                                                ))}
                                                            </Radio.Group>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col md={12}>
                                                        <Form.Item
                                                            name="rate"
                                                            label={
                                                                <Row justify="space-around" style={{
                                                                    width: '100vh'
                                                                }}>
                                                                    <Col style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <Text>
                                                                            Min Rate:
                                                                        </Text>
                                                                        <Text strong>
                                                                            {Intl.NumberFormat(
                                                                                'en-US',
                                                                                {
                                                                                    style: 'currency',
                                                                                    currency: 'USD',
                                                                                    minimumFractionDigits: 0,
                                                                                    signDisplay: 'never',
                                                                                    currencyDisplay: 'code',
                                                                                }
                                                                            ).format(minMaxRate[0])}
                                                                        </Text>
                                                                    </Col>
                                                                    <Col style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <Text>
                                                                            Suggested Max Rate:
                                                                        </Text>
                                                                        <Text strong>
                                                                            {Intl.NumberFormat(
                                                                                'en-US',
                                                                                {
                                                                                    style: 'currency',
                                                                                    currency: 'USD',
                                                                                    minimumFractionDigits: 0,
                                                                                    currencyDisplay: 'code',
                                                                                }
                                                                            ).format(minMaxRate[1])}
                                                                        </Text>
                                                                    </Col>
                                                                </Row>
                                                            }
                                                        >
                                                            <InputNumber
                                                                style={{ width: '100%' }}
                                                                min={1}
                                                                addonAfter='USD/h'
                                                            />
                                                            {rate < minMaxRate[0] &&
                                                                <Text type="danger">
                                                                    Must use at least the Minimum Rate set by the platform.
                                                                </Text>
                                                            }
                                                        </Form.Item>
                                                    </Col>

                                                    <Col md={16}>
                                                        <Form.Item
                                                            name="professions"
                                                            label="Professions:"
                                                            rules={[
                                                                { required: true },
                                                            ]}
                                                        >
                                                            <Select
                                                                mode="multiple"
                                                                filterOption={false}
                                                                onSearch={(value: string) => {
                                                                    setSearchProfessions(
                                                                        professions.filter(
                                                                            item => item.name.toLowerCase().includes(
                                                                                value.toLowerCase()
                                                                            )
                                                                        )
                                                                    );
                                                                }}
                                                                onSelect={() => {
                                                                    setSearchProfessions([]);
                                                                }}
                                                                showSearch
                                                                allowClear
                                                            >
                                                                {!searchProfessions.length
                                                                    ? professions.map((option, index) => (
                                                                        <Option key={index} value={option.id}>
                                                                            {option.name.toLocaleUpperCase()}
                                                                        </Option>
                                                                    )) :
                                                                    searchProfessions.map((option, index) => (
                                                                        <Option key={index} value={option.id}>
                                                                            {option.name.toLocaleUpperCase()}
                                                                        </Option>
                                                                    ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            label="Other:"
                                                        >
                                                            <Space.Compact style={{ width: '100%' }}>
                                                                <Input
                                                                    value={otherProfession}
                                                                    placeholder="Enter other profession"
                                                                    onChange={(e) => setOtherProfession(
                                                                        e.target.value
                                                                    )}
                                                                />
                                                                <Button
                                                                    loading={loadingAddOtherProfession}
                                                                    disabled={!otherProfession.length}
                                                                    type="primary"
                                                                    onClick={async () => {
                                                                        setLoadingAddOtherProfession(true);
                                                                        try {
                                                                            await ProfessionController.create(
                                                                                new Profession({
                                                                                    id: "",
                                                                                    name: otherDiscipline,
                                                                                    userID: auth.currentUser!.uid,
                                                                                    createdAt: Timestamp.now(),
                                                                                    updatedAt: Timestamp.now(),
                                                                                } as ProfessionInterface)
                                                                            );
                                                                            setOtherProfession("");
                                                                            notification.success({
                                                                                message: "Other profession add Successfull!"
                                                                            });
                                                                        } catch (e: any) {
                                                                            notification.error({
                                                                                message: e.toString(),
                                                                            });
                                                                        }
                                                                        setLoadingAddOtherProfession(false);
                                                                    }}
                                                                >
                                                                    Add
                                                                </Button>
                                                            </Space.Compact>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={24}>
                                                        <Text>Graduate Degrees</Text>
                                                    </Col>

                                                    <Col md={12}>
                                                        <Form.Item
                                                            name="inTheFieldsOfExpertise"
                                                            label='In the fields of expertise:'
                                                        >
                                                            <Select
                                                                mode="multiple"
                                                                filterOption={false}
                                                                showSearch
                                                                allowClear
                                                            >
                                                                {grades.map((option, index) => (
                                                                    <Option key={index} value={option.id}>
                                                                        {option.name.toLocaleUpperCase()}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col md={12}>
                                                        <Form.Item
                                                            name="outTheFieldsOfExpertise"
                                                            label='Out the fields of expertise:'
                                                        >
                                                            <Select
                                                                mode="multiple"
                                                                filterOption={false}
                                                                showSearch
                                                                allowClear
                                                            >
                                                                {grades.map((option, index) => (
                                                                    <Option key={index} value={option.id}>
                                                                        {option.name.toLocaleUpperCase()}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    {/* certifications */}
                                                    <Col md={16}>
                                                        <Form.Item
                                                            name="certifications"
                                                            label={<Space>
                                                                Certifications:
                                                                <Popover
                                                                    content={
                                                                        <p style={{ width: 256 }}>
                                                                            Relevant agency certifications, like
                                                                            ISO, API, NACE, PMP, PE, etc. Do not
                                                                            include courses. These can be mentioned
                                                                            in the &quot;Knowledge and Experience&quot;
                                                                        </p>
                                                                    }
                                                                >
                                                                    <QuestionCircleOutlined />
                                                                </Popover>:
                                                            </Space>}
                                                            rules={[
                                                                { required: true },
                                                            ]}
                                                        >
                                                            <Select
                                                                mode="multiple"
                                                                filterOption={false}
                                                                onSearch={(value: string) => {
                                                                    setSearchCertifications(
                                                                        certifications.filter(
                                                                            item => item.name.toLowerCase().includes(
                                                                                value.toLowerCase()
                                                                            )
                                                                        )
                                                                    );
                                                                }}
                                                                onSelect={() => {
                                                                    setSearchCertifications([]);
                                                                }}
                                                                showSearch
                                                                allowClear
                                                            >
                                                                {!searchCertifications.length
                                                                    ? certifications.map((option, index) => (
                                                                        <Option key={index} value={option.id}>
                                                                            {option.name.toLocaleUpperCase()}
                                                                        </Option>
                                                                    )) :
                                                                    searchCertifications.map((option, index) => (
                                                                        <Option key={index} value={option.id}>
                                                                            {option.name.toLocaleUpperCase()}
                                                                        </Option>
                                                                    ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            label="Other:"
                                                        >
                                                            <Space.Compact style={{ width: '100%' }}>
                                                                <Input
                                                                    value={otherCertifications}
                                                                    placeholder="Enter other certification"
                                                                    onChange={(e) => setOtherCertifications(
                                                                        e.target.value
                                                                    )}
                                                                />
                                                                <Button
                                                                    loading={loadingAddOtherCertifications}
                                                                    disabled={!otherCertifications.length}
                                                                    type="primary"
                                                                    onClick={async () => {
                                                                        setLoadingAddOtherCertifications(true);
                                                                        try {
                                                                            await CertificationController.create(
                                                                                new Certification({
                                                                                    id: "",
                                                                                    name: otherCertifications,
                                                                                    userID: currentUser.uid,
                                                                                    createdAt: Timestamp.now(),
                                                                                    updatedAt: Timestamp.now(),
                                                                                } as CertificationInterface)
                                                                            );
                                                                            setOtherCertifications("");
                                                                            notification.success({
                                                                                message: "Other certification add Successfull!"
                                                                            });
                                                                        } catch (e: any) {
                                                                            notification.error({
                                                                                message: e.toString(),
                                                                            });
                                                                        }
                                                                        setLoadingAddOtherCertifications(false);
                                                                    }}
                                                                >
                                                                    Add
                                                                </Button>
                                                            </Space.Compact>
                                                        </Form.Item>
                                                    </Col>
                                                    {/* Languages */}
                                                    <Col md={24}>
                                                        <Row gutter={16} align="bottom">
                                                            <Col md={22}>
                                                                {languages ? languages.map((language, index) => {
                                                                    return <Row gutter={16} key={index} align='middle'>
                                                                        <Col md={12}>
                                                                            <Form.Item
                                                                                label="Language:"
                                                                            >
                                                                                <Select
                                                                                    value={language.name}
                                                                                    showSearch
                                                                                    onChange={value => {
                                                                                        const lang = langs.filter(item => item.name === value)[0];
                                                                                        const _languages = [...languages];
                                                                                        _languages[index] = new Language({
                                                                                            code: lang.code,
                                                                                            slug: lang.name.toLowerCase(),
                                                                                            name: lang.name,
                                                                                            level: languages[index].level,
                                                                                        });

                                                                                        setLanguages(_languages);
                                                                                    }}
                                                                                >
                                                                                    {langs.map((lang, key) => (
                                                                                        <Option
                                                                                            key={key}
                                                                                            value={lang.name}
                                                                                        >
                                                                                            {lang.name}
                                                                                        </Option>
                                                                                    ))}
                                                                                </Select>
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col md={12}>
                                                                            <Form.Item
                                                                                label="level:"
                                                                            >
                                                                                <Select
                                                                                    value={language.level}
                                                                                    onChange={value => {
                                                                                        const _languages = [...languages];
                                                                                        _languages[index] = new Language({
                                                                                            ...languages[index],
                                                                                            level: value,
                                                                                        });

                                                                                        setLanguages(_languages);
                                                                                    }}
                                                                                >
                                                                                    <Option value='Basic'>
                                                                                        Basic
                                                                                    </Option>
                                                                                    <Option value='Intermediate'>
                                                                                        Intermediate
                                                                                    </Option>
                                                                                    <Option value='Advanced'>
                                                                                        Advanced
                                                                                    </Option>
                                                                                    <Option value='Native'>
                                                                                        Native
                                                                                    </Option>
                                                                                </Select>
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </Row>
                                                                }) : null}
                                                            </Col>
                                                            <Col md={2}>
                                                                <Space size='large'>
                                                                    {languages.length > 1 ?
                                                                        <Button
                                                                            shape='circle'
                                                                            type="primary"
                                                                            style={{
                                                                                display: "flex",
                                                                                justifyContent: "center",
                                                                                alignItems: 'center',
                                                                                marginBottom: 24,
                                                                            }}
                                                                            onClick={() => {
                                                                                const updateLanguages = languages.slice(0, languages.length - 1);
                                                                                setLanguages(updateLanguages);
                                                                            }}
                                                                            danger
                                                                        >
                                                                            <MinusOutlined />
                                                                        </Button> :
                                                                        <div></div>
                                                                    }
                                                                    <Button
                                                                        shape='circle'
                                                                        type="primary"
                                                                        style={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: 'center',
                                                                            marginBottom: 24,
                                                                        }}
                                                                        onClick={() => {
                                                                            const availableLangs = langs.filter(
                                                                                (item) => !languages.map(language => language.code).includes(item.code)
                                                                            );
                                                                            const newLanguage = new Language({
                                                                                code: availableLangs[0].code,
                                                                                name: availableLangs[0].name,
                                                                                level: 'Basic',
                                                                                slug: availableLangs[0].name.toLowerCase(),
                                                                            });

                                                                            setLanguages([...languages, newLanguage]);
                                                                        }}
                                                                        danger
                                                                    >
                                                                        <PlusOutlined />
                                                                    </Button>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    {/* Relevant positions */}
                                                    <Col md={16}>
                                                        <Form.Item
                                                            name="relevantPositions"
                                                            label="Relevant Positions:"
                                                            rules={[
                                                                { required: true },
                                                            ]}
                                                        >
                                                            <Select
                                                                mode="multiple"
                                                                filterOption={false}
                                                                onSearch={(value: string) => {
                                                                    setSearchRelevantPositions(
                                                                        relevantPositions.filter(
                                                                            item => item.name.toLowerCase().includes(
                                                                                value.toLowerCase()
                                                                            )
                                                                        )
                                                                    );
                                                                }}
                                                                onSelect={() => {
                                                                    setSearchRelevantPositions([]);
                                                                }}
                                                                showSearch
                                                                allowClear
                                                            >
                                                                {!searchRelevantPositions.length
                                                                    ? relevantPositions.map((option, index) => (
                                                                        <Option key={index} value={option.id}>
                                                                            {option.name.toLocaleUpperCase()}
                                                                        </Option>
                                                                    )) :
                                                                    searchRelevantPositions.map((option, index) => (
                                                                        <Option key={index} value={option.id}>
                                                                            {option.name.toLocaleUpperCase()}
                                                                        </Option>
                                                                    ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={8}>
                                                        <Form.Item
                                                            label="Other:"
                                                        >
                                                            <Space.Compact style={{ width: '100%' }}>
                                                                <Input
                                                                    value={otherRelevantPositions}
                                                                    placeholder="Enter other relevant position"
                                                                    onChange={(e) => setOtherRelevantPositions(
                                                                        e.target.value
                                                                    )}
                                                                />
                                                                <Button
                                                                    loading={loadingAddOtherRelevantPositions}
                                                                    disabled={!otherRelevantPositions.length}
                                                                    type="primary"
                                                                    onClick={async () => {
                                                                        setLoadingAddOtherRelevantPositions(true);
                                                                        try {
                                                                            await RelevantPositionController.create(
                                                                                new RelevantPosition({
                                                                                    id: "",
                                                                                    name: otherDiscipline,
                                                                                    userID: auth.currentUser!.uid,
                                                                                    createdAt: Timestamp.now(),
                                                                                    updatedAt: Timestamp.now(),
                                                                                } as RelevantPositionInterface)
                                                                            );
                                                                            setOtherRelevantPositions("");
                                                                            notification.success({
                                                                                message: "Other relevant position add Successfull!"
                                                                            });
                                                                        } catch (e: any) {
                                                                            notification.error({
                                                                                message: e.toString(),
                                                                            });
                                                                        }
                                                                        setLoadingAddOtherRelevantPositions(false);
                                                                    }}
                                                                >
                                                                    Add
                                                                </Button>
                                                            </Space.Compact>
                                                        </Form.Item>
                                                    </Col>
                                                    {/* International Experience */}
                                                    <Col md={12}>
                                                        <Form.Item
                                                            name='internationalExperience'
                                                            label='International Experience:'
                                                        >
                                                            <Select
                                                                mode='multiple'
                                                                showSearch
                                                            >
                                                                {countries.map((country, index) => (
                                                                    <Option key={index} value={JSON.stringify(country)}>
                                                                        {country.name}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    {/* Authorized to work in */}
                                                    <Col md={12}>
                                                        <Form.Item
                                                            name='authorizedToWorkIn'
                                                            label='Authorized to work in:'
                                                            rules={[
                                                                { required: true }
                                                            ]}
                                                        >
                                                            <Select
                                                                mode='multiple'
                                                                showSearch
                                                            >
                                                                {countries.map((country, index) => (
                                                                    <Option key={index} value={JSON.stringify(country)}>
                                                                        {country.name}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    {/* Conferences */}
                                                    <Col span={24}>
                                                        <Text>
                                                            Publications / Conferences
                                                        </Text>
                                                    </Col>
                                                    <Col md={24}>
                                                        <Row gutter={16} align="bottom">
                                                            <Col md={22}>
                                                                {conferences ? conferences.map((_, index) => {
                                                                    return <Row gutter={16} key={index} align='middle'>
                                                                        <Col md={4}>
                                                                            <Form.Item
                                                                                label="Quantity:"
                                                                            >
                                                                                <InputNumber
                                                                                    style={{ width: '100%' }}
                                                                                    min={1}
                                                                                />
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col md={20}>
                                                                            <Form.Item
                                                                                label="Topic Description:"
                                                                            >
                                                                                <Input />
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </Row>
                                                                }) : null}
                                                            </Col>
                                                            <Col md={2}>
                                                                <Space size='large'>
                                                                    {conferences.length > 1 ?
                                                                        <Button
                                                                            shape='circle'
                                                                            type="primary"
                                                                            style={{
                                                                                display: "flex",
                                                                                justifyContent: "center",
                                                                                alignItems: 'center',
                                                                                marginBottom: 24,
                                                                            }}
                                                                            onClick={() => {
                                                                                const updateConferences = conferences.slice(0, conferences.length - 1);
                                                                                setConferences(updateConferences);
                                                                            }}
                                                                            danger
                                                                        >
                                                                            <MinusOutlined />
                                                                        </Button> :
                                                                        <div></div>
                                                                    }
                                                                    <Button
                                                                        shape='circle'
                                                                        type="primary"
                                                                        style={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: 'center',
                                                                            marginBottom: 24,
                                                                        }}
                                                                        onClick={() => {
                                                                            const newConference = new Skill({
                                                                                quantity: 1,
                                                                                topicDescription: '',
                                                                            });

                                                                            setConferences([
                                                                                ...conferences,
                                                                                newConference,
                                                                            ]);
                                                                        }}
                                                                        danger
                                                                    >
                                                                        <PlusOutlined />
                                                                    </Button>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    {/* Awards */}
                                                    <Col span={24}>
                                                        <Text>
                                                            Awards / Patents
                                                        </Text>
                                                    </Col>
                                                    <Col md={24}>
                                                        <Row gutter={16} align="bottom">
                                                            <Col md={22}>
                                                                {awards ? awards.map((_, index) => {
                                                                    return <Row gutter={16} key={index} align='middle'>
                                                                        <Col md={4}>
                                                                            <Form.Item
                                                                                label="Quantity:"
                                                                            >
                                                                                <InputNumber
                                                                                    style={{ width: '100%' }}
                                                                                    min={1}
                                                                                />
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col md={20}>
                                                                            <Form.Item
                                                                                label="Topic Description:"
                                                                            >
                                                                                <Input />
                                                                            </Form.Item>
                                                                        </Col>
                                                                    </Row>
                                                                }) : null}
                                                            </Col>
                                                            <Col md={2}>
                                                                <Space size='large'>
                                                                    {awards.length > 1 ?
                                                                        <Button
                                                                            shape='circle'
                                                                            type="primary"
                                                                            style={{
                                                                                display: "flex",
                                                                                justifyContent: "center",
                                                                                alignItems: 'center',
                                                                                marginBottom: 24,
                                                                            }}
                                                                            onClick={() => {
                                                                                const updateAwards = awards.slice(0, awards.length - 1);
                                                                                setAwards(updateAwards);
                                                                            }}
                                                                            danger
                                                                        >
                                                                            <MinusOutlined />
                                                                        </Button> :
                                                                        <div></div>
                                                                    }
                                                                    <Button
                                                                        shape='circle'
                                                                        type="primary"
                                                                        style={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: 'center',
                                                                            marginBottom: 24,
                                                                        }}
                                                                        onClick={() => {
                                                                            const newAward = new Skill({
                                                                                quantity: 1,
                                                                                topicDescription: '',
                                                                            });

                                                                            setAwards([
                                                                                ...awards,
                                                                                newAward,
                                                                            ]);
                                                                        }}
                                                                        danger
                                                                    >
                                                                        <PlusOutlined />
                                                                    </Button>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                    <Col span={24} style={{ marginBottom: 32 }}>
                                                        <Dragger
                                                            name="resume"
                                                            multiple={false}
                                                            maxCount={1}
                                                            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                                            onChange={(info: { file: { name?: any; status?: any; }; fileList: any; }) => {
                                                                const { status } = info.file;
                                                                console.log(info.file);
                                                                setResumeFile(info.file);
                                                            }}
                                                            onDrop={(e: { dataTransfer: { files: any; }; }) => {
                                                                console.log('Dropped files', e.dataTransfer.files);
                                                            }}
                                                        >
                                                            <p className="ant-upload-drag-icon">
                                                                <InboxOutlined />
                                                            </p>
                                                            <p className="ant-upload-text">Click or drag resume to this area to upload</p>
                                                            <p className="ant-upload-hint">
                                                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                                                banned files.
                                                            </p>
                                                        </Dragger>
                                                    </Col>

                                                    <Col span={24}>
                                                        <Row justify="end">
                                                            <Space>
                                                                {currentUser.professionalInfo &&
                                                                    <Button
                                                                        loading={loadingSaveButton}
                                                                        htmlType="submit"
                                                                        type="primary"
                                                                    >
                                                                        SAVE
                                                                    </Button>
                                                                }
                                                                <Button
                                                                    loading={loadingSaveButton}
                                                                    onClick={async () => {
                                                                        try {
                                                                            await professionalInfoForm.validateFields();
                                                                            const success = await onFinishProfessionalInfo(
                                                                                professionalInfoValues
                                                                            );
                                                                            if (success) {
                                                                                setTabIndex('3');
                                                                            }
                                                                        } catch (e: any) {
                                                                            professionalInfoForm.submit();
                                                                        }
                                                                    }}
                                                                    type="primary"
                                                                >
                                                                    SAVE AND NEXT
                                                                </Button>
                                                            </Space>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                },
                                {
                                    label: "Financial Information",
                                    key: "3",
                                    disabled: !currentUser.professionalInfo,
                                    children: <Row>
                                        <Col span={24}>
                                            <Row justify={"center"}>
                                                <Title level={4}>
                                                    Financial Information
                                                </Title>
                                            </Row>
                                            <br />
                                            <Form
                                                form={financialInfoForm}
                                                name="financialInfoForm"
                                                initialValues={{
                                                    useHomeAddress: true,
                                                    phoneCode: "+1",
                                                    ...currentUser.financialInfo,
                                                }}
                                                layout="vertical"
                                                onFinish={onFinishFinancialInfo}
                                            >
                                                <Row gutter={16}>
                                                    <Col md={24}>
                                                        <Form.Item
                                                            name="useHomeAddress"
                                                            valuePropName="checked"
                                                            style={{ width: "100%" }}
                                                        >
                                                            <Checkbox>
                                                                Same as Home address
                                                            </Checkbox>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                {financialInfoFormValues?.useHomeAddress ? (
                                                    <Row gutter={16}>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                label="First Name:"
                                                            >
                                                                <Input
                                                                    value={currentUser.firstName}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                label="Middle Name:"
                                                            >
                                                                <Input
                                                                    value={currentUser.middleName}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                label="Last Name:"
                                                            >
                                                                <Input
                                                                    value={currentUser.lastName}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={16}>
                                                            <Form.Item
                                                                label="Street Address:"
                                                            >
                                                                <Input
                                                                    value={currentUser.personalInfo?.street}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                label="Apartment, suite, etc.:"
                                                            >
                                                                <Input
                                                                    value={currentUser.personalInfo?.appartment}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                label="City:"
                                                            >
                                                                <Input
                                                                    value={currentUser.personalInfo?.city}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                label="State/Province:"
                                                            >
                                                                <Input
                                                                    value={currentUser.personalInfo?.state}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                label="Zip Code:"
                                                            >
                                                                <Input
                                                                    value={currentUser.personalInfo?.zipCode}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={12}>
                                                            <Form.Item
                                                                label="Country:"
                                                            >
                                                                <Input
                                                                    value={currentUser.personalInfo?.country}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={12}>
                                                            <Form.Item
                                                                label="phone:"
                                                            >
                                                                <Input
                                                                    value={currentUser.phone}
                                                                    disabled
                                                                    readOnly
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ) : (
                                                    <Row gutter={16}>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                name="firstName"
                                                                label="First Name:"
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input
                                                                    placeholder="Enter your first name"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                name="middleName"
                                                                label="Middle Name:"
                                                            >
                                                                <Input
                                                                    placeholder="Enter your middle name"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                name="lastName"
                                                                label="Last Name:"
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input
                                                                    placeholder="Enter your last name"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={16}>
                                                            <Form.Item
                                                                name="street"
                                                                label="Street Address:"
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input
                                                                    placeholder="Enter your street address"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                name="appartment"
                                                                label="Apartment, suite, etc.:"
                                                            >
                                                                <Input
                                                                    placeholder="Enter your apartment, suite, etc."
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                name="city"
                                                                label="City:"
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input
                                                                    placeholder="Enter your city"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                name="state"
                                                                label="State/Province:"
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input
                                                                    placeholder="Enter your state/province"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Form.Item
                                                                name="zipCode"
                                                                label="Zip Code:"
                                                                rules={[{ required: true }]}
                                                            >
                                                                <Input
                                                                    placeholder="Enter your zip code"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={12}>
                                                            <Form.Item
                                                                name="country"
                                                                label="Country:"
                                                                initialValue="US"
                                                            >
                                                                <Select
                                                                    showSearch
                                                                    onSearch={(value) => {
                                                                        if (value) {
                                                                            setSearchCountries([
                                                                                ...countries.filter(
                                                                                    item => item.name.toLowerCase().includes(value.toLowerCase()),
                                                                                ),
                                                                            ]);
                                                                        } else {
                                                                            setSearchCountries([]);
                                                                        }
                                                                    }}
                                                                    options={(searchCountries.length > 0 ?
                                                                        searchCountries :
                                                                        countries).map((item) => {
                                                                            return {
                                                                                value: item.abbreviation,
                                                                                label: item.name,
                                                                            }
                                                                        })}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col md={12}>
                                                            <Space.Compact style={{ width: "100%" }}>
                                                                <Form.Item
                                                                    name="phoneCode"
                                                                    label="Phone:"
                                                                    style={{ width: 230 }}
                                                                >
                                                                    <Select
                                                                        options={phoneCodes.map((item) => {
                                                                            return {
                                                                                value: item.code,
                                                                                label: (
                                                                                    <>
                                                                                        <Image
                                                                                            src={item.flagURL}
                                                                                            width={16}
                                                                                            height={16}
                                                                                            alt={item.name}
                                                                                            style={{ marginBottom: 2 }}
                                                                                        />
                                                                                        {" "}{item.name}
                                                                                    </>
                                                                                ),
                                                                            }
                                                                        })}
                                                                    />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    name="phone"
                                                                    label=" "
                                                                    style={{ width: "100%" }}
                                                                    rules={[{ required: true }]}
                                                                >
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Enter your phone number"
                                                                        prefix={financialInfoFormValues?.phoneCode}
                                                                        onChange={(e) => {
                                                                            if (e.target.value !== "+") {
                                                                                const value = parseInt(e.target.value.split(selectedPhoneCode)[1].substring(0, 10));
                                                                                const formatter = `${selectedPhoneCode}${isNaN(value) ? "" : value}`;
                                                                                setPhoneNumber(formatter);
                                                                            }
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Space.Compact>
                                                        </Col>
                                                    </Row>
                                                )}
                                                <Divider />
                                                <Row gutter={16}>
                                                    <Col md={24}>
                                                        <Form.Item
                                                            name="paypalAccount"
                                                            label="PayPal Account:"
                                                            style={{ width: "100%" }}
                                                        >
                                                            <Space.Compact style={{ width: "100%" }}>
                                                                <Input
                                                                    placeholder="Enter your email"
                                                                />
                                                                <Button
                                                                    href="https://www.paypal.com/webapps/mpp/account-selection"
                                                                    target="_blank"
                                                                >
                                                                    Create PayPal Account
                                                                </Button>
                                                            </Space.Compact>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={24}>
                                                        <Row justify="end">
                                                            <Button
                                                                loading={loadingSaveButton}
                                                                htmlType="submit"
                                                                type="primary"
                                                            >
                                                                SAVE
                                                            </Button>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                },
                            ]}
                        />
                    </Card>
                </Container>
            </MainLayout>
        );
}