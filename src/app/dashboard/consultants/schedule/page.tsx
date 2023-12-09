"use client";
import moment from "moment";
import { useEffect, useState } from "react";

/* Firebase */
import useAuth from "@/hook/auth_hook";
import { Timestamp } from "firebase/firestore";

/* Antd */
import { Container } from "react-bootstrap";
import { Affix, Button, Card, Checkbox, Col, DatePicker, Divider, FloatButton, Row, Space, Typography, notification } from "antd";

/* Utils */
import Routes from "@/models/routes";
import { ScheduleInterface } from "@/models/user";

/* Components */
import ExperttisLoader from "@/components/Loader";
import MainLayout from "@/app/dashboard/consultants/main/client/MainLayout";

/* Services */
import UserController from "@/services/user/index";


const { Title } = Typography;

export default function SchedulePage() {
  const { currentUser, loadingAuth } = useAuth();

  // Schedules
  const [first, setFirst] = useState<boolean>(false);
  const [sunday, setSunday] = useState<number[]>([]);
  const [monday, setMonday] = useState<number[]>([]);
  const [tuesday, setTuesday] = useState<number[]>([]);
  const [wednesday, setWednesday] = useState<number[]>([]);
  const [thursday, setThursday] = useState<number[]>([]);
  const [friday, setFriday] = useState<number[]>([]);
  const [saturday, setSaturday] = useState<number[]>([]);
  const [acceptedJobInterviews, setAcceptedJobInterviews] = useState<boolean>(false);
  const [holidays, setHolidays] = useState<moment.Moment[]>([]);
  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>(false);

  const [hours, setHours] = useState<string[]>([]);

  useEffect(() => {
    const listHours = [];
    for (let i = 0; i < 24; i++) {
      listHours.push(`${i}:00`);
    }
    setHours(listHours);

    if (currentUser && !first) {
      setSunday(currentUser.schedule?.sunday ?? []);
      setMonday(currentUser.schedule?.monday ?? []);
      setTuesday(currentUser.schedule?.tuesday ?? []);
      setWednesday(currentUser.schedule?.wednesday ?? []);
      setThursday(currentUser.schedule?.thursday ?? []);
      setFriday(currentUser.schedule?.friday ?? []);
      setSaturday(currentUser.schedule?.saturday ?? []);
      setAcceptedJobInterviews(currentUser.schedule?.acceptedJobInterviews ?? false);
      setHolidays(currentUser.schedule?.holidays.map((h: Timestamp) => moment.unix(h.seconds)) ?? []);
      setFirst(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const saveChanges = async () => {
    setLoadingSaveChanges(true);
    try {
      await UserController.updateSchedule(currentUser!, {
        acceptedJobInterviews,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        holidays: holidays.map((h) => Timestamp.fromDate(h.toDate())),
      } as ScheduleInterface);
      notification.success({
        message: "Changes saved successfully",
      });
    } catch (error: any) {
      notification.error({
        message: error.message,
      });
    }
    setLoadingSaveChanges(false);
  }

  return loadingAuth ? (
    <ExperttisLoader
      tip="Check user..."
    />
  ) : (
    <MainLayout
      currentPage={Routes.consultants.schedule}
    >
      <Container style={{ paddingTop: 64 }}>
        <Title level={2}>SCHEDULE</Title>
        <Checkbox
          checked={acceptedJobInterviews}
          onChange={(e) => setAcceptedJobInterviews(e.target.value)}
        >
          Accept job interviews.
        </Checkbox>
        <Divider />
        <Row>
          <Col md={1}>
            <Title level={5} style={{ textAlign: "center" }}>Time</Title>
            <Row justify="center">
              <Button
                size="small"
                disabled={true}
                style={{ borderRadius: 0 }}
                block
              >
                Day
              </Button>
            </Row>
            {hours.map((hour, index) => (
              <Row key={index} justify="center">
                <Button
                  size="small"
                  disabled={true}
                  style={{ borderRadius: 0 }}
                  block
                >
                  {hour}
                </Button>
              </Row>
            ))}
          </Col>
          <Col md={1}>
            <Title level={5} style={{ textAlign: "center" }}>Week</Title>
            <Row>
              <Button
                size="small"
                disabled={true}
                block
                style={{ borderRadius: 0 }}
              />
            </Row>
            {hours.map((hour, index) => (
              <Row key={index}>
                <Button
                  size="small"
                  key={index}
                  block
                  style={{ borderRadius: 0 }}
                  onClick={() => {
                    if (
                      sunday.includes(index) &&
                      monday.includes(index) &&
                      tuesday.includes(index) &&
                      wednesday.includes(index) &&
                      thursday.includes(index) &&
                      friday.includes(index) &&
                      saturday.includes(index)
                    ) {
                      setSunday([...sunday.filter((item) => item !== index)]);
                      setMonday([...monday.filter((item) => item !== index)]);
                      setTuesday([...tuesday.filter((item) => item !== index)]);
                      setWednesday([...wednesday.filter((item) => item !== index)]);
                      setThursday([...thursday.filter((item) => item !== index)]);
                      setFriday([...friday.filter((item) => item !== index)]);
                      setSaturday([...saturday.filter((item) => item !== index)]);
                    } else {
                      setSunday([...sunday, index]);
                      setMonday([...monday, index]);
                      setTuesday([...thursday, index]);
                      setWednesday([...wednesday, index]);
                      setThursday([...thursday, index]);
                      setFriday([...friday, index]);
                      setSaturday([...saturday, index]);
                    }
                  }}
                  type={sunday.includes(index) &&
                    monday.includes(index) &&
                    tuesday.includes(index) &&
                    wednesday.includes(index) &&
                    thursday.includes(index) &&
                    friday.includes(index) &&
                    saturday.includes(index) ?
                    "primary" : "default"}
                >

                </Button>
              </Row>
            ))}
          </Col>
          <Col md={2}>
            <Title level={5} style={{ textAlign: "center" }}>Sun</Title>
            <Row>
              <Button
                size="small"
                block
                style={{ borderRadius: 0 }}
                onClick={() => {
                  if (sunday.length === 24) {
                    setSunday([]);
                  } else {
                    setSunday([...hours.map((hour, index) => index)]);
                  }
                }}
                type={sunday.length === 24 ? "primary" : "default"}
              >
                {sunday.length === 24 && "All"}
              </Button>
            </Row>
            {hours.map((hour, index) => (
              <Row key={index}>
                <Button
                  size="small"
                  key={index}
                  block
                  style={{ borderRadius: 0 }}
                  type={sunday.includes(index) ? "primary" : "default"}
                  onClick={() => {
                    if (sunday.includes(index)) {
                      setSunday([...sunday.filter((hour) => hour !== index)]);
                    } else {
                      setSunday([...sunday, index]);
                    }
                  }}
                >
                  {sunday.includes(index) && "Sun"}
                </Button>
              </Row>
            ))}
          </Col>
          <Col md={2}>
            <Title level={5} style={{ textAlign: "center" }}>Mon</Title>
            <Row>
              <Button
                size="small"
                block
                style={{ borderRadius: 0 }}
                onClick={() => {
                  if (monday.length === 24) {
                    setMonday([]);
                  } else {
                    setMonday([...hours.map((hour, index) => index)]);
                  }
                }}
                type={monday.length === 24 ? "primary" : "default"}
              >
                {monday.length === 24 && "All"}
              </Button>
            </Row>
            {hours.map((hour, index) => (
              <Row key={index}>
                <Button
                  size="small"
                  key={index}
                  block
                  style={{ borderRadius: 0 }}
                  type={monday.includes(index) ? "primary" : "default"}
                  onClick={() => {
                    if (monday.includes(index)) {
                      setMonday([...monday.filter((hour) => hour !== index)]);
                    } else {
                      setMonday([...monday, index]);
                    }
                  }}
                >
                  {monday.includes(index) && "Mon"}
                </Button>
              </Row>
            ))}
          </Col>
          <Col md={2}>
            <Title level={5} style={{ textAlign: "center" }}>Tue</Title>
            <Row>
              <Button
                size="small"
                block
                style={{ borderRadius: 0 }}
                onClick={() => {
                  if (tuesday.length === 24) {
                    setTuesday([]);
                  } else {
                    setTuesday([...hours.map((hour, index) => index)]);
                  }
                }}
                type={tuesday.length === 24 ? "primary" : "default"}
              >
                {tuesday.length === 24 && "All"}
              </Button>
            </Row>
            {hours.map((hour, index) => (
              <Row key={index}>
                <Button
                  size="small"
                  key={index}
                  block
                  style={{ borderRadius: 0 }}
                  type={tuesday.includes(index) ? "primary" : "default"}
                  onClick={() => {
                    if (tuesday.includes(index)) {
                      setTuesday([...tuesday.filter((hour) => hour !== index)]);
                    } else {
                      setTuesday([...tuesday, index]);
                    }
                  }}
                >
                  {tuesday.includes(index) && "Tue"}
                </Button>
              </Row>
            ))}
          </Col>
          <Col md={2}>
            <Title level={5} style={{ textAlign: "center" }}>Wed</Title>
            <Row>
              <Button
                size="small"
                block
                style={{ borderRadius: 0 }}
                onClick={() => {
                  if (wednesday.length === 24) {
                    setWednesday([]);
                  } else {
                    setWednesday([...hours.map((hour, index) => index)]);
                  }
                }}
                type={wednesday.length === 24 ? "primary" : "default"}
              >
                {wednesday.length === 24 && "All"}
              </Button>
            </Row>
            {hours.map((hour, index) => (
              <Row key={index}>
                <Button
                  size="small"
                  key={index}
                  block
                  style={{ borderRadius: 0 }}
                  type={wednesday.includes(index) ? "primary" : "default"}
                  onClick={() => {
                    if (wednesday.includes(index)) {
                      setWednesday([...wednesday.filter((hour) => hour !== index)]);
                    } else {
                      setWednesday([...wednesday, index]);
                    }
                  }}
                >
                  {wednesday.includes(index) && "Wed"}
                </Button>
              </Row>
            ))}
          </Col>
          <Col md={2}>
            <Title level={5} style={{ textAlign: "center" }}>Thr</Title>
            <Row>
              <Button
                size="small"
                block
                style={{ borderRadius: 0 }}
                onClick={() => {
                  if (thursday.length === 24) {
                    setThursday([]);
                  } else {
                    setThursday([...hours.map((hour, index) => index)]);
                  }
                }}
                type={thursday.length === 24 ? "primary" : "default"}
              >
                {thursday.length === 24 && "All"}
              </Button>
            </Row>
            {hours.map((hour, index) => (
              <Row key={index}>
                <Button
                  size="small"
                  key={index}
                  block
                  style={{ borderRadius: 0 }}
                  type={thursday.includes(index) ? "primary" : "default"}
                  onClick={() => {
                    if (thursday.includes(index)) {
                      setThursday([...thursday.filter((hour) => hour !== index)]);
                    } else {
                      setThursday([...thursday, index]);
                    }
                  }}
                >
                  {thursday.includes(index) && "Thr"}
                </Button>
              </Row>
            ))}
          </Col>
          <Col md={2}>
            <Title level={5} style={{ textAlign: "center" }}>Fri</Title>
            <Row>
              <Button
                size="small"
                block
                style={{ borderRadius: 0 }}
                onClick={() => {
                  if (friday.length === 24) {
                    setFriday([]);
                  } else {
                    setFriday([...hours.map((hour, index) => index)]);
                  }
                }}
                type={friday.length === 24 ? "primary" : "default"}
              >
                {friday.length === 24 && "All"}
              </Button>
            </Row>
            {hours.map((hour, index) => (
              <Row key={index}>
                <Button
                  size="small"
                  key={index}
                  block
                  style={{ borderRadius: 0 }}
                  type={friday.includes(index) ? "primary" : "default"}
                  onClick={() => {
                    if (friday.includes(index)) {
                      setFriday([...friday.filter((hour) => hour !== index)]);
                    } else {
                      setFriday([...friday, index]);
                    }
                  }}
                >
                  {friday.includes(index) && "Fri"}
                </Button>
              </Row>
            ))}
          </Col>
          <Col md={2}>
            <Title level={5} style={{ textAlign: "center" }}>Sat</Title>
            <Row>
              <Button
                size="small"
                block
                style={{ borderRadius: 0 }}
                onClick={() => {
                  if (saturday.length === 24) {
                    setSaturday([]);
                  } else {
                    setSaturday([...hours.map((hour, index) => index)]);
                  }
                }}
                type={saturday.length === 24 ? "primary" : "default"}
              >
                {saturday.length === 24 && "All"}
              </Button>
            </Row>
            {hours.map((hour, index) => (
              <Row key={index}>
                <Button
                  size="small"
                  key={index}
                  block
                  style={{ borderRadius: 0 }}
                  type={saturday.includes(index) ? "primary" : "default"}
                  onClick={() => {
                    if (saturday.includes(index)) {
                      setSaturday([...saturday.filter((hour) => hour !== index)]);
                    } else {
                      setSaturday([...saturday, index]);
                    }
                  }}
                >
                  {saturday.includes(index) && "Sat"}
                </Button>
              </Row>
            ))}
          </Col>
          <Col md={8} style={{ paddingLeft: 16 }}>
            <Card title="Select holidays" style={{ marginBottom: 16 }}>
              <Space.Compact style={{ width: "100%" }}>
                <DatePicker
                  style={{ width: "100%" }}
                  format="MM-DD-YYYY"
                  placeholder="Select a holiday date"
                  disabledDate={(current) => {
                    const _current = current as moment.Moment;
                    if (moment().isSameOrBefore(_current)) {
                      return true;
                    }
                    return false;
                  }}
                  onChange={(_, dateString) => {
                    if (holidays.filter(h => moment(h).isSame(moment(dateString))).length > 0) {
                      return notification.error({
                        message: "This date is already added",
                      });
                    }
                    setHolidays([...holidays, moment(dateString)]);
                  }}
                />
              </Space.Compact>
            </Card>
            <Card title="My holidays">
              {holidays.map((holiday, index) => (
                <Title level={4} key={index}>
                  {index + 1}. {moment(holiday).format("dddd, MMMM DD, YYYY")}
                </Title>
              ))}
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row justify="center">
          <Affix offsetBottom={10}>
            <Button
              loading={loadingSaveChanges}
              type="primary"
              onClick={saveChanges}
              size="large"
            >
              Save Changes
            </Button>
          </Affix>
        </Row>
      </Container>
    </MainLayout>
  );
}