import React from 'react'
import success from "../../../assets/images/tick.png";
import { useLocation, useNavigate } from 'react-router-dom';

function Successfull() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const score = queryParams.get("score");
    const rewards = queryParams.get("rewards");
    const id = queryParams.get("id");
    console.log("submited data:", rewards,score);

    return (
        <section>
            <div className="container-fluid">
                <div className="row" style={{ background: "white" }}>
                    <div className="col-md-2 col-12"></div>
                    <div
                        className="col-md-8 col-12 d-flex align-items-center justify-content-center flex-column"
                        style={{ minHeight: "80vh" }}
                    >
                        <div
                            className="card custom-card p-3 m-5 d-flex justify-contnt-center align-items-center"
                            style={{ width: "100%", minHeight: "50vh" }}
                        >
                            <div className="rounded-2xl p-6 w-96 text-center">
                                <div className="flex justify-center mb-3">
                                    <div>
                                        <img src={success} className="w-16 h-16 img-fluid" />
                                    </div>
                                </div>
                                <h2 className="text-lg font-bold my-3">Success</h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Do Assessment Successfully Completed
                                </p>
                                <button
                                    className="text-white px-6 py-2 rounded-lg mt-4 w-100"
                                    style={{ background: "#11b823", borderRadius: "10px" }}
                                    onClick={() => navigate(`/worksheet/view/${id}`)}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-12"></div>
                </div>
            </div>
        </section>
    )
}

export default Successfull