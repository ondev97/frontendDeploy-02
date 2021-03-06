import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {activeAccount} from '../actions'
import { loadStDetails } from '../actions/stDetailsAction';
import cov from '../img/cov.jpg';
import instructor from '../img/svg/instructor.svg';
import learning from '../img/svg/learning.svg';
import support from '../img/svg/support.svg';
import rjs from '../img/rjs.jpg';
import child from '../img/child.png';
import pencil from '../img/svg/pencil.svg';
import video from '../img/svg/video.svg';
import contract from '../img/svg/contract.svg';
import get from '../img/get.jpg';
import '../assets/css/home.css';
import '../assets/css/mediaFiles/homemedia.css';
import {Link} from "react-router-dom";
import AllSubCard from "../components/AllSubCard";
import Axios from "axios";

export default function Home() {
    const dispatch = useDispatch();
    const [allSubDetails, setallSubDetails] = useState([])
    const [statistics, setstatistics] = useState({'students':0, 'courses':0, 'teachers':0, 'subjects':0})

    useEffect(() => {
        dispatch(activeAccount());
        dispatch(loadStDetails());
        Axios.get(`${process.env.REACT_APP_LMS_MAIN_URL}/course-api/latestsub/`).then(res=>{
                setallSubDetails([...res.data])
            }).catch(err=>{
                console.log(err)
            });
        Axios.get(`${process.env.REACT_APP_LMS_MAIN_URL}/course-api/stat/`).then(res=>{
                setstatistics(res.data)
            }).catch(err=>{
                console.log(err)
            });
        window.scrollTo(0, 0);
      },[dispatch])

    return (
        <div className='maininde'>
            <div className="uppercover">
                <div className="cov_text">
                    <h1>OnDev<span>LMS</span> For Learning</h1>
                    <p>Education is the most powerful weapon which you can use to change the world</p>
                    <Link to={'/allteachers'}><button>Our Teachers</button></Link>
                </div>
                <div className="cov_img">
                    <img src={cov} alt="image"/>
                </div>
            </div>
            <div className="cards_section">
                <div className="cards_indi">
                    <div className="card_ic">
                        <img src={instructor} alt="instructor"/>
                    </div>
                    <h3>Expert Instructors</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus explicabo consequuntur dolore.</p>
                </div>
                <div className="cards_indi">
                    <div className="card_ic">
                        <img src={support} alt="support"/>
                    </div>
                    <h3>Customer Support</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus explicabo consequuntur dolore.</p>
                </div>
                <div className="cards_indi">
                    <div className="card_ic">
                        <img src={learning} alt="learning"/>
                    </div>
                    <h3>Remote Learning</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur possimus explicabo consequuntur dolore.</p>
                </div>
            </div>
            <div className="popular_subjects">
                <div className="main_container_co">
                    <div className="row_he">
                        <h1>Popular Subjects</h1>
                        <Link to={'/allsubjects'}><button>Browse More</button></Link>
                    </div>
                    <div className="subject_area">
                        {
                            allSubDetails.map((tdata,index)=> <AllSubCard key={index} subject={tdata}/>)
                        }
                    </div>
                </div>
            </div>
            <div className="mid_free">
                <h3>Start today for getting Improve <span>Your knowledge</span></h3>
                <h1>You can be your own guiding star with our help!</h1>
                <button>Get Started</button>
            </div>
            <div className="inde_counter">
                <div className="main_inde_counter">
                <h1>Teachers open the door, but you must enter by yourself</h1>
                    <div className="wr">
                        <div className="counter_colu">
                            <h2>Students</h2>
                            <h3>{statistics.students}+</h3>
                        </div>
                        <div className="counter_colu">
                            <h2>Subjects</h2>
                            <h3>{statistics.subjects}+</h3>
                        </div>
                        <div className="counter_colu">
                            <h2>Instructors</h2>
                            <h3>{statistics.teachers}+</h3>
                        </div>
                        <div className="counter_colu">
                            <h2>Courses</h2>
                            <h3>{statistics.courses}+</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="get_start_sec">
                <div className="main_get_start">
                    <div className="get_start_column">
                        <h1>Get Started With OnDev LMS</h1>
                        <div className="get_row">
                            <div className="row_columno">
                                <img src={pencil} alt="pencil"/>
                            </div>
                            <div className="row_columnt">
                                <h3>Sign up in Website</h3>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deleniti eveniet?</p>
                            </div>
                        </div>
                        <div className="get_row">
                            <div className="row_columno">
                                <img src={contract} alt="contract"/>
                            </div>
                            <div className="row_columnt">
                                <h3>Enroll your courses</h3>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deleniti eveniet?</p>
                            </div>
                        </div>
                        <div className="get_row">
                            <div className="row_columno">
                                <img src={video} alt="video"/>
                            </div>
                            <div className="row_columnt">
                                <h3>Start from now</h3>
                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis, deleniti eveniet?</p>
                            </div>
                        </div>
                    </div>
                    <div className="get_start_column">
                        <img src={get} alt="get"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
