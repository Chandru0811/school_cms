import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdShare } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";

function HomeSuccessfull() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const score = queryParams.get("score");
    const totalScore = queryParams.get("totalScore");
    const rewards = queryParams.get("rewards");
    const id = queryParams.get("id");

    return (
        <section>
            <div className="container-fluid">
                <div className="row" style={{ background: "white" }}>
                    <div className="col-md-2 col-12"></div>
                    <div className="col-md-8 col-12 d-flex align-items-center justify-content-center flex-column"
                        style={{ minHeight: "80vh" }}>
                        <div className="card custom-card p-3 m-5 d-flex justify-content-center align-items-center"
                            style={{ width: "100%", minHeight: "50vh", position: "relative" }}>
                            <button
                                className="position-absolute"
                                style={{ top: "10px", right: "10px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
                                onClick={() => navigate(`/homework/view/${id}`)}
                            >
                                <IoIosCloseCircleOutline />
                            </button>

                            <div className="text-center">
                                {(score > 0 || (rewards !== null && rewards > 0)) ? (
                                    <>
                                        <h1 className="text-red-500 text-4xl font-bold">
                                            <span style={{ color: "#4f46e5" }}> {score}</span>
                                            <span className="text-black">/{totalScore}</span>
                                        </h1>
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
                                        < h2 className="text-lg font-bold my-3">Success</h2>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Thank you for completing the assessment!
                                        </p>
                                        <p className='text-gray-600 text-sm mt-1'>Your performance is now being evaluated.</p>
                                        <button
                                            className="text-white px-6 py-2 rounded-lg mt-4 w-100"
                                            style={{ background: "#11b823", borderRadius: "10px" }}
                                            onClick={() => navigate(`/homework/view/${id}`)}
                                        >
                                            OK
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-12"></div>
                </div>
            </div>
        </section >
    )
}

export default HomeSuccessfull;
