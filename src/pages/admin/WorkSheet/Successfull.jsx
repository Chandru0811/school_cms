import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoMdShare } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import success from "../../../assets/images/tick.png";
import successbg from "../../../assets/images/successbg.svg";
import medalbg from "../../../assets/images/medalbg.svg";
import correct from "../../../assets/images/correct.svg";
import skipped from "../../../assets/images/skipped.svg";
import wrong from "../../../assets/images/wrong.svg";
import reward from "../../../assets/images/reward.svg";
import medal from "../../../assets/images/medal.svg";
import { IoClose } from "react-icons/io5";
import ReactApexChart from 'react-apexcharts';
import { LiaMedalSolid } from 'react-icons/lia';
import { AiOutlineFileProtect } from 'react-icons/ai';
import { MdNavigateNext } from 'react-icons/md';

function Successfull() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const total_correct_questions = queryParams.get("total_correct_questions");
    const total_wrong_questions = queryParams.get("total_wrong_questions");
    const total_skipped_questions = queryParams.get("total_skipped_questions");
    const rewards = queryParams.get("rewards");
    const best_score = queryParams.get("best_score");
    const total_questions = queryParams.get("total_questions");
    const title = queryParams.get("title");
    const id = queryParams.get("id");
    console.log("title", title);

    const [state, setState] = useState({
        series: [85],
        options: {
            chart: {
                type: 'radialBar',
                toolbar: {
                    show: true
                }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -10,
                    endAngle: 360,
                    hollow: {
                        margin: 0,
                        size: '75%',
                        background: '#fff',
                        image: undefined,
                        imageOffsetX: 0,
                        imageOffsetY: 0,
                        position: 'front',
                        _dropShadow: {
                            enabled: false
                        },
                        get dropShadow() {
                            return this._dropShadow;
                        },
                        set dropShadow(value) {
                            this._dropShadow = value;
                        },
                    },
                    track: {
                        background: '#e9f9f0',
                        strokeWidth: '67%',
                        margin: 0,
                        stroke: '#d1f2e1', // 1px solid border
                        dropShadow: {
                            enabled: false // Remove hover effect
                        }
                    },
                    dataLabels: {
                        show: true,
                        name: {
                            offsetY: -10,
                            show: true,
                            color: 'rgba(153,153,153,255)', // Text color
                            fontSize: '17px'
                        },
                        value: {
                            formatter: function (val) {
                                return `${parseInt(val)}%`; // Add '%' to the value
                            },
                            color: '#1fc16b', // Text color
                            fontSize: '30px',
                            show: true
                        }
                    }
                }
            },
            fill: {
                type: 'solid',
                colors: ['#1fc16b'], // Solid green color (no gradient)
            },
            stroke: {
                lineCap: 'round'
            },
            labels: ['24M:20S'],
            states: {
                hover: {
                    filter: {
                        type: 'none' // Disable hover filter effect
                    }
                }
            }
        },
    });

    return (
        <section>
            <div className="container-fluid px-0">
                <div className="container-fluid px-0">
                    <div className="d-flex px-4 justify-content-between align-items-center  p-1 mb-4">
                        <div className="d-flex align-items-center">
                            <span className="mx-3 table-heading dash-font">
                                {/* {data.title} -&nbsp; */}
                                {title || "Worksheet Name"} -&nbsp;
                                <span className="dash-font table-subheading">
                                    Result
                                </span>
                            </span>
                        </div>
                        <div className="">
                            <Link to={`/worksheet/view/${id}`}>
                                <button type="button" className="dash-font btn btn-sm quit-btn">
                                    <IoClose size={15} />&nbsp;
                                    Quit
                                </button>
                            </Link>
                            &nbsp;&nbsp;
                        </div>
                    </div>
                </div>
                <div className="row border-1 rounded-3 m-0">
                    <div className='col-md-6 col-12'>
                        {best_score === "true" ? (
                            <div className='d-flex justify-cxontent-start align-items-start medalbg'>
                                <span className='mt-2'
                                    style={{
                                        backgroundColor: "#4F46E5",
                                        color: "white",
                                        borderRadius: "50%",
                                        padding: "6px",
                                    }}
                                >
                                    <LiaMedalSolid size={30} />
                                </span>
                                <div className='ms-4 mt-2'>
                                    <h4 className='dash-font' style={{ color: "#4F46E5" }}>New Personal Best</h4>
                                    <p className='fw-semibold dash-font fw-14' style={{ color: "#333333" }}>
                                        {total_correct_questions} of {total_questions} Correct Answers
                                    </p>
                                </div>
                            </div>
                        ) : null}
                        <div className='mt-5 p-3'>
                            <h2 className='fw-semibold dash-font'>Great effort!</h2>
                            <h4 className='fw-semibold dash-font fw-14'
                                style={{ color: "#5D5D5D" }}>You're improving steadily in Science.</h4>
                        </div>
                        <div className='row mt-5 p-3'>
                            <div className='col-md-6'>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={correct}
                                        alt="medal"
                                        className="img-fluid m-3 p-0"
                                        style={{
                                            // maxWidth: "35%",
                                            // minHeight: "100%",
                                        }}
                                    />
                                    <div className=''>
                                        <p className='dash-font fw-semibold text-black fw-12 m-0'>
                                            CORRECT
                                        </p>
                                        <h4 className='dash-font fw-semibold m-0'
                                            style={{ color: "#1fc16b" }}>
                                            {total_correct_questions} Questions
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={wrong}
                                        alt="medal"
                                        className="img-fluid m-3 p-0"
                                        style={{
                                            // maxWidth: "35%",
                                            // minHeight: "100%",
                                        }}
                                    />
                                    <div className=''>
                                        <p className='dash-font fw-semibold text-black fw-12 m-0'>
                                            WRONG
                                        </p>
                                        <h4 className='dash-font fw-semibold m-0'
                                            style={{ color: "#fb3748" }}>
                                            {total_wrong_questions} Questions
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={skipped}
                                        alt="medal"
                                        className="img-fluid m-3 p-0"
                                        style={{
                                            // maxWidth: "35%",
                                            // minHeight: "100%",
                                        }}
                                    />
                                    <div className=''>
                                        <p className='dash-font fw-semibold text-black fw-12 m-0'>
                                            SKIPPED
                                        </p>
                                        <h4 className='dash-font fw-semibold m-0'
                                            style={{ color: "#dfb402" }}>
                                            {total_skipped_questions} Questions
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={reward}
                                        alt="medal"
                                        className="img-fluid m-3 p-0"
                                        style={{
                                            maxWidth: "35%",
                                        }}
                                    />
                                    <div>
                                        <p className='dash-font fw-semibold text-black fw-12 m-0'>
                                            REWARD
                                        </p>
                                        <h4 className='dash-font fw-semibold m-0'
                                            style={{ color: "#4f46e5" }}>
                                            +{rewards} Points
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6 m-0 mt-5 py-5'>
                                <button className='success-btn dash-font fw-semibold'>
                                    <AiOutlineFileProtect size={25} />  View Answer
                                </button>
                            </div>
                            <div className='col-md-6 mt-5 py-5'>
                                <Link to={`/worksheet/view/${id}`}>
                                    <button className='success-btn dash-font fw-semibold'>
                                        Go to worksheets<MdNavigateNext size={25} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-12 position-relative px-0'>
                        <div className='d-flex justify-content-end align-items-end'>
                            <img
                                src={successbg}
                                alt=""
                                className="img-fluid px-0"
                                style={{
                                    // maxWidth: "50%",
                                }}
                            />
                        </div>
                        <div
                            className="position-absolute d-flex justify-content-center align-items-center"
                            style={{
                                top: "25%",
                                left: "35%",
                                width: "250px",
                                height: "290px",
                                overflow: "hidden",
                            }}
                        >
                            <ReactApexChart
                                options={state.options}
                                series={state.series}
                                type="radialBar"
                                height={200}
                                width={200}
                            />
                        </div>
                    </div>


                    {/* <div className="text-center">
                        {(score > 0 || (rewards !== null && rewards > 0)) ? (
                            <>
                                <h1 className="text-red-500 text-4xl font-bold">
                                    <span style={{ color: "#4f46e5" }}> {score}</span>
                                    <span className="text-black">/{totalScore}</span>
                                </h1>
                                <p className="font-semibold mt-2">Total Questions: {total_questions}</p>
                                <p className="font-semibold mt-2">Attend Questions: {total_attended_questions}</p>
                                {rewards > 0 ? (
                                    <p className="font-semibold mt-2">Rewards: {rewards}</p>
                                ) : (
                                    <p className="font-semibold mt-2">Rewards: Not get reward</p>
                                )}
                                <p className="font-semibold mt-2">Well done!! You’re doing great.</p>
                                <p className="text-gray-600 text-sm mt-3">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Eum ex soluta molestias optio nam quam quae repellendus ut in! Fuga.
                                </p>
                                <div className="mt-4 flex justify-center gap-4">
                                    <button className="border border-red-500 text-red-500 px-4 py-2 rounded-lg me-3">
                                        <IoMdShare /> Share your score
                                    </button>
                                    <button
                                        className="text-white px-4 py-2 rounded-lg"
                                        onClick={() => navigate(`/doassessment?assignedId=${id}`)}
                                        style={{ background: "#4f46e5" }}
                                    >
                                        Take the quiz again
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center mb-3">
                                    <div>
                                        <img src={success} className="w-16 h-16 img-fluid" />
                                    </div>
                                </div>
                                < h2 className="text-lg font-bold my-3">Success</h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Thank you for completing the assessment!
                                </p>
                                <p className='text-gray-600 text-sm mt-1'>Your performance is now being evaluated.</p>
                                <button
                                    className="text-white px-6 py-2 rounded-lg mt-4 w-100"
                                    style={{ background: "#11b823", borderRadius: "10px" }}
                                    onClick={() => navigate(`/worksheet/view/${id}`)}
                                >
                                    OK
                                </button>
                            </>
                        )}
                    </div> */}
                </div>
            </div>
        </section >
    )
}

export default Successfull;
