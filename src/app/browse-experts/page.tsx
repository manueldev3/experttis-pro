"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button, Checkbox, Divider, Form, Input, InputNumber, Select, Space, Spin } from "antd";
import Error from "next/error";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import Certification from "@/models/certification";
import CertificationController from "@/services/certifications";
import Link from "next/link";
import ExperttisLoader from "@/components/Loader";
import Discipline from "@/models/disciplines";
import DisciplineController from "@/services/disciplines";
import Profession from "@/models/profession";
import ProfessionController from "@/services/professions";
import RelevantPosition from "@/models/relevantPosition";
import RelevantPositionController from "@/services/relevant/positions";
import Image from "next/image";

export default function BrowseExperts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const [searchValue, setSearchValue] = React.useState<string>(search || "");
  const [searching, setSearching] = React.useState<boolean>(search !== null);
  const [results, setResults] = React.useState<any[]>([]);

  // Filters
  // Certifications
  const [countCerts, setCountCerts] = React.useState<number>(0);
  const [loadingCerts, setLoadingCerts] = React.useState<boolean>(true);
  const [certifications, setCertifications] = React.useState<Certification[]>([]);
  const [selectedCerts, setSelectedCerts] = React.useState<string[]>([]);
  // Disciplines
  const [countDisciplines, setCountDisciplines] = React.useState<number>(0);
  const [loadingDisciplines, setLoadingDisciplines] = React.useState<boolean>(true);
  const [disciplines, setDisciplines] = React.useState<Discipline[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = React.useState<string[]>([]);
  // Professions
  const [countProfessions, setCountProfessions] = React.useState<number>(0);
  const [loadingProfessions, setLoadingProfessions] = React.useState<boolean>(true);
  const [professions, setProfessions] = React.useState<Profession[]>([]);
  const [selectedProfessions, setSelectedProfessions] = React.useState<string[]>([]);
  // Relevant Positions
  const [countRelevantPositions, setCountRelevantPositions] = React.useState<number>(0);
  const [loadingRelevantPositions, setLoadingRelevantPositions] = React.useState<boolean>(true);
  const [relevantPositions, setRelevantPositions] = React.useState<RelevantPosition[]>([]);
  const [selectedRelevantPositions, setSelectedRelevantPositions] = React.useState<string[]>([]);

  const onSearch = React.useCallback(async (search: string) => {
    setSearching(true);
    const res = await fetch("/api/experts/search", {
      method: "POST",
      body: JSON.stringify({
        search,
      }),
    });

    if (res.status === 200) {
      setResults(await res.json());
    }
    setSearching(false);
  }, []);

  const initCertifications = React.useCallback(async () => {
    const count = await CertificationController.getCount();
    const results = await CertificationController.getAll(6);

    setCountCerts(count);
    setCertifications(results);
    setLoadingCerts(false);
  }, []);

  const initDisciplines = React.useCallback(async () => {
    const count = await DisciplineController.getCount();
    const results = await DisciplineController.getAll(6);

    setCountDisciplines(count);
    setDisciplines(results);
    setLoadingDisciplines(false);
  }, []);

  const initProfessions = React.useCallback(async () => {
    const count = await ProfessionController.getCount();
    const results = await ProfessionController.getAll(6);

    setCountProfessions(count);
    setProfessions(results);
    setLoadingProfessions(false);
  }, []);

  const initRelevantPositions = React.useCallback(async () => {
    const count = await RelevantPositionController.getCount();
    const results = await RelevantPositionController.getAll(6);

    setCountRelevantPositions(count);
    setRelevantPositions(results);
    setLoadingRelevantPositions(false);
  }, []);

  React.useEffect(() => {
    onSearch(search || "")
    initCertifications();
    initDisciplines();
    initProfessions();
    initRelevantPositions();
  }, [initCertifications, initDisciplines, initProfessions, initRelevantPositions, onSearch, search]);

  const showMoreCerts = async () => {
    setLoadingCerts(true);
    const results = await CertificationController.getAll(6, certifications.map(item => {
      return item.name
    }).pop());

    setCertifications([...certifications, ...results.filter((_, index) => index > 0)]);
    setLoadingCerts(false);
  }

  const showMoreDisciplines = async () => {
    setLoadingDisciplines(true);
    const results = await DisciplineController.getAll(6, disciplines.map(item => {
      return item.name
    }).pop());

    setDisciplines([...disciplines, ...results.filter((_, index) => index > 0)]);
    setLoadingDisciplines(false);
  }

  const showMoreProfessions = async () => {
    setLoadingProfessions(true);
    const results = await ProfessionController.getAll(6, professions.map(item => {
      return item.name
    }).pop());

    setProfessions([...professions, ...results.filter((_, index) => index > 0)]);
    setLoadingProfessions(false);
  }

  const showMoreRelevantPositions = async () => {
    setLoadingRelevantPositions(true);
    const results = await RelevantPositionController.getAll(6, relevantPositions.map(item => {
      return item.name
    }).pop());

    setRelevantPositions([...relevantPositions, ...results.filter((_, index) => index > 0)]);
    setLoadingRelevantPositions(false);
  }

  return (
    <>
      <Header />
      <div className="p-4 w-full">
        <div className="grid grid-cols-7 items-center gap-4">
          <div className="col-span-2">
            <Input
              size="large"
              value={searchValue}
              className="rounded-lg"
              onChange={(event) => {
                if (!searching && results.length === 0) {
                  
                }
                setSearchValue(event.target.value)
              }}
              onKeyDown={async (event) => {
                if (event.key === "Enter") {
                  await onSearch(searchValue);
                }
              }}
            />
          </div>
          <div className="col-span-2">
            <Form
              layout="vertical"
            >
              <Form.Item
                label="Hourly Rate (USD/Hour)"
              >
                <div className="flex space-x-2">
                  <InputNumber
                    addonBefore="From"
                  />
                  <InputNumber
                    addonBefore="to"
                  />
                </div>
              </Form.Item>
            </Form>
            <div className="flex space-x-2">
            </div>
          </div>
          <div className="col-span-2">
            <Form
              layout="vertical"
            >
              <Form.Item
                label="Order by:"
              >
                <div className="rounded-lg border-[1px] border-gray-300">
                  <Select
                    placeholder="Select an option"
                    allowClear
                    options={[
                      {
                        value: "rateHighest",
                        label: "Rate (Highest)",
                      },
                      {
                        value: "rateLowest",
                        label: "Rate (Lowest)",
                      },
                      {
                        value: "experienceHighest",
                        label: "Experience (Highest)",
                      },
                      {
                        value: "experienceLowest",
                        label: "Experience (Lowest)",
                      },
                    ]}
                    bordered={false}
                  />
                </div>
              </Form.Item>
            </Form>
          </div>
          <div className="col flex justify-end">
            <Button
              disabled={!searchValue.length}
              size="large"
              type="primary"
              className="bg-blue-500"
              shape="round"
              icon={<SearchOutlined />}
              onClick={async () => {
                if (searchValue.length) {
                  await onSearch(searchValue);
                }
              }}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 space-y-4">
            {/* Certifications */}
            <div className="flex flex-col rounded-lg border-gray-300 border-[1px] p-4 max-h-[18rem] overflow-y-auto">
              <h5>Certification:</h5>
              <div className="flex flex-col max-h-[16rem] overflow-y-auto">
                {certifications.map((item, index) => (
                  <Checkbox
                    key={index}
                    checked={selectedCerts.includes(item.id)}
                    onChange={(_) => {
                      if (selectedCerts.includes(item.id)) {
                        const certs = selectedCerts.filter(cert => cert !== item.id);
                        setSelectedCerts(certs);
                      } else {
                        setSelectedCerts([...selectedCerts, item.id]);
                      }
                    }}
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </div>
              {loadingCerts ? (
                <Spin />
              ) : countCerts > certifications.length && (
                <Button type="text" onClick={showMoreCerts}
                  className="flex text-blue-500 p-0 mt-3"
                >
                  More...
                </Button>
              )}
            </div>
            {/* Experience */}
            <div className="flex flex-col rounded-lg border-gray-300 border-[1px] p-4">
              <h5>Experience:</h5>
              <Checkbox>
                Up to 5
              </Checkbox>
              <Checkbox>
                6 to 10
              </Checkbox>
              <Checkbox>
                11 to 20
              </Checkbox>
              <Checkbox>
                More than 20
              </Checkbox>
            </div>
            {/* Disciplines */}
            <div className="flex flex-col rounded-lg border-gray-300 border-[1px] p-4">
              <h5>Disciplines:</h5>
              <div className="flex flex-col max-h-[16rem] overflow-y-auto">
                {disciplines.map((item, index) => (
                  <Checkbox
                    key={index}
                    checked={selectedDisciplines.includes(item.id)}
                    onChange={(_) => {
                      if (selectedDisciplines.includes(item.id)) {
                        const disciplines = selectedDisciplines.filter(discipline => discipline !== item.id);
                        setSelectedDisciplines(disciplines);
                      } else {
                        setSelectedDisciplines([...selectedDisciplines, item.id]);
                      }
                    }}
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </div>
              {loadingDisciplines ? (
                <Spin />
              ) : countDisciplines > disciplines.length && (
                <Button type="text" onClick={showMoreDisciplines}
                  className="flex items-center text-blue-500 p-0 mt-3"
                >
                  More...
                </Button>
              )}
            </div>
            {/* Professions */}
            <div className="flex flex-col rounded-lg border-gray-300 border-[1px] p-4">
              <h5>Professions:</h5>
              <div className="flex flex-col max-h-[16rem] overflow-y-auto">
                {professions.map((item, index) => (
                  <Checkbox
                    key={index}
                    checked={selectedDisciplines.includes(item.id)}
                    onChange={(_) => {
                      if (selectedDisciplines.includes(item.id)) {
                        const professions = selectedProfessions.filter(profession => profession !== item.id);
                        setSelectedProfessions(professions);
                      } else {
                        setSelectedProfessions([...selectedProfessions, item.id]);
                      }
                    }}
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </div>
              {loadingProfessions ? (
                <Spin />
              ) : countProfessions > professions.length && (
                <Button type="text" onClick={showMoreProfessions}
                  className="flex items-center text-blue-500 p-0 mt-3"
                >
                  More...
                </Button>
              )}
            </div>
            {/* Relevan Positions */}
            <div className="flex flex-col rounded-lg border-gray-300 border-[1px] p-4">
              <h5>Relevant Positions:</h5>
              <div className="flex flex-col max-h-[16rem] overflow-y-auto">
                {relevantPositions.map((item, index) => (
                  <Checkbox
                    key={index}
                    checked={selectedRelevantPositions.includes(item.id)}
                    onChange={(_) => {
                      if (selectedRelevantPositions.includes(item.id)) {
                        const relevantPositions = selectedRelevantPositions.filter(relevantPosition => relevantPosition !== item.id);
                        setSelectedRelevantPositions(relevantPositions);
                      } else {
                        setSelectedRelevantPositions([...selectedRelevantPositions, item.id]);
                      }
                    }}
                  >
                    {item.name}
                  </Checkbox>
                ))}
              </div>
              {loadingRelevantPositions ? (
                <Spin />
              ) : countRelevantPositions > relevantPositions.length && (
                <Button type="text" onClick={showMoreRelevantPositions}
                  className="flex items-center text-blue-500 p-0 mt-3"
                >
                  More...
                </Button>
              )}
            </div>
            {/* Post Graduate Studies */}
            <div className="flex flex-col rounded-lg border-gray-300 border-[1px] p-4">
              <h5>Post Graduate Studies:</h5>
              <Checkbox>
                In the Field
              </Checkbox>
              <Checkbox>
                Out the Field
              </Checkbox>
            </div>
          </div>
          {searching ? (
            <div className="flex flex-col col-span-9 pace-y-4">
              <ExperttisLoader/>
            </div>
          ) : !searching && results.length === 0 ? (
            <div className="flex flex-col col-span-9 pace-y-4">
              <h2 className="text-[1.3rem] font-bold uppercase">
                No results for {`"${searchValue}"`} - try different search criteria
              </h2>
              <span className="text-center text-[0.8rem]">Showing results to 0, out of 0 entries.</span>
            </div>
          ) : results.length ? (
            <div className="flex flex-col col-span-9 items-center space-y-4">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="rounded-md card w-full p-4 shadow-sm"
                >
                  <div className="flex space-x-6">
                    <Image
                      src={item.avatar || "https://via.placeholder.com/512?text=Not found"}
                      width={120}
                      height={120}
                      alt="Avatar"
                      className="rounded-lg shadow-sm"
                    />
                    <div className="flex flex-col w-full">
                      <h4 className="font-bold text-blue-500">{item.displayName.toUpperCase()}</h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <h5 className="font-bold">{item.rate}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col col-span-9 items-center space-y-4">
              <Divider/>
              <SearchOutlined className="text-[5rem] bg-gray-200 p-4 rounded-full"/>
              <h2>Search Experts</h2>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}