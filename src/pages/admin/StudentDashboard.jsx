
import icon from "../../assets/images/Icon.png";
import icon1 from "../../assets/images/Icon (1).png";
import icon4 from "../../assets/images/Icon (4).png";
import startfill from "../../assets/images/startfill.png";
import startempty from "../../assets/images/startempty.png";
import cup from "../../assets/images/cup.png";
import dropside from "../../assets/images/dropside.png";
import { PiFireBold } from "react-icons/pi";
import fluent from "../../assets/images/fluent-emoji_confetti-ball.png";
import fluent1 from "../../assets/images/fluent-emoji_confetti-ball (1).png";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/URL";
import { RiArrowDropRightLine } from "react-icons/ri";
import ReactApexChart from "react-apexcharts";
import { TiStarFullOutline } from "react-icons/ti";

function AdminDashboard() {
  const [data, setData] = useState();
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentMonth1, setCurrentMonth1] = useState("");
  const [maxMonth, setMaxMonth] = useState("");

  const leaderboardData = data?.leaderboard;
  const revenue = data?.subscription_revenue;
  const challengeResults = data?.top_challenge_worksheets;
  const questionResults = data?.top_question_worksheets;

  const [state, setState] = useState({

    series: [{
      name: 'series1',
      data: [31, 40, 28, 51, 42, 109, 100]
    }],
    options: {
      chart: {
        height: 350,
        type: 'area'
      },
      colors: ['#4F46E5'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      },
    },
  });

  const [state1, setState1] = useState({
    series: [100, 35],
    options: {
      chart: {
        width: 380,
        type: "donut",
      },
      colors: ["#d4d2f9", "#433bbe"],
      labels: ["Balance", "Marks",],
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: true,
            },
          },
        },
      ],
      legend: {
        position: "right",
        offsetY: 0,
        height: 230,
      },
    },
  });

  const getData = async () => {
    try {
      const response = await api.get("dashboard/student");
      setData(response.data.data);
      if (response.data.data.chart_data) {
        // setState((prevState) => ({
        //   ...prevState,
        //   options: {
        //     ...prevState.options,
        //     xaxis: {
        //       categories: response.data.data.chart_data.label,
        //     },
        //   },
        //   series: response.data.data.chart_data.series,
        // }));
      }
    } catch (e) {
      if (e?.response?.status === 403) {
        toast.error("Don't have access to this page");
      } else {
        toast.error(e?.response?.data?.error);
        toast.error(e?.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 7);
    setCurrentMonth(formattedDate);
    setCurrentMonth1(formattedDate);
    setMaxMonth(formattedDate);
  }, []);

  return (
    <section className="" style={{ minHeight: "80vh" }}>
      <div className="row m-0 py-2">
        <div className="d-flex">
          <h6 className="mb-5 fs-5 fw-semibold dash-font me-2">
            Hey Username -
          </h6>
          <span> here's how things are going</span>
        </div>
        <div className="col-md-2 col-12 ">
          <div className="card">
            <div className="row">
              <div className="col-md-5 col-12 ">
                <img src={icon} alt="" className=" img-fluid ms-2 py-3 " />
              </div>
              <div className="col-md-7 col-12 py-3">
                <p className="dash-font fw-12 fw-semibold">SCORE</p>
                <p className="dash-font heading-color fw-bold">{data?.total_points}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-12 ps-md-0 ">
          <div className="card">
            <div className="row ">
              <div className=" col-md-3 col-12">
                <img src={icon1} alt="" className="py-3 img-fluid ms-4 " />
              </div>
              <div className="col-md-9 col-12 py-3">
                <div className="row m-0">
                  <div className="col-6">
                    <div className="border-end pe-2">
                      <p className="dash-font text-nowrap fw-12 fw-semibold">WORKSHEET</p>
                      <p className="dash-font heading-color fw-bold">{data?.total_active_question_worksheets}</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="">
                      <p className="dash-font text-nowrap fw-12 fw-semibold">Q&A</p>
                      <p className="dash-font heading-color fw-bold">{data?.total_active_challenge_worksheets}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-12 ps-md-0 ">
          <div className="card">
            <div className="row ">
              <div className=" col-md-3 col-12">
                <img src={icon1} alt="" className="py-3 img-fluid ms-4 " />
              </div>
              <div className="col-md-9 col-12 py-3">
                <div className="row m-0">
                  <div className="col-6">
                    <div className="border-end pe-2">
                      <p className="dash-font text-nowrap fw-12 fw-semibold">LAST GRADE</p>
                      <p className="dash-font heading-color fw-bold">{data?.last_score}</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="">
                      <p className="dash-font text-nowrap fw-12 fw-semibold">AVG</p>
                      <p className="dash-font heading-color fw-bold">{data?.average_score}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2 col-12 ps-md-0">
          <div className="card">
            <div className="row">
              <div className="col-md-5 col-12">
                <img src={icon4} alt="" className="py-3 img-fluid ms-2 " />
              </div>
              <div className="col-md-7 col-12 py-3">
                <p className="dash-font fw-12 fw-semibold">BADGES</p>
                <p className="dash-font heading-color fw-bold">{data?.active_worksheets}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card m-3">
        <div className="row m-0 p-3">
          <div className="d-flex justify-content-between">
            <div>
              <h6 className="dash-font fw-semibold fs-6">Daily Changes</h6>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                Lorem ipsum dolor sit amet, consectetur adipis.
              </p>
            </div>
          </div>
          <div className="col-9 pt-5">
            <div className="row">
              <div className="col-md-4">
                <div className="d-flex justify-content-center align-items-center gap-4">
                  <div className="">
                    <img src={startfill} alt="" className="py-3 img-fluid ms-2" />
                  </div>
                  <div class="progress w-100" style={{ height: "2px" }}>
                    <div class="progress-bar"
                      role="progressbar"
                      style={{ width: "49%" }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100">
                    </div>
                  </div>
                </div>
                <div className="px-3">
                  <p className="dash-font fw-medium" style={{ fontSize: "13px" }}>
                    Complete 2 sections on gravity
                  </p>
                  <p className="dash-font text-muted mb-5" style={{ fontSize: "13px" }}>
                    Text
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex justify-content-center align-items-center gap-4">
                  <div className="">
                    <img src={startfill} alt="" className="py-3 img-fluid ms-2" />
                  </div>
                  <div class="progress w-100" style={{ height: "2px" }}>
                    <div class="progress-bar"
                      role="progressbar"
                      style={{ width: "49%" }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100">
                    </div>
                  </div>
                </div>
                <div className="px-3">
                  <p className="fw-medium dash-font" style={{ fontSize: "13px" }}>
                    Complete 2 sections on gravity
                  </p>
                  <p className="text-muted mb-5 dash-font" style={{ fontSize: "13px" }}>
                    Text
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex justify-content-center align-items-center gap-4">
                  <div className="">
                    <img src={startempty} alt="" className="py-3 img-fluid ms-2" />
                  </div>
                  <div class="progress w-100" style={{ height: "2px" }}>
                    <div class="progress-bar"
                      role="progressbar"
                      style={{ width: "" }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100">
                    </div>
                  </div>
                </div>
                <div className="px-3">
                  <p className="dash-font fw-medium" style={{ fontSize: "13px" }}>
                    Complete 2 sections on gravity
                  </p>
                  <p className="dash-font text-muted mb-5" style={{ fontSize: "13px" }}>
                    Text
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3 mb-5">
            <div
              className="card"
              style={{
                border: "1px solid #4f46e5",
                height: "100%",
              }}
            >
              <div className="d-flex pt-3">
                <img src={cup} alt="" className="img-fluid ms-2" />
                <div className="mt-1">
                  <p className="fw-bold dash-font" style={{ color: "#4f46e5" }}>Daily Cup</p>
                  <p className="text-muted dash-font">
                    <TiStarFullOutline color="#4f46e5" size={20} />
                    <TiStarFullOutline color="#4f46e5" size={20} />
                    <TiStarFullOutline color="#C0C0C0" size={20} />
                  </p>
                </div>
              </div>
              <div className="mt-auto"
                style={{ background: "#eae9fc", borderRadius: "0 0 12px 12px" }}
              >
                <div
                  className="align-items-center justify-content-center"
                  style={{
                    color: "#4f46e5",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  <p className="fw-bold dash-font" style={{ fontSize: "13px" }}>
                    <PiFireBold className="me-1" />
                    28 Days streak active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row m-0">
        <div className="col-md-6 col-12">
          <div className="card pe-3 ps-5 py-5 mb-3">
            <div className="d-flex justify-content-between align-items-center ps-2">
              <div>
                <h6 className="dash-font fw-semibold fs-6">Recent Badges Earned</h6>
                <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipis.
                </p>
              </div>
              <div className="d-flex">
                <div
                  className="rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
                  style={{ width: "45px", height: "45px" }}
                >
                  <img src={fluent} alt="" className="img-fluid" />
                </div>
                <div
                  className="rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
                  style={{ width: "45px", height: "45px" }}
                >
                  <img src={fluent1} alt="" className="img-fluid" />
                </div>
                <div
                  className="rounded-circle dash-icon d-flex align-items-center justify-content-center"
                  style={{ width: "45px", height: "45px" }}
                >
                  15
                </div>
              </div>
              <img src={dropside}
                alt=""
                className="img-fluid ms-2 me-3"
                style={{ width: "30px", height: "35px" }}
              />
            </div>
          </div>
          <div className="card p-3">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <h6 className="dash-font fw-semibold fs-6">Perfomance Summary</h6>
                <p className="text-muted mb-5" style={{ fontSize: "12px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipis.
                </p>
                {/* <div className="align">
                  <RiArrowDropRightLine size={25} style={{ color: "4f46e5" }} />
                </div> */}
              </div>
              <img src={dropside}
                alt=""
                className="img-fluid ms-2 me-3"
                style={{ width: "30px", height: "35px" }}
              />
            </div>
            <div className="row m-0">
              <div className="col-md-4 col-12">
                <div className="row">
                  <div className=" col-md-9">
                    <p className="dash-font chart-heading text-muted">
                      SUBJECT
                    </p>
                    {/* <p className="dash-font fw-semibold fs-5">${data?.total_subscriptions}</p> */}
                    <p className="dash-font fw-semibold fs-5">Science</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="row">
                  <div className="col-md-9">
                    <p className="dash-font chart-heading text-muted">
                      COVERAGE
                    </p>
                    {/* <p className="dash-font fw-semibold fs-5">${data?.total_active_subscriptions}</p> */}
                    <p className="dash-font fw-semibold fs-5">36%</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-12">
                <div className="row">
                  <div className="col-md-9">
                    <p className="dash-font chart-heading text-muted pb-2">
                      WEAK AREAS
                    </p>
                    <span class="badge p-0 d-flex justify-content-center align-items-center"
                      style={{
                        borderRadius: "15px",
                        border: "1px solid #FB3748",
                        background: "#ffebed",
                        color: "#FB3748",
                        width: "60px"
                      }}>
                      <p className="ps-3">2
                        <RiArrowDropRightLine size={25} />
                      </p>
                    </span>
                    <p className="dash-font fw-semibold fs-5"></p>
                  </div>
                </div>
              </div>
              <div className="col-md-5 text-start">
                <ReactApexChart
                  options={state1.options}
                  series={state1.series}
                  type="donut"
                  width={200}
                />
              </div>
              <div className="col-md-7">
                <Chart
                  options={state.options}
                  series={state.series}
                  type="area"
                  width={250}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="card shadow-sm rounded-3">
            <p className="dash-font fw-semibold fs-6 px-3 pt-2">Leaderboard</p>
            <p className="text-muted px-3" style={{ fontSize: "12px" }}>
              Lorem ipsum dolor sit amet, consectetur adipis.
            </p>

            {/* Display the student with `its_me: true` */}
            {leaderboardData?.map((student, index) => {
              if (student.its_me) {
                return (
                  <div
                    className="card mx-4 mt-2"
                    style={{
                      background: "#EAE9FC",
                      height: "100%",
                    }}
                    key={index}
                  >
                    <div className="d-flex align-items-center justify-content-between py-2 px-3 rounded">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {student.profile && (
                            <img src={student.profile} alt="" className="img-fluid" />
                          )}
                        </div>
                        <span className="me-2 fw-12 fw-semibold">{student.rank}</span>
                        <span className="fw-semibold dash-font fw-14">
                          {student.student_name}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="me-2 dash-font fw-12">
                          {student.total_score} Units
                        </span>
                        <div className="d-flex">
                          <div
                            className="rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
                            style={{ width: "35px", height: "35px" }}
                          >
                            <img src={fluent} alt="" className="img-fluid" />
                          </div>
                          <div
                            className="rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
                            style={{ width: "35px", height: "35px" }}
                          >
                            <img src={fluent1} alt="" className="img-fluid" />
                          </div>
                          <div
                            className="rounded-circle dash-icon d-flex align-items-center justify-content-center"
                            style={{ width: "35px", height: "35px" }}
                          >
                            {student.attended_worksheets}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}

            <div
              className="card-body overflow-auto dash-scrool"
              style={{ maxHeight: "300px" }}
            >
              {leaderboardData?.map((student, index) => {
                if (!student.its_me) {
                  return (
                    <div
                      key={index}
                      className={`d-flex align-items-center justify-content-between px-2 pt-2 pb-3 mb-3`}
                      style={{ borderBottom: "rgb(228 228 228) 1px solid" }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {/* Display student image if available */}
                          {student.profile && (
                            <img src={student.profile} alt="" className="img-fluid" />
                          )}
                        </div>
                        <span className="me-2 fw-12 fw-semibold">{student.rank}</span>
                        <span className="fw-semibold dash-font fw-14">
                          {student.student_name}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="me-2 fw-12 dash-font">
                          {student.total_score} Units
                        </span>
                        <div className="d-flex">
                          <div
                            className="rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
                            style={{ width: "35px", height: "35px" }}
                          >
                            <img src={fluent} alt="" className="img-fluid" />
                          </div>
                          <div
                            className="rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
                            style={{ width: "35px", height: "35px" }}
                          >
                            <img src={fluent1} alt="" className="img-fluid" />
                          </div>
                          <div
                            className="rounded-circle dash-icon d-flex align-items-center justify-content-center"
                            style={{ width: "35px", height: "35px" }}
                          >
                            {student.attended_worksheets}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default AdminDashboard