import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Axios from 'axios';
import checkErrors from '../components/ValidateModule';
import { store } from 'react-notifications-component';

export default function UpdateModule() {

    const {cosid} = useParams();
    const [formValues, setformValues] = useState({mn:"",msg:""});
    const [formErrors, setformErrors] = useState({mn:"",msg:"",comerr:""});
    const [hide, sethide] = useState({mn:false,msg:false});
    const [mediafiles, setmediafiles] = useState([]);
    const [newmediafiles, setnewmediafiles] = useState([]);
    const [isSubmit, setisSubmit] = useState(false);
    const [uploading, setuploading] = useState(false);
    const [sucMsg, setsucMsg] = useState(false);
    const [isRedirect, setisRedirect] = useState({pr:'',ne:''});
    const [isDelete, setisDelete] = useState(false);
    //get acDetails from Redux Store
    const usDetails = useSelector(state => state.accountDetails);


    const getValues = async ()=>{
        await Axios.get(`${process.env.REACT_APP_LMS_MAIN_URL}/course-api/getsinglemodule/${cosid}/`,{
            headers:{Authorization:'Token ' + usDetails.key}
        }).then(res=>{
            console.log(res.data.module_name);
            if(res.data.module_name){
                setformValues({...formValues,mn:res.data.module_name});
                setformValues({...formValues,msg:res.data.module_content});
            }
        }).catch(err=>{
            if(err.response.data.message === "you're unauthorized"){
                setisRedirect({...isRedirect,pr:true});
            }
        })
    }

    const getModuleFiles = async () =>{
        await Axios.get(`${process.env.REACT_APP_LMS_MAIN_URL}/course-api/getmodulefiles/${cosid}/`,{
            headers:{Authorization:"Token "+usDetails.key}
        }).then(res=>{
            setmediafiles(res.data);
        }).catch(err=>{
            console.log(err);
        })
    }
    
    const deleteModuleFile = async (modid) =>{
        if(window.confirm('Are You Sure?')){
            await Axios.delete(`${process.env.REACT_APP_LMS_MAIN_URL}/course-api/deletemodulefile/${modid}/`,{
                headers:{Authorization:"Token "+usDetails.key}
            }).then(res=>{
                if(res){
                    setisDelete(!isDelete);
                }
            }).catch(err=>{
                console.log(err);
            })
        }
    }

    const hadelValues = (e)=>{
        const {name,value} = e.target
        setformValues({
            ...formValues,[name]:value
        })
    };

    useEffect(() => {
        if(usDetails.key){
            getValues();
            getModuleFiles();
        }
    }, [usDetails,isDelete]);

    const hideErrors = (e)=>{
        Object.entries(formErrors).map(([keys,val]) =>{
            if(keys === e.target.name && val !== ""){
                sethide({...hide,[e.target.name]:true});
            }
        })
    };

    const files = (e)=>{
        if(e.target.files){
            setnewmediafiles([...newmediafiles,...e.target.files]);
        }

    }

    const hadelSubmit = (e)=>{
        e.preventDefault();
        setformErrors(checkErrors(formValues,mediafiles));
        sethide({mn:false,msg:false});
        setisSubmit(true);
    }

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit){
            uploadModule();
        }
    }, [formErrors]);

    const uploadModule = async () =>{
        let formData = new FormData();
        let fileData = new FormData();

        formData.append('module_name',formValues.mn);
        formData.append('module_content',formValues.msg);

        if(newmediafiles !== null){
            for(let i=0;i<newmediafiles.length;i++){
                fileData.append(`files`,newmediafiles[i]);
            }
        }

        await Axios.post(`${process.env.REACT_APP_LMS_MAIN_URL}/course-api/updatemodule/${cosid}/`,formData,{
            headers:{Authorization:'Token '+usDetails.key}
        }).then(res=>{
            if(res.data.id && newmediafiles.length !== 0){
                Axios.post(`${process.env.REACT_APP_LMS_MAIN_URL}/course-api/createmodulefile/${res.data.id}/`,fileData,{
                    headers:{Authorization:"Token "+usDetails.key},onUploadProgress:progressEvent=>{
                        if(progressEvent.isTrusted){
                            setuploading(true);
                        }
                    }
                }).then(()=>{
                     setuploading(false);
                     setnewmediafiles(null);
                     setsucMsg(true);
                     setformValues({mn:"",msg:""});
                })
            }
            else{
                setsucMsg(true);
            }
        }).catch(err=>{
            console.log(err);
        })

    }

    const editorOnChangeHandel = (e,editor) =>{
        let data = editor.getData();
        setformValues({...formValues,['msg']:data});
    }

    if(sucMsg){
        setsucMsg(false);
        setisRedirect({ne:true});
        //showing alert
        store.addNotification({
            title: "Module Updated Successfully!",
            message: "OnDevlms",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
            duration: 3000,
            onScreen: true,
            pauseOnHover: true,
            showIcon:true
            },
            width:600
        });
    }
    
    if(isRedirect.pr){
        return <Redirect to="/teacherdashboard/managecourse/"/>
    }
    if(isRedirect.ne){
        return <Redirect to={`/teacherdashboard/models/${cosid}`}/>
    }

    return (
        <div className="subject_form">
            <div className="main_form">
                <h1>Update Module</h1>
                <form onSubmit={hadelSubmit}>
                    {
                        formErrors.comerr && <p style={{color:'red',fontSize:"13px",marginBottom:"10px"}}>{formErrors.comerr}</p>
                    }
                    <p>
                        <label htmlFor="mn">Module Name</label>
                        <input type="text" id="mn" name="mn" value={formValues.mn} onChange={hadelValues} onFocus={hideErrors}/>
                        {
                            formErrors.mn && <span className={`tip ${hide.mn ? 'hidetip' : ''}`}>{formErrors.mn}</span>
                        }
                    </p>
                    <p>
                        <label htmlFor="msg">Messages/Links</label>
                    </p>
                        <div className="editorck">
                            <CKEditor editor={ ClassicEditor } data={formValues.msg} onChange={editorOnChangeHandel} />
                        </div>
                        {
                            mediafiles !== null && newmediafiles !== null ? 
                            <div className="show_files">
                            <ul className="up_list">
                                {
                                    Object.values(mediafiles).map((value,index)=>(
                                        value.type !== 'video/mp4' && <li key={index} className="row">{value.file_name}{!uploading ? <i className="fas fa-minus-circle moddl" onClick={()=>deleteModuleFile(value.id)}></i> : ''}</li>
                                    ))
                                }
                                {
                                    Object.values(newmediafiles).map((value,index)=>(
                                        value.type !== 'video/mp4' && <li key={index} className='row'>{value.name}<i className={`fas fa-circle-notch ${uploading ? 'rot' : 'dis'} `}></i></li>
                                    ))
                                }
                            </ul>
                            </div>
                            :''
                        }
                    <div className="multi_files">
                        <p>
                            <label htmlFor="fl">Upload Module Materials</label>
                            <input type="file" name="file" className="multi" id="fl" multiple onChange={files}/>
                        </p>
                    </div>
                    <p>
                        <input type="submit" name="submit" value="Upload Module"/>
                    </p>
                </form>
            </div>
        </div>
    )
}