
import icon from "../../assets/images/Icon.png";
import icon1 from "../../assets/images/Icon (1).png";
import icon2 from "../../assets/images/Icon (2).png";
import icon3 from "../../assets/images/Icon (3).png";
import icon4 from "../../assets/images/Icon (4).png";
import icon5 from "../../assets/images/Icon (5).png";
import icon6 from "../../assets/images/Icon (6).png";
import icon7 from "../../assets/images/Icon (7).png";
import userImages from "../../assets/images/userImages.png";
import Group from "../../assets/images/Group.png";
import Group1 from "../../assets/images/Group (1).png";
import Image from "../../assets/images/Image.png";
import fluent from "../../assets/images/fluent-emoji_confetti-ball.png";
import fluent1 from "../../assets/images/fluent-emoji_confetti-ball (1).png";
import { FaStar } from "react-icons/fa";
import Chart from "react-apexcharts";
import { useState } from "react";
import { FaMedal } from "react-icons/fa";

function AdminDashboard() {
  const [state, setState] = useState({
    options: {
      colors: ["#1FC16B", "#4F46E5", "#FB3748"],
      dataLabels: { enabled: false },
      legend: { show: false },
      chart: {
        id: "basic-bar",
        toolbar: {
          show: true,
          tools: false,
        },
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
    },
    series: [
      {
        name: "Total Fee Collected",
        data: [7, 7, 7, 7, 7, 7, 8],
      },
      {
        name: "Expenses",
        data: [5, 5, 5, 5, 5, 5, 7],
      },
      {
        name: "Total Fee Pending",
        data: [3, 3, 3, 3, 3, 1, 5],
      },
    ],
  });

  const leaderboardData = [
    { id: 1, name: "Anand", units: 56, rank: 1, image: userImages },
    { id: 2, name: "Evenly", units: 52, rank: 2, image: Group },
    { id: 3, name: "Amy", units: 46, rank: 3, image: Group1 },
    { id: 4, name: "Amelie", units: 46, rank: 4, image: userImages },
    {
      id: 5,
      name: "Current User",
      units: 32,
      rank: 5,
      image: Image,
    },
  ];
  const progressValues = [
    { centerName: "Center A", value: 75 },
    { centerName: "Center B", value: 60 },
    { centerName: "Center C", value: 45 },
    { centerName: "Center D", value: 90 },
    { centerName: "Center E", value: 50 },
  ];
  const quizResults = [
    { quizName: "React Basics", score: "85%" },
    { quizName: "JavaScript Advanced", score: "92%" },
    { quizName: "CSS Mastery", score: "78%" },
    { quizName: "Bootstrap Design", score: "88%" },
    { quizName: "API Integration", score: "90%" },
  ];
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
                 <p className="dash-font ">Centers</p>
                 <p className="dash-font heading-color fw-bold">3</p>
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
                       <p className="dash-font text-nowrap">Students</p>
                       <p className="dash-font heading-color fw-bold">5,000</p>
                     </div>
                   </div>
                   <div className="col-6">
                     <div className="">
                       <p className="dash-font text-nowrap">Avarage</p>
                       <p className="dash-font heading-color fw-bold">3</p>
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
                 <img src={icon2} alt="" className="py-3 img-fluid ms-2 " />
               </div>
               <div className="col-md-7 col-12 py-3">
                 <p className="dash-font">Teacher</p>
                 <p className="heading-color fw-bold">200</p>
               </div>
             </div>
           </div>
         </div>
         <div className="col-md-2 col-12 ps-md-0">
           <div className="card">
             <div className="row">
               <div className="col-md-5 col-12">
                 <img src={icon3} alt="" className="py-3 img-fluid ms-2 " />
               </div>
               <div className="col-md-7 col-12 py-3">
                 <p className="dash-font ">Parents</p>
                 <p className="dash-font heading-color fw-bold">9,500</p>
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
                 <p className="dash-font ">Active</p>
                 <p className="dash-font heading-color fw-bold">15</p>
               </div>
             </div>
           </div>
         </div>
       </div>
       <div className="row m-0">
         <div className="col-md-6 col-12">
           <div className="card p-3 h-100">
             <div className="d-flex justify-content-between mb-3">
               <div>
                 <h6 className="dash-font fw-semibold fs-6">Financial Info</h6>
                 <p className="text-muted mb-5" style={{ fontSize: "12px" }}>
                   Lorem ipsum dolor sit amet, consectetur adipis.
                 </p>
               </div>
             </div>
             <div className="row m-0">
               <div className="col-md-6 col-12">
                 <div className="row">
                   <div className="col-md-3">
                     <img
                       src={icon5}
                       alt=""
                       className=" img-fluid"
                       style={{ maxWidth: "250px" }}
                     />
                   </div>
                   <div className=" col-md-9">
                     <p className="dash-font chart-heading text-muted">
                       SUBSCRIBES
                     </p>
                     <p className="dash-font fw-semibold fs-5">$1,155,500</p>
                   </div>
                 </div>
               </div>
               <div className="col-md-6 col-12">
                 <div className="row">
                   <div className=" col-md-3">
                     <img
                       src={icon6}
                       alt=""
                       className=" img-fluid"
                       style={{ maxWidth: "250px" }}
                     />
                   </div>
                   <div className="col-md-9">
                     <p className="dash-font chart-heading text-muted">
                       ACTIVE SUBSCRIBES
                     </p>
                     <p className="dash-font fw-semibold fs-5">$255,500</p>
                   </div>
                 </div>
               </div>
               <div className="col-md-6 col-12">
                 <div className="row">
                   <div className=" col-md-3">
                     <img
                       src={icon7}
                       alt=""
                       className=" img-fluid"
                       style={{ maxWidth: "250px" }}
                     />
                   </div>
                   <div className="col-md-9">
                     <p className="dash-font chart-heading text-muted">
                       SUBSCRIBERS
                     </p>
                     <p className="dash-font fw-semibold fs-5">$555,500</p>
                   </div>
                 </div>
               </div>
               <div className="col-md-6 col-12">
                 <div className="row">
                   <div className=" col-md-3">
                     <img
                       src={icon7}
                       alt=""
                       className=" img-fluid"
                       style={{ maxWidth: "250px" }}
                     />
                   </div>
                   <div className="col-md-9">
                     <p className="dash-font chart-heading text-muted">
                       REVENUE
                     </p>
                     <p className="dash-font fw-semibold fs-5">$555,500</p>
                   </div>
                 </div>
               </div>
             </div>
             <Chart
               options={state.options}
               series={state.series}
               type="area"
               width="100%"
               height="250"
             />
           </div>
         </div>
         <div className="col-md-6 col-12">
           <div className="card h-100 shadow-sm rounded-3">
             <p className="dash-font fw-semibold fs-6 px-3 pt-2">Leaderboard</p>
             <p className="text-muted px-3" style={{ fontSize: "12px" }}>
               Lorem ipsum dolor sit amet, consectetur adipis.
             </p>
             <div
               className="card-body overflow-auto dash-scrool"
               style={{ maxHeight: "300px" }}
             >
               {leaderboardData.map((user) => (
                 <div
                   key={user.id}
                   className={`d-flex align-items-center justify-content-between p-2 rounded`}
                 >
                   <div className="d-flex align-items-center">
                     <div
                       className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                       style={{ width: "40px", height: "40px" }}
                     >
                       <img src={user.image} alt="" className="img-fluid" />
                     </div>
                     <span className="me-2">{user.rank}.</span>
                     <span className="fw-narmal dash-font">{user.name}</span>
                   </div>
                   <div className="d-flex align-items-center">
                     <span className="me-2 fw-light dash-font">
                       {user.units} Units
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
                         15+
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
         <div className="col-md-6 col-12 mt-5">
           <div className="card h-100 shadow-sm rounded-3">
             <div className="d-flex justify-content-end">
               <input
                 className="m-2 p-1 form-control form-control-sm w-25"
                 type="month"
               />
             </div>
             <div className="card-header bg-white d-flex justify-content-between">
               <h6 className="dash-font fw-semibold fs-6">Top Challenges</h6>
               <h6 className="dash-font fw-semibold fs-6">
                 Top Question Results
               </h6>
             </div>
             <div
               className="dash-font card-body overflow-auto dash-scrool"
               style={{ maxHeight: "150px" }}
             >
               {quizResults.map((quiz, index) => (
                 <div key={index} className="dash-font  p-2 rounded row">
                   <div className="col-6">
                     <div className="dash-font d-flex align-items-center justify-content-start">
                       <div
                         className="dash-font rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
                         style={{ width: "35px", height: "35px" }}
                       >
                         <FaMedal size={16} className="text-primary"/>
                       </div>
                       <span className="dash-font me-2">{index + 1}.</span>
                       <span className="dash-font fw-normal">
                         {quiz.quizName}
                       </span>
                     </div>
                   </div>
                   <div className="col-6">
                     <div className="dash-font d-flex align-items-center justify-content-start">
                       <div
                         className="dash-font rounded-circle dash-icon d-flex align-items-center justify-content-center me-1"
                         style={{ width: "35px", height: "35px" }}
                       >
                         <FaStar size={16} />
                       </div>
                       <span className="dash-font fw-normal">
                         {quiz.quizName}
                       </span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
         <div className=" col-md-6 col-12 mt-5">
           <div
             className="card shadow-sm p-3 h-100 border-0"
             style={{
               borderRadius: "10px",
               maxHeight: "270px",
               overflowY: "auto",
             }}
           >
             <div className="d-flex justify-content-between">
               <h6 className="dash-font fw-semibold fs-6 mt-2">Revenue</h6>
               {/* <div className="d-flex justify-content-end"> */}
               <input className="m-2 p-1 form-control form-control-sm w-25" type="month" />
             {/* </div> */}
             </div>
             <p className="text-muted mb-5" style={{ fontSize: "12px" }}>
               Lorem ipsum dolor sit amet, consectetur adipis.
             </p>
             {progressValues.map((center, index) => (
               <div key={index}>
                 <div className="d-flex justify-content-between">
                   <p
                     className="text-secondary m-1 dash-font"
                     style={{ fontSize: "14px" }}
                   >
                     {center.centerName}
                   </p>
                   <span style={{ fontSize: "13px" }} className="">
                     {center.value}
                   </span>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </section>
  )
}

export default AdminDashboard