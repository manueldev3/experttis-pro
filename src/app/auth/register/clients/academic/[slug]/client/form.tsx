"use client";

import { Button, Checkbox, Form, Input, Select, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import Image from "next/image";
import { useState } from "react";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";

const labelStyle = 'original';
const timezones = {
  ...allTimezones,
}

const { Option } = Select;

export default function AcademicForm({ slug }: { slug: string }) {
  const [_formKey] = useForm();

  const [acceptedAgreement, setAcceptedAgreement] = useState<boolean>();

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

  return (  
    <Form
      form={_formKey}
      name="register_client"
      layout="vertical"
      className="tw-flex tw-flex-col tw-space-y-4"
    >
      <div className="tw-p-3" style={{
        border: "solid 2px rgba(0, 0, 0, 0.15)"
      }}>
        <h4>CONTACT INFORMATION</h4>
        <div className="tw-grid md:tw-grid-cols-3 tw-gap-2">
          <div>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                {required: true}
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
                {required: true}
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
                {required: true}
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
                {required: true}
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
              rules={[{required: true}]}
            >
              <Space.Compact style={{width: "100%"}}>
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
                {required: true}
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
                  value={selectedPhoneCode}
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
                {required: true}
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
      <div className="tw-p-3" style={{
        border: "solid 2px rgba(0, 0, 0, 0.15)"
      }}>
        <h4>SIGN UP</h4>
        <div className="tw-grid lg:tw-grid-cols-3 tw-gap-2">
          <Form.Item
            label="Username:"
          >
            <Input disabled/>
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
      <div className="tw-p-3" style={{
        border: "solid 2px rgba(0, 0, 0, 0.15)"
      }}>
        <h4>REGISTRATION AGREEMENT</h4>
        <div className="tw-overflow-auto tw-w-full tw-h-64 tw-p-3" style={{
          border: "solid 2px rgba(0, 0, 0, 0.15)"
        }}></div>
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
  );
}