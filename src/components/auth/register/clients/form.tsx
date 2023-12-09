"use client";

import { countries, langs } from "@/constants/langs";
import BusinessTypeController from "@/services/bussiness/index";
import { firestore } from "@/firebase/config";
import BusinessType from "@/models/business-type";
import Discipline, { DisciplineInterface } from "@/models/disciplines";
import Subscription from "@/models/subscription";
import { Button, Form, Input, Select, Space, Badge, notification, Checkbox } from "antd";
import { useForm } from "antd/lib/form/Form";
import { DocumentData, Query, QuerySnapshot, Timestamp, collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";

import 'antd/dist/reset.css';

const labelStyle = 'original';
const timezones = {
  ...allTimezones,
}

const { Option } = Select;

export default function FormRegistreClient({
  subscription
}: { subscription: Subscription }) {
  const [_formKey] = useForm();

  const [acceptedAgreement, setAcceptedAgreement] = useState<boolean>();

  const [loadingBusinessType, setLoadingBusinessType] = useState<boolean>(true);
  const [loadingAddOtherBusinessType, setLoadingAddOtherBusinessType] = useState<boolean>(false);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [searchBusinessTypes, setSearchBusinessTypes] = useState<BusinessType[]>([]);
  const [otherBusinessTypes, setOtherBusinessTypes] = useState<string>("");
  const [tempBusinessType, setTempBusinessType] = useState<BusinessType[]>([]);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState("");
  const [phoneCodes, setPhoneCodes] = useState<any[]>([]);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState("");
  const [selectedAlternatePhoneCode, setSelectedAlternatePhoneCode] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [rewriteEmail, setRewriteEmail] = useState<string>("");

  const { options, parseTimezone } = useTimezoneSelect({ labelStyle, timezones });

  // Interests and languages
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [tempDisciplines, setTempDisciplines] = useState<Discipline[]>([]);
  const [otherDiscipline, setOtherDiscipline] = useState<string>("");
  const [searchDisciplines, setSearchDisciplines] = useState<Discipline[]>([]);
  const [loadingAddOtherDiscipline, setLoadingAddOtherDiscipline] = useState<boolean>(false);

  const [selectedSubscription, setSelectedSubscription] = useState<string>(subscription?.id ?? "");

  useEffect(() => {
    getPhoneCodes();
    if (subscription.subsubscriptions.length) {
      setSelectedSubscription("0");
    }

    const unsubscribeDisciplines = onSnapshot(
      query(
        collection(firestore, Discipline.collectionPath),
        where(
          "userID",
          "==",
          "admin",
        ),
        orderBy("name"),
      ),
      (event: any) => {
        setDisciplines([
          ...event.docs.map((document: DocumentData) => {
            return new Discipline({
              ...document.data() as Discipline,
              id: document.id,
            });
          })
        ]);
      }
    );

    getBusinessTypes();

    return () => {
      unsubscribeDisciplines();
    }
  }, [subscription.subsubscriptions.length]);

  const getBusinessTypes = async () => {
    setLoadingBusinessType(true);
    try {
      const types = await BusinessTypeController.getAll();
      setBusinessTypes(types);
    } catch (error: any) {
      notification.error({
        message: error.toString(),
      });
    }
    setLoadingBusinessType(false);
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

  return (
    <Form
      form={_formKey}
      name="register_client"
      layout="vertical"
      className="tw-flex tw-flex-col tw-space-y-4 m-4"
    >
      {subscription.type === "multiple" && <div className="tw-p-3" style={{
        border: "solid 1px rgba(0, 0, 0, 0.15)"
      }}>
        <h4 className="p-3">BUSINESS INFORMATION</h4>
        <div className="tw-grid md:tw-grid-cols-3 tw-gap-2 p-3">
          <div>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter the company name" />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="businessTypes"
              label="Business Types"
            >
              <Select
                loading={loadingBusinessType}
                placeholder="Select Business Types"
                filterOption={false}
                showSearch
                allowClear
                onSearch={(search) => {
                  setSearchBusinessTypes(
                    [...businessTypes, ...tempBusinessType].filter(
                      item => item.name.toLowerCase().includes(
                        search.toLowerCase()
                      )
                    )
                  );
                }}
                options={searchBusinessTypes.length > 0 ?
                  searchBusinessTypes.map(
                    (item) => {
                      return {
                        value: item.id,
                        label: item.name,
                      }
                    }
                  ) :
                  [...businessTypes, ...tempBusinessType].map(
                    (item) => {
                      return {
                        value: item.id,
                        label: item.name,
                      }
                    }
                  )
                }
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Anoher:"
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={otherBusinessTypes}
                  placeholder="Enter other business type"
                  onChange={(e) => setOtherBusinessTypes(
                    e.target.value
                  )}
                />
                <Button
                  loading={loadingAddOtherBusinessType}
                  disabled={!otherBusinessTypes.length}
                  type="primary"
                  className="remove-all"
                  onClick={async () => {
                    setLoadingAddOtherBusinessType(true);
                    const newList: BusinessType[] = tempBusinessType;
                    newList.push(new BusinessType({
                      id: "",
                      name: otherBusinessTypes,
                      userID: "",
                      createdAt: Timestamp.now(),
                      updatedAt: Timestamp.now(),
                    }));
                    setTempBusinessType([
                      ...newList,
                    ]);
                    setOtherBusinessTypes("");
                    notification.success({
                      message: "Other business type successfull!"
                    });
                    setLoadingAddOtherBusinessType(false);
                  }}
                >
                  Add
                </Button>
              </Space.Compact>
            </Form.Item>
          </div>
        </div>
      </div>}

      {subscription.type === "dual" && <div className="tw-p-3" style={{
        border: "solid 1px rgba(0, 0, 0, 0.15)"
      }}>
        <h4>INSTITUTE ID</h4>
        <Form.Item
          name="instituteName"
          label="Institute Name:"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Enter the institute name"
          />
        </Form.Item>
        <Form.Item
          name="domainsOfInstitute:"
          label="Domains of institute:"
          rules={[{ required: true }]}
          extra="This plan will work for emails with these domains only"
        >
          <Space.Compact>
            <Input
              placeholder="l.e. domain.com, .org, .edu"
            />
          </Space.Compact>
        </Form.Item>
      </div>}

      <div className="tw-p-3 my-2" style={{
        border: "solid 1px rgba(0, 0, 0, 0.15)"
      }}>
        <h4 className="p-3">CONTACT INFORMATION</h4>
        <div className="tw-grid md:tw-grid-cols-3 tw-gap-2 p-3">
          <div>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true }
              ]}
            >
              <Input
                placeholder="Enter your first name"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="middleName"
              label="Middle Name:"
              rules={[
                { required: true }
              ]}
            >
              <Input
                placeholder="Enter your first name"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="lastName"
              label="Last Name:"
              rules={[
                { required: true }
              ]}
            >
              <Input
                placeholder="Enter your first name"
              />
            </Form.Item>
          </div>
          <div className="tw-col-span-2">
            <Form.Item
              name="email"
              label="Email:"
              rules={[
                { required: true }
              ]}
            >
              <Input
                placeholder="Enter your email address"
                onChange={(e) => setRewriteEmail(e.target.value)}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Phone"
              style={{
                display: "inline",
              }}
              rules={[{ required: true }]}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Select
                  style={{ width: "40%", float: "left" }}
                  value={selectedPhoneCode}
                  onChange={(value) => {
                    setPhoneNumber(value);
                    setSelectedPhoneCode(value);
                  }}
                >
                  {
                    phoneCodes.map((item, index) => (
                      <Option key={index} value={item.code} className="tw-flex">
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
                  value={phoneNumber}
                  style={{ width: "60%" }}
                  type="text"
                  prefix={selectedPhoneCode}
                  placeholder="Enter your phone number"
                  onChange={(e) => {
                    if (e.target.value !== "+") {
                      const value = parseInt(e.target.value.split(selectedPhoneCode)[1].substring(0, 10));
                      const formatter = `${selectedPhoneCode}${isNaN(value) ? "" : value}`;
                      setPhoneNumber(formatter);
                    }
                  }}
                />
              </Space.Compact>
            </Form.Item>
          </div>
          <div className="tw-col-span-2">
            <Form.Item
              name="alternateEmail"
              label="Alternate Email"
              rules={[
                { required: true }
              ]}
            >
              <Input
                placeholder="Enter your alternate email address"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="alternatePhone"
              label="Alternate Phone:"
              className="experttis-input"
              style={{
                display: "inline"
              }}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Select
                  style={{ width: "40%", float: "left" }}
                  value={selectedAlternatePhoneCode}
                  onChange={(value) => {
                    setAlternatePhoneNumber(value);
                    setSelectedAlternatePhoneCode(value);
                  }}
                >
                  {
                    phoneCodes.map((item, index) => (
                      <Option key={index} value={item.code} className="tw-flex">
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
                  value={alternatePhoneNumber}
                  style={{ width: "60%" }}
                  type="text"
                  prefix={selectedAlternatePhoneCode}
                  placeholder="Enter your alternate phone number"
                  onChange={(e) => {
                    if (e.target.value !== "+") {
                      const value = parseInt(e.target.value.split(selectedPhoneCode)[1].substring(0, 10));
                      const formatter = `${selectedPhoneCode}${isNaN(value) ? "" : value}`;
                      setAlternatePhoneNumber(formatter);
                    }
                  }}
                />
              </Space.Compact>
            </Form.Item>
          </div>
          <div className="tw-col-span-3">
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
          </div>
        </div>
      </div>
      <div className="tw-p-3 my-2" style={{
        border: "solid 1px rgba(0, 0, 0, 0.15)"
      }}>
        <h4 className="p-3">ADDRESS INFORMATION</h4>
        <div className="tw-grid lg:grid-cols-4 tw-gap-2 p-3">
          <div className="tw-flex tw-flex-col tw-col-span-4">
            <Form.Item
              name="street"
              label="Street Address:"
              rules={[{ required: true }]}
            >
              <Input placeholder="Street and number, P.O. box, c/o." />
            </Form.Item>
            <Form.Item
              name="aparment"
            >
              <Input placeholder="Apartment, suite, unit, building, floor, etc." />
            </Form.Item>
          </div>
          <Form.Item
            name="city"
            label="City:"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter your address city" />
          </Form.Item>
          <Form.Item
            name="state"
            label="State:"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter your address state" />
          </Form.Item>
          <Form.Item
            name="zipCode"
            label="Zip Code:"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter your zip code" />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country:"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select your Country"
              showSearch
              allowClear
              options={countries.map(
                (item) => {
                  return {
                    label: item.name,
                    value: item.name,
                  }
                }
              )}
            />
          </Form.Item>
        </div>
      </div>
      <div className="tw-p-3 my-2" style={{
        border: "solid 1px rgba(0, 0, 0, 0.15)"
      }}>
        <h4 className="p-3">INTERESTS AND LANGUAGES</h4>
        <div className="tw-grid lg:tw-grid-cols-3 tw-gap-2">
          <div className="tw-col-span-2 px-3">
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
                  ? disciplines.concat(tempDisciplines).map((option, index) => (
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
          </div>
          <div className="px-3">
            <Form.Item
              label="Another:"
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
                  className="remove-all"
                  onClick={async () => {
                    setLoadingAddOtherDiscipline(true);
                    const newList: Discipline[] = tempDisciplines;
                    newList.push(new Discipline({
                      id: "",
                      name: otherDiscipline,
                      userID: "",
                      createdAt: Timestamp.now(),
                      updatedAt: Timestamp.now(),
                    } as DisciplineInterface));
                    setTempDisciplines([
                      ...newList,
                    ]);
                    setOtherDiscipline("");
                    notification.success({
                      message: "Other discipline add Successfull!"
                    });
                    setLoadingAddOtherDiscipline(false);
                  }}
                >
                  Add
                </Button>
              </Space.Compact>
            </Form.Item>
          </div>
          <div className="tw-col-span-3 px-3">
            <p>Preference language</p>
          </div>
          <div className="px-3">
            <Form.Item
              name="1stOption"
              label="1st Option:"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select a Language"
                showSearch
                allowClear
                options={langs.map((item) => {
                  return {
                    value: item.name,
                    lable: item.name,
                  }
                })}
              />
            </Form.Item>
          </div>
          <div className="px-3">
            <Form.Item
              name="2stOption"
              label="2st Option:"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select a Language"
                showSearch
                allowClear
                options={langs.map((item) => {
                  return {
                    value: item.name,
                    lable: item.name,
                  }
                })}
              />
            </Form.Item>
          </div>
          <div className="px-3">
            <Form.Item
              name="3stOption"
              label="3st Option:"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select a Language"
                showSearch
                allowClear
                options={langs.map((item) => {
                  return {
                    value: item.name,
                    lable: item.name,
                  }
                })}
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className="tw-p-3 my-2" style={{
        border: "solid 1px rgba(0, 0, 0, 0.15)"
      }}>
        <h4 className="p-3">SUBSCRIPTION INFORMATION</h4>
        <div className="tw-grid lg:tw-grid-cols-3 gap-2 px-3">
          {subscription.type !== "dual" && <div className="tw-col-span-3">
            <Select
              className="tw-w-full"
              value={selectedSubscription}
              options={subscription.subsubscriptions.length > 0 ? subscription.subsubscriptions.map(
                (item, index) => {
                  return {
                    value: index.toString(),
                    label: item.title,
                  }
                }
              ) : [{
                value: subscription.id,
                label: subscription.title,
              }]}
              onChange={(value) => {
                setSelectedSubscription(value)
              }}
            />
          </div>}
          <div className="tw-col-span-2 px-3">
            <h4 className="p-2 text-sm">
              {
                subscription.subsubscriptions.length ?
                  subscription.subsubscriptions[parseInt(selectedSubscription)]?.title?.toUpperCase() :
                  subscription.title?.toUpperCase()
              }
              PLAN
            </h4>
            <p>
              {
                subscription.subsubscriptions.length ?
                  subscription.subsubscriptions[parseInt(selectedSubscription)]?.description :
                  subscription.description
              }
            </p>
          </div>
          <div className="tw-flex tw-flex-col tw-items-end">
            <Badge.Ribbon text="Annual" color="red">
              <div className="tw-mt-7">
                <h4>
                  {subscription.subsubscriptions.length ?
                    subscription.subsubscriptions[parseInt(selectedSubscription)]?.visiblePrice?.split(' ')[0]?.toUpperCase() + " " +
                    subscription.subsubscriptions[parseInt(selectedSubscription)]?.visiblePrice?.split(' ')[1]?.toUpperCase() :
                    subscription.visiblePrice?.split(' ')[0] + " " +
                    subscription.visiblePrice?.split(' ')[1]
                  }
                </h4>
              </div>
            </Badge.Ribbon>
          </div>
        </div>
      </div>
      <div className="tw-p-3 my-2 p-3" style={{
        border: "solid 1px rgba(0, 0, 0, 0.15)"
      }}>
        <h4>SIGN UP</h4>
        <div className="tw-grid lg:tw-grid-cols-3 tw-gap-2">
          <Form.Item
            label="Username:"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password:"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </div>
      </div>
      <div className="tw-p-3 my-2 agreement" style={{
        border: "solid 1px rgba(0, 0, 0, 0.15)"
      }}>
        <h4>REGISTRATION AGREEMENT</h4>
        <div className="tw-overflow-auto tw-w-full tw-h-64 tw-p-3 terms" style={{
          border: "solid 1px rgba(0, 0, 0, 0.15)"
        }}>

          <h3><u>EXPERTTIS PLATFORM TERMS AND CONDITIONS FOR CONSULTANTS</u></h3>
          <p><br /></p>
          <p>Please read these Terms and Conditions carefully as this is a legally binding contract between you and ENGINEXT CORPORATION (&ldquo;ENGINEXT&rdquo;). These Terms and Conditions of membership in Experttis&rsquo; web-based platform (the &ldquo;Experttis Platform&rdquo;) govern your relationship with Experttis and the Clients (defined below). &nbsp;These Terms and Conditions are referred to as &ldquo;the Agreement&rdquo;. &nbsp;The most recent and up-to-date version of these Terms and Conditions is located at&nbsp;<a href="https://www.experttis.com/">https://www.experttis.com</a> and will supersede all prior versions of the Terms and Conditions previously in effect between ENGINEXT and you. The use of Experttis Platform website is governed by its Terms of Use. To the extent there is any conflict between these Terms and Conditions and the Terms of Use, these Terms and Conditions will control.</p>
          <p>The Experttis Platform serves as a mean of search and communication that facilitates consultations (&ldquo;Consultations&rdquo;) between its Clients and professionals from a variety of fields, institutions &nbsp;and industries (&ldquo;Consultants&rdquo;) who are willing to provide knowledge, orientation &nbsp;and insight to&nbsp;<em>companies, organizations and/or individual clients</em> (collectively, &quot;Clients,&quot;). These consulting services will be provided by communicating exclusively through the Experttis Platform (&ldquo;Consultations&rdquo;).</p>
          <p>In this Agreement &ldquo;Client&rdquo; means a party who engages a Consultant using the Experttis&rsquo; Platform, in order to consult with this Consultant (for these purposes &ldquo;Client&rdquo; includes any party appointed by the Client to engage in a Consultation on its behalf).</p>
          <ol>
            <li><strong>Consultations</strong></li>
          </ol>
          <p>1.1 By agreeing to participate in a Consultation you confirm that you understand and are knowledgeable about the proposed subject matter and the details on the matter provided by Client, including the verification of any potential conflicts, or other reasons that could prevent you from providing the Consultation, and that you will undertake the Consultation diligently, professionally and to the best of your ability.</p>
          <p>1.2 During a Consultation you will be acting in your personal capacity, as an independent contractor, and not as an employee or representative of ENGINEXT or any other party.</p>
          <p>1.3 If at any time before, during or after a Consultation you become aware of any legal, professional, regulatory or ethical conflict or other reason why you should not participate/have participated in a Consultation, you should terminate the Consultation and notify ENGINEXT immediately by contacting Experttis Administration using Experttis Platform email system.</p>
          <p>1.4 &nbsp;<strong>IT IS YOUR RESPONSABILIYT TO INDENTIFY ANY CONFLICTS OR REASONS THAT WOULD PREVENT YOU FROM RENDERING THE CONSULTATION BEFORE ACCEPTING THE CONSULTATION. IF YOU MUST TERMINATE A CONSULTATION &nbsp;EARLY DUE TO THIS CONFLICTS OR REASONS, YOU WILL NOT BE PAID FOR YOUR TIME OR FOR ANY FEES RELATED TO THIS CONSULTATION.</strong></p>
          <ol start={2}>
            <li><strong>Confidential Information</strong></li>
          </ol>
          <p><em>Information you hold</em></p>
          <p>2.1 You will not disclose any (i)&nbsp;<strong>confidential information</strong> or (ii) any&nbsp;<strong>material</strong> <strong>non-public information</strong> concerning a quoted company, security or instrument or any trade secret&nbsp;<strong>&ndash;&nbsp;<u>please note that</u>:</strong></p>
          <p><strong>&ldquo;confidential information&rdquo;&nbsp;</strong>includes, but is not limited to: (i) confidential or proprietary information about your current (or a former) employer; (ii) trade secrets; (iii) financial information, such as margins or revenues, not publicly released; (iv) any other information which you are under a duty to keep confidential; and (v) identities of Experttis Platform users and ENGINEXT owner clients, or the subject matter of any Consultation;</p>
          <p><strong>&ldquo;material non-public information&rdquo;&nbsp;</strong>(&ldquo;MNPI&rdquo;), sometimes referred to as &ldquo;inside information&rdquo;, is a specific type of confidential information. MNPI is information that is not generally available and there is a substantial likelihood that a reasonable investor would consider it important to an investment decision. If this information was generally available, it could significantly affect the price of an investment or significantly alter the total mix of information available to investors. MNPI includes but is not limited to: (i) financial information or results before they are made public; (ii) non-public information regarding a merger, divestiture, or material contract; and (iii) information relating to unpublished clinical trials</p>
          <p><em>Information you receive through Experttis Platform or our Clients</em></p>
          <p>2.2 You will keep confidential, not disclose to any third party or use for any purpose, any confidential information disclosed to you before, during or after a Consultation, including without limitation the identity of a Client, the subject matter of any Consultation or the questions asked during a Consultation and the rates either set or agreed by you at the Experttis Platform for of any Consultation.</p>
          <p><em>General</em></p>
          <p>2.3 You agree that a breach of this clause 2 may cause irreparable harm to ENGINEXT and/or the Client and that damages would not be a sufficient remedy in respect of such breach. Without prejudice to any other rights which it may have, Experttis and/or the relevant Client shall be entitled to seek injunctive relief and other applicable equitable remedies in respect of any such breach.</p>
          <ol start={3}>
            <li><strong>Your obligations</strong></li>
          </ol>
          <p>3.1 By joining the Experttis Platform you represent, warrant and undertake that:</p>
          <ul>
            <li>the biographical information provided by you to the Experttis Platform is up to date, true and not misleading and you will update it in respect of any material changes (including any change to your employment);</li>
            <li>you will not participate in any Consultation which principally relates to any company of which you are an employee, officer, director, contractor, agent, legal representative, partner, or joint venturer, nor will you provide information to any Client if a company of which you are an employee, officer, director, contractor, agent, legal representative, partner, or joint venturer could reasonably consider such information to be proprietary, confidential, or constitute a trade secret, or if the disclosure of such information could reasonably be expected to cause damage to the company;</li>
            <li>you will not knowingly participate in any Consultation for a Client that is (or is acting on behalf of) a competitor of your current employer or a company for which you serve as an officer or director;</li>
            <li>you are not restricted from and have the necessary permissions to engage in each Consultation. For example, if you are employed, your contract of employment or employer&rsquo;s policies may require you to obtain your employer&rsquo;s prior consent to engage in Consultations;</li>
            <li>you will inform ENGINEXT if you are (or have been during the past 3 years) an employee or advisor or consultant to any government, government department, government agency or to any state entity;</li>
            <li>if you are a government official or employee, you will not discuss government legislation, regulation, policy, contracts or any other business that you, as a government official or employee, would be able to vote upon or otherwise influence;</li>
            <li>you will inform ENGINEXT if you are currently involved with any clinical trial or test or have been so involved where the results of such trial or test have not been publicly disclosed;</li>
            <li>if you are a medical, biological, chemical, toxicological, professional, you will not discuss unpublished clinical and any laboratory results or reports, patient experience information or any other information regarding trials which is not yet public;</li>
            <li>you have not been found guilty of insider dealing, market abuse, money laundering, fraud or any offence involving dishonesty or any felony (or similar offences in any jurisdiction) and have not been subject to any order, judgment, action or investigation by any regulatory body; further you will immediately inform ENGINEXT should you become aware of any investigation involving, or any charge brought against you in respect of, any offence referred to in this clause 3.1(i);</li>
            <li>you will not provide any investment, legal, financial, accountancy, or medical advice to any Client including, without limitation, recommending, rating or valuing any security or providing advice regarding the investment in, purchase or sale of any securities;</li>
            <li>if you are an auditor or a former auditor, you will not comment on any company you have audited in the three (3) years prior to the Consultation;</li>
            <li>you will not participate in any Consultation at any time while your employer is the subject of a tender offer or is in the process of an Initial Public Offering, if the subject of the consultation is either directly or indirectly related to the tender or the IPO;</li>
            <li>you will not participate in any Consultation or provide any information that would result in: (i) a breach of applicable laws or regulation, (ii) a breach of any agreement or any obligation to a third party (including to your employer or any institution you are linked to and/or with links to the nature of the consultancy), (iii) a professional, regulatory or ethical conflict, or (iv) if there is any other reason why you should not participate in such Consultation or provide such information;</li>
            <li>you will in connection with Consultations: (i) comply with all applicable laws, statutes, regulations and codes relating to anti-bribery and anti-corruption, (&ldquo;Relevant Requirements&rdquo;); (ii) not to engage in any activity, practice or conduct which would constitute an offence under the Relevant Requirements; (iii) not to do anything that will cause or lead ENGINEXT or any of its Clients to be in breach of any Relevant Requirements;</li>
            <li>you must not take any Client or other third party to any location with a connection or association with the subject matter of the Consultation which is not publicly accessible without the prior written permission (in a form acceptable to ENGINEXT) from the person or company which owns the property; and</li>
            <li>ENGINEXT will not restrict you from accepting an offer of employment from any of the Clients.</li>
            <li>you are prohibited from providing and/or receiving anything of value to or from any government official (including any employee or representative of a government-owned entity), or any other person or entity, in return for an unfair business advantage, any type of favorable treatment, to induce or reward the improper performance of a function or activity, or other improper benefit to ENGINEXT or the Clients. You must be aware of, and comply with, the international anti-bribery laws and regulations, including, but not limited to, the U.S. Foreign Corrupt Practices Act (FCPA) and the U.K. Bribery Act.</li>
            <li>If you are a healthcare professional and participating in any trials you must not discuss patient specific information or trial information not yet publicly available. Data Safety Monitoring Board Members, Scientific Advisory Board members, and trial sponsor employees are not permitted to participate in Research Services about ongoing trials or unpublished information.</li>
            <li>If you are an attorney or auditor you shall not participate in any Consultations that are about current clients or any clients to whom you, or your firm, owes a duty of confidentiality.</li>
            <li>You agree not to provide any investment advice to ENGINEXT or the Clients, including, without limitation, any ratings or securities recommendations.</li>
            <li>While participating in Consultations, you must not provide any legal, medical, or accounting advice.</li>
          </ul>
          <p>&nbsp;</p>
          <p>3.2 &nbsp; &nbsp; &nbsp; You are free to accept or decline any offer to provide a Consultation in your sole discretion, provided, however, that you may accept only consultations (a) that do not present a conflict of interest; (b) that relate to matters that you are permitted to discuss under applicable law and subject to any obligations you may have (including contractual, employment, or otherwise) and (c) that relate to topics about which you are knowledgeable.</p>
          <p>3.3 &nbsp; &nbsp; &nbsp; You are expected to respond to a Client request for a proposed Consultation within 48 hours of receiving the corresponding electronic notification in the Experttis Platform. You are never obligated to accept any Client request to participate in a Consultation.In case you &nbsp;accept the request, &nbsp;you must verify if you fit Client&rsquo;s requirements by contacting the Client through the Experttis Platform messaging system. Once you have verified your suitability for the Consultation, you may direct the Client to use the Experttiss Platform booking system to schedule the Consultancy. At this point you must verify your availability by using your dashboard in the Experttis Platform. The Consultation shall be carried on throught the comunicaiton tools set forth in the Expettis Platform (i.e., calls &ldquo;Expert Phone&rdquo;, or chat &ldquo;Expert Chat&rdquo; systems).</p>
          <p>3.4 &nbsp; &nbsp; &nbsp; You agree that you will include in the Experttis Platform accurate current and historical Personal Information (as defined herein) regarding your education, experience, employment and you agree to update this information in a timely manner at the &nbsp;Experttis Platform in the event this information changes, and to ensure that such information is up to date prior to providing any Consultations.</p>
          <ol start={4}>
            <li><strong>Intellectual Property</strong></li>
          </ol>
          <p>4.1 &nbsp; &nbsp; &nbsp; In this clause 4 &ldquo;Intellectual Property&rdquo; means all patents, rights to inventions, utility models, copyright and related rights, trademarks, service marks, trade, business and domain names, rights in goodwill or to sue for passing off, rights in designs, rights in computer software, database rights, topography rights, rights in confidential information and any other intellectual property rights, whether registered or unregistered, and including all applications and renewals in any part of the world.</p>
          <p>4.2 &nbsp; &nbsp; &nbsp; All Intellectual Property rights in any material, provided to you by Experttis or contained on the Experttis website belong to ENGINEXT and may not be reproduced or redistributed.</p>
          <p>4.3 &nbsp; &nbsp; &nbsp; You will not provide any information or materials in or after any Consultation that may infringe, misappropriate or conflict with the Intellectual Property rights of any third party.</p>
          <p>4.4 &nbsp; &nbsp; &nbsp; Unless otherwise agreed with a Client in writing, you warrant that any documentation or any other material (including without limitation reports, studies, data, diagrams, charts, specifications, and programs) (&ldquo;Work Product&rdquo;) provided by you to a Client are original works and do not infringe any third party&rsquo;s Intellectual Property rights and you hereby agree to grant to the Client (and/or Client&rsquo;s client) to which you supply such Work Products a non-exclusive, royalty-free, perpetual licence to use any and all Intellectual Property rights subsisting in such Work Products in the course of its business.</p>
          <p>4.5 &nbsp; &nbsp; &nbsp; You will indemnify ENGINEXT against all liabilities it may incur in connection with any claims or proceedings brought against it based on a claim that the Work Product provided to a Client infringes any Intellectual Property rights or other proprietary rights of any third party.</p>
          <p>4.6 &nbsp; &nbsp; &nbsp; You must not use the name &quot;Experttis&quot; or any other trademark, symbol or logo of Experttis without ENGINEXT prior written consent.</p>
          <ol start={5}>
            <li><strong>Data Protection and Telephone Recording</strong></li>
          </ol>
          <p>5.1 You have read and agree to Experttis&rsquo;s Privacy Policy set forth in this Agreement<u>.</u></p>
          <p>5.2 You consent to the recording for compliance or quality control purposes of conversations either by phone or chat between you and ENGINEXT, and you and Clients during Consultations, (you will be notified in advance if a recording is being made). You agree, to the extent permitted by applicable law, that such recordings may be submitted in evidence in any proceedings.</p>
          <ol start={6}>
            <li><strong>Payment</strong></li>
          </ol>
          <p>6.1. Experttis Platform will provide a recommended range for you to decide the most convenient rate for your consultancies. You are free to establish your rate either at the minimum rate provided by Experttis Platform or above.&nbsp;<strong>You are allowed to establish a rate higher than the maximum rate provided by the Experttis Platform, if you consider it appropriate</strong>. The Experttis Platform will add a markup to your established rate in order to calculate the billing rate to be paid by Clients. &nbsp;The markup will be retained by ENGINEXT as the total compensation for the usage of the Experttis Platform. ENGINEXT reserves the right to modify the markup anytime and without further explanations to Consultants or Clients. After the Consultation is completed, the Experttis Platform will make the payment to your registered account, based on your established rate, typically within 15 business days after receiving the payment from the Client. You will not be separately compensated for any time in preparation of, or in follow-up to, Consultations. During the period of six months following the date of last consultation with a Client, all of the additional work coming from such Client must be contracted through the Experttis Platform and/or Experttis Platform&rsquo;s customer services.</p>
          <p>6.2 &nbsp;<strong>Special case: Consultancies provided to Academic clients</strong>. &nbsp;You accept that, as a contribution to the members of academic communities (educational institutions) the Experttis Platform will establish discounted rates to be applied to Academic Clients, which includes all Clients subscribed under the &ldquo;Academic Plan&rdquo;. Applicable rates for these Clients will be the established rates&nbsp;<em>minus 20%</em>. ENGINEXT reserves the right to modify the applicable discount percentage anytime without further explanation.</p>
          <p>6.3 The Experttis Platform will deduct from the payment any withholding taxes or other amounts required to be deducted by applicable local law or regulation.&nbsp;</p>
          <p>6.4 &nbsp;If you do not receive payment, you must inform Experttis Platform administrator by email within 6 months of the end of the 15 day period mentioned in clause 6.1 above, stating that payment has not been received.</p>
          <p>6.5 ENGINEXT will investigate all queries of non-payment and will endeavour to ensure the relevant fees are paid as soon as possible.</p>
          <p>6.6 Experttis reserves the right&nbsp;<em>not to pay fees</em> for the following reasons:</p>
          <p>(a) arranging a Consultation directly with a Client without using the Experttis Platform;</p>
          <p>(b) failure to notify Experttis Platform administrator within the six-month period mentioned in clause 6.3 above, that payment has not been completed.</p>
          <p>(c) Failure to attend a booked Consultation.</p>
          <p>(d) Failure to comply with the Consultation booking procedure set forth in Section 3.3 above.</p>
          <p>6.7 You are responsible, and you shall release, indemnify and hold harmless ENGINEXT, from any amounts or fines arising out of any taxes applicable to any amounts you earn from the usage of the Experttis Platform. ENGINEXT reserves the right to request Internal Revenue Form 1099, or any other applicable form requesting tax payer identification information from Consultants. You agree to properly complete and deliver to us all information that ENGINEXT may reasonably require to comply with applicable tax reporting and withholding obligations. The earnings you receive may constitute taxable income to you. If you are a resident of the United States of America, please refer to the IRS website or consult your tax advisor to help determine if you should pay taxes on your earnings or report them on an income tax return. &nbsp;If you are not a resident of the United States of America, please consult a tax advisor in your country of residence. Your tax advisor can help you determine if you should pay taxes on your earnings or report them on an income tax return.</p>
          <ol start={7}>
            <li><strong>Liability</strong></li>
          </ol>
          <p>7.1 ENGINEXT total liability in contract, tort, misrepresentation or otherwise arising in connection with this Agreement shall be limited to an amount equal to the fees paid to you,&nbsp;<strong>REGARDLESS OF FAULT</strong>.</p>
          <p>7.2 ENGINEXT shall not be liable for any loss or damage, or any costs, expenses or other claims including without limitation:(i) loss of profit: (ii) loss of business; (iii) loss of revenue; (iv) loss of goodwill; (v) loss of anticipated savings; (vi) loss of any data or information and/or (vii) special or indirect loss or consequential loss or otherwise which arise out of any Consultation or in connection with this Agreement.</p>
          <p><strong>8.Third Parties, Independent Contractor, and Privacy</strong></p>
          <p>8.1 You hereby acknowledge that any Client for whom you perform Consultancy Services hereunder is an intended third party beneficiary of these Terms and Conditions and has the same rights and expectations as ENGINEXT with respect to any breach by you of your representations, warranties and covenants hereunder.</p>
          <p>8.2 &nbsp;You acknowledge and agree that you will participate in Consultations as an independent contractor of IAH and, as a result, you agree to comply with all applicable tax withholding and/or reporting obligations arising from any payments made by the Experttis Platform to you. Except as expressly agreed in writing, you will not have any right or authority to negotiate any agreement or otherwise incur any obligation on behalf of IAH or to make any representation or warranty on behalf of IAH or any Client. Your status as a member of the Experttis Platform does not create an employment, agency, partnership, joint venture or any other form of association, for tax purposes or otherwise, between you and ENGINEXT or any Client. Additionally, you agree that you will not make any unauthorized use of Experttis&apos; name.</p>
          <p>8.3 &nbsp;You agree that ENGINEXT can use your Personal Information to contact you (by phone, chat, email or otherwise) about Consultation opportunities, and that ENGINEXT may disclose such Personal Information to Clients. Furthermore, you agree that ENGINEXT &nbsp;may retain, in a manner consistent with its Privacy Policy* (which is incorporated herein by reference), your Personal Information if you have participated in one or more Consultations and your participation as a member of the Experttis Platform ends. Additionally, IAH reserves the right to use your Personal Information for the purposes of, among other things, confirming employment and academic information and performing background checks (including through the use of third parties).</p>
          <p>Information provided by Consultants is stored in a database in the United States and/or any other physical location that IAH might decide, and will be accessed by our staff and third parties with whom we have contracted. The information may also be held, processed, and transferred inside or outside the European Economic Area. Consultant accepts that this information can also be transferred internationally as it might be required to allow the expansion of the Experttis Platform and its regular operations.</p>
          <ol start={9}>
            <li><strong>Miscellaneous</strong></li>
          </ol>
          <p>9.1 No delay or failure in exercising any right under this Agreement, or any partial or single exercise of any right, will constitute a waiver of that right or any other rights under this Agreement. No consent to a breach of any express or implied term of this Agreement constitutes consent to any subsequent breach.</p>
          <p>9.2 In the event that any part or provision of this Agreement is determined by any court or other competent authority to be invalid, unlawful, or unenforceable to any extent, it shall to that extent be severed from the remainder of this Agreement which shall continue to be valid and enforceable to the fullest extent permitted by law.</p>
          <p>9.3 This Agreement is binding upon and will inure to the benefit of the parties&apos; respective successors and assigns. You may not assign or sub-contract your rights or obligations under this Agreement to any third party.</p>
          <p>9.4 Clauses 2.2, 2.3, 3.1(p), 5.1, 6, 7, 8 and 9 shall survive the expiry or termination of this Agreement. Termination of this Agreement shall be without prejudice to the rights and obligations accrued by either party prior to termination.</p>
          <p>9.5 This Agreement, and any dispute or claim arising out of or in connection with it or its subject matter or formation (including non-contractual disputes or claims), shall be governed by the laws of the State of Texas without regard to any conflict or law rules. The parties hereby irrevocably consent and submit to the jurisdiction of the State or Federal courts siting in Harrys County, Texas.</p>
          <p>9.6 Entire Agreement. This constitutes the entire Agreement between ENGINEXT and you.</p>
          <hr />
          <p><strong>*Privacy Policy</strong></p>
          <p>Introduction. &nbsp;The purpose of this Privacy Policy is to describe how ENGINEXT [_______], Inc. (&ldquo;Experttis&rdquo; or &ldquo;we&rdquo; or &ldquo;us&rdquo;) collects, uses and shares information about you generally, including through Experttis&rsquo; online interfaces (e.g., websites and online portals) owned and controlled by us, (collectively referred to herein as the &ldquo;Site&rdquo;; all such data &ldquo;Personal Data&rdquo;).</p>
          <p>We may modify this Privacy Policy and if any material changes are made to it, we will provide notice through our services or by other means to provide you the opportunity to review the changes before they become effective.</p>
          <p>You acknowledge that your continued use of the Site after we publish or send a notice about our changes to this Privacy Policy means that the collection, use, and sharing of your Personal Data is subject to the updated Privacy Policy.</p>
          <p>Data this Privacy Policy Covers. This Privacy Policy covers Personal Data, including through our Site. &nbsp;Some of our Site&rsquo;s functionality can be used without revealing any Personal Data, though for some features, Personal Data is required. &nbsp;In order to access certain features on our Site, you may need to submit, or we may collect, Personal Data. &nbsp;Personal Data does not include information that is anonymized.</p>
          <p>Personal Data We Collect Relating to Your Use of Our Website. &nbsp;We may track, collect and aggregate information from your use of the Site, through the use of cookies or otherwise, indicating, among other things, which pages of our Site were visited, the order in which they were visited, when they were visited, and which hyperlinks were clicked. We also collect your IP address and standard log information, such as your browser type and operating system.</p>
          <p>Personal Data We Collect Provided Directly by You or by Third Parties. &nbsp;We collect Personal Data that you provide to us when you register for an account, update or change information on your account, use our services, send e-mail messages, and / or participate in other services on our Site. &nbsp;During registration and later on our platform, we collect your name, e-mail, address, phone number and / or other information. We may also create Personal Data about you, such as records of your interactions with us, our clients, or the Experts registered in the Experttis Platform, or from third parties that provide us with it or access to it.</p>
          <p>How We Use Your Data. &nbsp;We may use your Personal Data for various purposes, subject to applicable law, including to:</p>
          <ul>
            <li>Allow you to access and use the Site and to provide certain information, products, or services that you request from us.</li>
            <li>Operate, manage, and communicate with you via our Site;</li>
            <li>Notify you of changes to our Site or services.</li>
            <li>Monitor, improve and develop our services to you.</li>
            <li>Facilitate communications or transactions with you.</li>
            <li>Share it with other parties as necessary in order for us to provide you with our services (e.g., cloud service providers, payment processors, etc.)</li>
            <li>Marketing and commercialization of available consultants in Experttis Platform, including the use of Consultants professional profiles as a commercial differentiator</li>
            <li>Offer consultancy services through Experttis&rsquo;Owner&rsquo;s partners or affiliates</li>
          </ul>
          <p>From time to time, we may use your e-mail address to send you information and keep you informed of products and services in which you might be interested. You may at any time elect to stop receiving such emails. &nbsp;Your contact information may also be used to reach you regarding issues concerning your use of the Site, including changes to this Privacy Policy.</p>
          <p>How We May Share Personal Data. &nbsp;We may, for legitimate business purposes, disclose your Personal Data to other parties, including:</p>
          <ul>
            <li>Your appointed representatives;</li>
            <li>Other IAH&rsquo;s entities or affiliates;</li>
            <li>Professional advisors to Experttis&rsquo; Owner, such as accountants, auditors and lawyers, and</li>
            <li>Other parties as necessary for us to provide you with our services (e.g., cloud service providers, payment processors, etc.)</li>
            <li>Potential acquirors of IAH assets or business.</li>
          </ul>
          <p>We may disclose your personal data to a third party if we believe in good faith that such disclosure is necessary or desirable (i) to comply with lawful requests, subpoenas, search warrants or orders by public authorities, including to meet national security or law enforcement requirements, (ii) to address a violation of the law, (iii) to protect the rights, property or safety of Experttis&rsquo; Owner, Expertis paltform, its users or the public, or (iv) to allow Experttis&rsquo; Owner to exercise its legal rights or respond to a legal claim.</p>
          <p>If we engage a third party to process and/or storage your Personal Data, that party will (i) only process the Personal Data in accordance with our prior written instructions; and (ii) use measures to protect the confidentiality and security of the Personal Data, together with any additional requirements under applicable law.</p>
          <p><strong>For Residents of the European Economic Area (EEA) Only:</strong></p>
          <p>Experttis is the data controller of your Personal Data. &nbsp;Experttis retains your Personal Data until either it is no longer necessary for the purpose for which it was collected, you withdraw consent to process your data or no other legal basis for processing exists. &nbsp;Experttis&rsquo;s address is [____], and you can contact Experttis via e-mail at [_________].</p>
          <p>Legal basis for Processing: &nbsp;As explained above, we use your Personal Data in various ways, including depending on your use of the Site. &nbsp;We use your Personal Data on the following legal bases: &nbsp;(1) with your consent; (2) as necessary to perform our agreement to provide services; (3) where required by applicable law; (4) where necessary to protect the vital interests of any individuals; or (5) where we have a legitimate interest.</p>
          <p>Transfers: Personal Data we collect may be transferred to, and stored and processed in, the United States or any other country in which we, our affiliates or third parties with whom we engage in order to provide our services maintain facilities. We will ensure that transfers of Personal Data to a third country or an international organization are subject to appropriate safeguard as described in Article 46 of the General Data Protection Regulation.</p>
          <p>Right to Access and Correction. &nbsp;You can access your Personal Data and confirm that it remains correct and current by logging into the Site. You have the right to request access to your Personal Data and to receive a copy of your Personal Data, as well as certain information about our processing activities with respect to your Personal Data. You have the right to request correction or completion of your Personal Data if it is inaccurate or incomplete. You have the right to restrict our processing if you contest the accuracy of the data we hold about you, for as long as it takes to verify its accuracy. &nbsp;If you are a current Experttis client or a current member of our experts database and would like a copy of your Personal Data, please login to the Site and access your dashboard.</p>
          <p>Right to Personal Data Portability. &nbsp; Where technically feasible, you can request that your personal Data be transmitted directly from Experttis to another data controller in a structured, commonly used and machine-readable format. &nbsp;If you would like to request your Personal Data to be ported, please log in to the Site and access your dashboard. You can do this work directly from the web site.</p>
          <p>Right to Request Data Erasure. You have the right to have your data erased from our Site if the data is no longer necessary for the purpose for which it was collected, you withdraw consent and no other legal basis for processing exists, or you believe your fundamental rights to data privacy and protection outweigh our legitimate interest in continuing the processing. &nbsp;Your Personal Data will generally be erased from the Site without undue delay and will be anonymized in order to be able, if necessary, to comply with our legal obligations (including law enforcement requests), meet regulatory requirements, resolve disputes, maintain security, prevent fraud and abuse, enforce our Terms and Conditions or agreements, or fulfill your request to &ldquo;unsubscribe&rdquo; from further messages from us. &nbsp;If f you want your personal data to be erased from the Experttis Platform, you can do it by yourself &nbsp;by using the edition features available in your dashboard. If you would like to request the erasure of your Personal Data you just need to contact Experttis administrator using the contact information in the web site.</p>
          <p>Right to Withdraw Consent. &nbsp;Where we process your Personal Data based on your consent, you have the right to withdraw consent. &nbsp;If you would like to withdraw your consent to the processing of your Personal Data, please contact Experttis administrator using the contact information in the web site.</p>
          <p>Right to Lodge Complaint. You have the right to lodge a complaint with the appropriate relevant data protection supervisory authority in your EEA country of residence (e.g., the Information Commissioner&rsquo;s Office in the United Kingdom).</p>

        </div>
        <Checkbox checked={acceptedAgreement} style={{
          margin: "16px 0",
        }}
          onChange={(_) => {
            setAcceptedAgreement(!acceptedAgreement);
          }}
        >
          I declare and acknowledge that I have read and AGREE with the Terms, Conditions and Policies to become a registered Consultant for the EXPERTTIS platform.
        </Checkbox>
      </div>
      <div className="tw-flex tw-justify-center">
        <Button
          disabled={!acceptedAgreement}
          htmlType="submit"
          type="primary"
        >
          Register
        </Button>
      </div>
    </Form>
  )
}