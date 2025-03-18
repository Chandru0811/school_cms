// import icon from "../../assets/images/Icon.png";
// import icon1 from "../../assets/images/Icon (1).png";
// import icon2 from "../../assets/images/Icon (2).png";
// import icon3 from "../../assets/images/Icon (3).png";
// import icon4 from "../../assets/images/Icon (4).png";
// import icon5 from "../../assets/images/Icon (5).png";
// import icon6 from "../../assets/images/Icon (6).png";
// import icon7 from "../../assets/images/Icon (7).png";
// import userImages from "../../assets/images/userImages.png";
// import Group from "../../assets/images/Group.png";
// import Group1 from "../../assets/images/Group (1).png";
// import Image from "../../assets/images/Image.png";
// import fluent from "../../assets/images/fluent-emoji_confetti-ball.png";
// import fluent1 from "../../assets/images/fluent-emoji_confetti-ball (1).png";
// import { FaStar } from "react-icons/fa";
// import Chart from "react-apexcharts";
// import { useEffect, useState } from "react";
// import { FaMedal } from "react-icons/fa";
// import toast from "react-hot-toast";
// import api from "../../config/URL";
// import userImage from "../../assets/images/user_profile.svg";
// import ImageURL from "../../config/ImageURL";
// import axios from "axios";
// import confettiImage from "../../assets/images/rankbackground.svg";

// function TeacherDashboard() {
//   const [data, setData] = useState();
//   const [currentMonth, setCurrentMonth] = useState("");
//   const [currentMonth1, setCurrentMonth1] = useState("");
//   const [maxMonth, setMaxMonth] = useState("");
//   const [activity, setActivity] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const adminToken =
//     "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZTViOTJmNy0zZmE4LTQxNTAtYmQwMi04ZDcwMjJkYTQyYzgiLCJqdGkiOiIwNjYxNTk1ZDRmYmVjMjlmNTQ0NGM0YjZiYzQwOTQ5ZmVkM2RkMWY4ZTg2NjkwZDViZmVhZTE4MTdkNzA1NzBjOTg5ZTFkNmFlOWNmYTBkNyIsImlhdCI6MTc0MTk1MDMzNy45OTU2MTgsIm5iZiI6MTc0MTk1MDMzNy45OTU2MiwiZXhwIjoxNzczNDg2MzM3Ljk4NjUyNCwic3ViIjoiMiIsInNjb3BlcyI6W119.Bu5tx87VBR5XpbEUN5J9_EnkulifzN3V5bcvY66l0yUcaDM56NOYRAohkUMHRx3X_6xel7oCVO1dN9ct1u1o42j9eKd7D7BLgMzjtZE1N5XLFdxiz_ETOWawmmOaKi0BsDkJZAg3vfUtK0KLIsampQEDSMekZ6EC5hua-Qi-7fcuRDF9jSQl5zxsjE4SGNHZzuxpGXdOWw_-IFDpPmAQe5h-MF6m1N6VqywMVAtvA2BsVNV_iCyafIwK7fI149q9UJE5SVTPYBajr4mBOjqocl0ncu-M5oJbkzXCdg0gg98kXmKIcN4wexfqvyV4j461CFC5v5_eAJCsByyUbl86CetvAqZE4I5Vp6eJ0lykcWya4J9yDW3xNl37F7ddONabgOwoSvh1jpwSIZSuiDIpqxbpL56OHyk_i4-e8hNOS6_V0AreZDeIoiDoh4y9Su8zGIQ1WWU75w17jqDakqSlzj5yFiHCsuLHpCqBFEQJ6zXt9Nov14eeNYjJFZKbPt1avOZHn9Pk4KsOYi81cXiGgAvNZueYhmy8ODky1s98UsN2h--Yu4vGf-qVpdSqtcxDtP39fbVhkwEjwKm0kre1EBYGAluU8rBkaCD20IvfX4Ujy610IJywEFPXqfsZtO08kcav1yPDsVFsqUKltBlxyoY0E_a0eoPwSluuhjwHtec";
//   const studentToken =
//     "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZTViOTJmNy0zZmE4LTQxNTAtYmQwMi04ZDcwMjJkYTQyYzgiLCJqdGkiOiIxYjZhNTcxNjgyZjE4YjQwODM2MGQ0ODEwZWI2MTc5OTNiYTBlZDhmMjVmYjA1MzA1NzQxZGE2MDlhZGE1OTE4MGQ5NWUxMTcwOGNmNGM5YSIsImlhdCI6MTc0MTk1NDUxOS4yMzg1MDMsIm5iZiI6MTc0MTk1NDUxOS4yMzg1MDcsImV4cCI6MTc3MzQ5MDUxOS4yMjM0MTMsInN1YiI6IjciLCJzY29wZXMiOltdfQ.h1MGoer0HPccJz0Gsz2DWaOxfMy391KU3u6slnIjkpeOpho9_gLexhQKdCtt-PflkYuGkmiyHria86aXqUjCgBl88gctExpk7ohnqZk__Rw_GPOAaLLN8vz9N4_8BB4lqon_fK42OdyazLY2XAsIOTSGkaHJMTYMHvWHrrKopwuTIZx_CmGlpLQrcvtsTvHK5l0cr2HERoUskuumtFhOWIxt7SdtMJgGvqFo9YpiZdkgqDbIpzxdR8H57BNn_QYkr6lh0hgeFGEJgdM6rHw75ArjJKEq46ps_D8A7hJugdS_AqbcVo4v6y6B5eoKfFJiBGa1F85vFT9VA3REreuigQVbdQWlVQv_4tCvqp21juhqv0tAjOewRROIK9u5nyrY7nBAmc0s_asWjwLp92we68xamTIDXsFp-2iqr0rJJe8oftaBXHGcTUOhJOpUD2mBD2M-EhwFbLo4NNU6v8yoJJb--WMci0DMIRSxEwEgcGXMap7RQQpACz8enfueR0R7Hk1XvwkzgBTYsD36Nzh8a7Mw4FQkhdD2MavV6qVsG_oCF0QK-vbxiUNwImLv5EU1Gm9McE6ybFl_FbxfOr4dxH1S0n2RqgWAw2_9G_ZIrm4fKLKQZgtj8gNCtFbJDlo3M-a1Z5Vp_h6EgxTa24J2bnUwAN4ZICzXmzNVnD51UGs";
//   const leaderboardData = data?.leaderboard;
//   const revenue = data?.subscription_revenue;
//   const challengeResults = data?.top_challenge_worksheets;
//   const questionResults = data?.top_question_worksheets;
//   console.log("object", activity);
//   const [state, setState] = useState({
//     options: {
//       colors: ["#1FC16B", "#4F46E5", "#FB3748"],
//       dataLabels: { enabled: false },
//       legend: { show: false },
//       chart: {
//         id: "basic-bar",
//         toolbar: {
//           show: true,
//           tools: false,
//         },
//       },
//       xaxis: {
//         categories: [],
//       },
//     },
//     series: [],
//   });

//   const handleMonthChangeWorkheet = async (event) => {
//     const selectedValue = event.target.value;
//     setCurrentMonth(selectedValue);
//     const values = { month_year: selectedValue };
//     try {
//       //   const response = await api.post("admin/topWorksheets", values);
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/admin/topWorksheets",
//         values,
//         {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         console.log("API Response:", response);
//         // Update the state with the response data
//         setData((prevData) => ({
//           ...prevData,
//           top_challenge_worksheets: response.data.data.top_challenge_worksheets,
//           top_question_worksheets: response.data.data.top_question_worksheets,
//         }));
//         toast.success(response.data?.message);
//       }
//     } catch (error) {
//       toast.error(e?.response?.data?.error);
//       toast.error(e?.response?.data?.message);
//     }
//   };

//   const handleMonthChangeRevenue = async (event) => {
//     const selectedValue = event.target.value;
//     setCurrentMonth1(selectedValue);
//     const values = { month_year: selectedValue };
//     try {
//       //   const response = await api.post("admin/subscription/revenue", values);
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/admin/subscription/revenue",
//         values,
//         {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//           },
//         }
//       );
//       if (response.status === 200) {
//         console.log("API Response:", response);
//         // Update the state with the response data
//         setData((prevData) => ({
//           ...prevData,
//           subscription_revenue: response.data.data.subscription_revenue,
//         }));
//         toast.success(response.data?.message || "Data fetched successfully!");
//       }
//     } catch (error) {
//       toast.error(e?.response?.data?.error);
//       toast.error(e?.response?.data?.message);
//     }
//   };
//   const withParentToken = async () => {
//     setLoading(true);
//     try {
//       //   const response = await api.get("parent/dashboard");
//       const response = await axios.get(
//         "http://127.0.0.1:8000/api/parent/dashboard",
//         {
//           headers: {
//             Authorization: `Bearer ${studentToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const apiData = response.data.data;
//       setActivity(apiData.activity);
//     } catch (e) {
//       if (e?.response?.status === 403) {
//         toast.error("Don't have access to this page");
//       } else {
//         toast.error(e?.response?.data?.error);
//         toast.error(e?.response?.data?.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getData = async () => {
//     try {
//       setLoading(true);
//       //   const response = await api.get("admin/dashboard");
//       const response = await axios.get(
//         "http://127.0.0.1:8000/api/admin/dashboard",
//         {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setData(response.data.data);
//       if (response.data.data.chart_data) {
//         setState((prevState) => ({
//           ...prevState,
//           options: {
//             ...prevState.options,
//             xaxis: {
//               categories: response.data.data.chart_data.label, // Update x-axis labels
//             },
//           },
//           series: response.data.data.chart_data.series, // Update series data
//         }));
//       }
//     } catch (e) {
//       if (e?.response?.status === 403) {
//         toast.error("Don't have access to this page");
//       } else {
//         toast.error(e?.response?.data?.error);
//         toast.error(e?.response?.data?.message);
//         toast.error("e?.response?.data?.message");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getData();
//     withParentToken();
//     const today = new Date();
//     const formattedDate = today.toISOString().slice(0, 7);
//     setCurrentMonth(formattedDate);
//     setCurrentMonth1(formattedDate);
//     setMaxMonth(formattedDate);
//   }, []);

//   return (
//     <section className="" style={{ minHeight: "80vh" }}>
//       {loading ? (
//         <div
//           className="d-flex justify-content-center align-items-center"
//           style={{ height: "600px" }}
//         >
//           <div className="spinner-border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="row m-0 py-2">
//             <div className="d-flex">
//               <h6 className="mb-5 fs-5 fw-semibold dash-font me-2">
//                 Hey Username -
//               </h6>
//               <span> here's how things are going</span>
//             </div>
//             <div className="col-md-2 col-12 ">
//               <div className="card">
//                 <div className="row">
//                   <div className="col-md-5 col-12 ">
//                     <img src={icon} alt="" className=" img-fluid ms-2 py-3 " />
//                   </div>
//                   <div className="col-md-7 col-12 py-3">
//                     <p className="dash-font fw-12 fw-semibold">CENTRES</p>
//                     <p className="dash-font heading-color fw-bold">
//                       {data?.total_centers}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4 col-12 ps-md-0 ">
//               <div className="card">
//                 <div className="row ">
//                   <div className=" col-md-3 col-12">
//                     <img src={icon1} alt="" className="py-3 img-fluid ms-4 " />
//                   </div>
//                   <div className="col-md-9 col-12 py-3">
//                     <div className="row m-0">
//                       <div className="col-6">
//                         <div className="border-end pe-2">
//                           <p className="dash-font text-nowrap fw-12 fw-semibold">
//                             STUDENTS
//                           </p>
//                           <p className="dash-font heading-color fw-bold">
//                             {data?.total_students}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="col-6">
//                         <div className="">
//                           <p className="dash-font text-nowrap fw-12 fw-semibold">
//                             AVERAGE
//                           </p>
//                           <p className="dash-font heading-color fw-bold">
//                             {data?.average_score}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-2 col-12 ps-md-0">
//               <div className="card">
//                 <div className="row">
//                   <div className="col-md-5 col-12">
//                     <img src={icon2} alt="" className="py-3 img-fluid ms-2 " />
//                   </div>
//                   <div className="col-md-7 col-12 py-3">
//                     <p className="dash-font fw-12 fw-semibold">TEACHER</p>
//                     <p className="heading-color fw-bold">
//                       {data?.total_employees}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-2 col-12 ps-md-0">
//               <div className="card">
//                 <div className="row">
//                   <div className="col-md-5 col-12">
//                     <img src={icon3} alt="" className="py-3 img-fluid ms-2 " />
//                   </div>
//                   <div className="col-md-7 col-12 py-3">
//                     <p className="dash-font fw-12 fw-semibold">PARENTS</p>
//                     <p className="dash-font heading-color fw-bold">
//                       {data?.total_parents}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-2 col-12 ps-md-0">
//               <div className="card">
//                 <div className="row">
//                   <div className="col-md-5 col-12">
//                     <img src={icon4} alt="" className="py-3 img-fluid ms-2 " />
//                   </div>
//                   <div className="col-md-7 col-12 py-3">
//                     <p className="dash-font fw-12 fw-semibold">ACTIVE WS</p>
//                     <p className="dash-font heading-color fw-bold">
//                       {data?.active_worksheets}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="row m-0">
//             <div className="col-md-6 col-12">
//               <div className="card h-100 shadow-sm rounded-3">
//                 <p className="dash-font fw-semibold fs-6 px-3 pt-2">
//                   Leaderboard
//                 </p>
//                 <p className="text-muted px-3" style={{ fontSize: "12px" }}>
//                   Lorem ipsum dolor sit amet, consectetur adipis.
//                 </p>
//                 <div className="leaderboard p-3">
//                   <img src={confettiImage} alt="confetti" />
//                   <div className="rankcard d-flex justify-content-between">
//                     {leaderboardData
//                       ?.filter((student) =>
//                         ["1st", "2nd", "3rd"].includes(student.rank)
//                       )
//                       .sort(
//                         (a, b) =>
//                           ["2nd", "1st", "3rd"].indexOf(a.rank) -
//                           ["2nd", "1st", "3rd"].indexOf(b.rank)
//                       )
//                       .map((student) => (
//                         <div
//                           key={student.id || student.rank}
//                           className="d-flex flex-col align-items-end"
//                         >
//                           <div
//                             className={`rank-card rank-${student.rank} flex flex-col items-center rounded-b-none`}
//                           >
//                             <div className="mt-0">
//                               <img
//                                 src={
//                                   student.profile
//                                     ? `${ImageURL.replace(
//                                         /\/$/,
//                                         ""
//                                       )}/${student.profile.replace(/^\//, "")}`
//                                     : userImage
//                                 }
//                                 alt="user"
//                                 className="rankimage"
//                                 onError={(e) => (e.target.src = userImage)}
//                               />
//                             </div>
//                             <div className="rankname">
//                               <p className="fw-semibold dash-font fw-10">
//                                 {student.student_name}
//                               </p>
//                               <p className="fw-10 dash-font">
//                                 {student.total_score} Units
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//                 <div
//                   className="card-body overflow-auto dash-scrool"
//                   style={{ maxHeight: "300px" }}
//                 >
//                   {leaderboardData?.map((student, index) => (
//                     <div
//                       key={index}
//                       className={`d-flex align-items-center justify-content-between px-2 pt-2 pb-3 mb-3`}
//                       style={{ borderBottom: "rgb(228 228 228) 1px solid" }}
//                     >
//                       <div className="d-flex align-items-center">
//                         <div
//                           className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
//                           style={{ width: "40px", height: "40px" }}
//                         >
//                           <img
//                             src={
//                               student?.profile
//                                 ? `${ImageURL.replace(
//                                     /\/$/,
//                                     ""
//                                   )}/${student.profile.replace(/^\//, "")}`
//                                 : userImage
//                             }
//                             alt="user"
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               borderRadius: "50%",
//                               objectFit: "cover",
//                             }}
//                             onError={(e) => (e.target.src = userImage)}
//                           />
//                         </div>
//                         <span className="me-2 fw-12 fw-semibold">
//                           {student.rank}.
//                         </span>
//                         <span className="fw-semibold dash-font fw-14">
//                           {student.student_name}
//                         </span>
//                       </div>
//                       <div className="d-flex align-items-center">
//                         <span className="me-2 dash-font fw-12">
//                           {student.total_score} Units
//                         </span>
//                         <div className="d-flex">
//                           <div
//                             className="rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
//                             style={{ width: "35px", height: "35px" }}
//                           >
//                             <img src={fluent} alt="" className="img-fluid" />
//                           </div>
//                           <div
//                             className="rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
//                             style={{ width: "35px", height: "35px" }}
//                           >
//                             <img src={fluent1} alt="" className="img-fluid" />
//                           </div>
//                           <div
//                             className="rounded-circle dash-icon d-flex align-items-center justify-content-center"
//                             style={{ width: "35px", height: "35px" }}
//                           >
//                             <p className="fw-semibold dash-font fw-14">
//                               {" "}
//                               {student.attended_worksheets}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-6 col-12">
//               <div className="card shadow-sm rounded-3 mb-3">
//                 <p className="dash-font fw-semibold fs-6 px-3 pt-2">Activity</p>
//                 <p
//                   className="text-muted px-3 mb-3"
//                   style={{ fontSize: "12px" }}
//                 >
//                   Lorem ipsum dolor sit amet, consectetur adipis.
//                 </p>
//                 <div
//                   className="card-body overflow-auto dash-scrool"
//                   style={{ maxHeight: "378px" }}
//                 >
//                   {activity?.map((active, index) => (
//                     <div
//                       key={index}
//                       className={`card activitycard px-2 pt-2 pb-3 mb-3`}
//                       // style={{ borderBottom: "rgb(228 228 228) 1px solid" }}
//                     >
//                       <span className="me-2 fw-14 fw-semibold heading-color">
//                         {active.title}
//                       </span>
//                       <span className="fw-semibold dash-font fw-12">
//                         {active.type}
//                       </span>
//                       <div className="activitycard1 d-flex align-items-center py-2 px-3 rounded">
//                         <div
//                           className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
//                           style={{ width: "20px", height: "20px" }}
//                         >
//                           <img
//                             src={
//                               active.profile
//                                 ? `${ImageURL.replace(
//                                     /\/$/,
//                                     ""
//                                   )}/${active.profile.replace(/^\//, "")}`
//                                 : userImage
//                             }
//                             alt="user"
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               borderRadius: "50%",
//                               objectFit: "cover",
//                             }}
//                             onError={(e) => (e.target.src = userImage)}
//                           />
//                         </div>
//                         <span className="me-2 dash-font fw-12 fw-semibold">
//                           {active.name}
//                         </span>
//                         <span className="me-2 dash-font fw-12 fw-semibold">
//                           {active.created_at}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div
//                 className="card shadow-sm p-3 h-100 border-0"
//                 style={{
//                   borderRadius: "10px",
//                   maxHeight: "270px",
//                   overflowY: "auto",
//                 }}
//               >
//                 <div className="d-flex justify-content-between">
//                   <h6 className="dash-font fw-semibold fs-6 mt-2">Revenue</h6>
//                   <input
//                     className="m-2 p-1 form-control form-control-sm"
//                     type="month"
//                     value={currentMonth1}
//                     max={maxMonth}
//                     onChange={handleMonthChangeRevenue}
//                     style={{ width: "9rem" }}
//                   />
//                 </div>
//                 <p className="text-muted mb-5" style={{ fontSize: "12px" }}>
//                   Lorem ipsum dolor sit amet, consectetur adipis.
//                 </p>
//                 {revenue && revenue.length > 0 ? (
//                   revenue.map((revenue, index) => (
//                     <div key={index}>
//                       <div className="d-flex justify-content-between">
//                         <p
//                           className="text-secondary m-1 dash-font"
//                           style={{ fontSize: "14px" }}
//                         >
//                           {revenue.subscription_name}
//                         </p>
//                         <span style={{ fontSize: "13px" }} className="">
//                           {revenue.total_revenue}
//                         </span>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-start text-muted p-3">
//                     No Revenue in Selected Month/Year
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="col-md-6 col-12 mt-5">
//               <div className="card h-100 shadow-sm rounded-3">
//                 <div className="d-flex justify-content-end">
//                   <input
//                     className="m-2 p-1 form-control form-control-sm"
//                     type="month"
//                     value={currentMonth}
//                     max={maxMonth}
//                     onChange={handleMonthChangeWorkheet}
//                     style={{ width: "9rem" }}
//                   />
//                 </div>
//                 <div className="card-header bg-white d-flex justify-content-between">
//                   <h6 className="dash-font fw-semibold fs-6">Top Challenges</h6>
//                   <h6 className="dash-font fw-semibold fs-6">
//                     Top Question Results
//                   </h6>
//                 </div>
//                 <div
//                   className="dash-font card-body overflow-auto dash-scrool row"
//                   style={{ maxHeight: "150px" }}
//                 >
//                   <>
//                     <div className="col-6">
//                       {challengeResults && challengeResults.length > 0 ? (
//                         challengeResults.map((challenge, index) => (
//                           <div key={index} className="p-2 rounded row">
//                             <div className="dash-font d-flex align-items-center justify-content-start">
//                               <div
//                                 className="dash-font rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
//                                 style={{ width: "35px", height: "35px" }}
//                               >
//                                 <FaMedal size={16} className="text-primary" />
//                               </div>
//                               <span className="dash-font me-2">
//                                 {index + 1}.
//                               </span>
//                               <span className="dash-font fw-normal">
//                                 {challenge.title}
//                               </span>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-start text-muted p-3">
//                           No Challenge Results in Selected Month/Year
//                         </p>
//                       )}
//                     </div>
//                     <div className="col-6">
//                       {questionResults && questionResults.length > 0 ? (
//                         questionResults.map((challenge, index) => (
//                           <div key={index} className="p-2 rounded row">
//                             <div className="dash-font d-flex align-items-center justify-content-start">
//                               <div
//                                 className="dash-font rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
//                                 style={{ width: "35px", height: "35px" }}
//                               >
//                                 <FaMedal size={16} className="text-primary" />
//                               </div>
//                               <span className="dash-font me-2">
//                                 {index + 1}.
//                               </span>
//                               <span className="dash-font fw-normal">
//                                 {challenge.title}
//                               </span>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-start text-muted p-3">
//                           No Question Results in Selected Month/Year
//                         </p>
//                       )}
//                     </div>
//                   </>
//                 </div>
//               </div>
//             </div>
//             <div className=" col-md-6 col-12 mt-5">
              
//             </div>
//           </div>
//         </>
//       )}
//     </section>
//   );
// }

// export default TeacherDashboard;
