import React, { useEffect, useState } from 'react'
import './PostingJob.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
// import {useDispatch} from 'react-redux'
import axios from 'axios'
import {redirectToAuth} from 'supertokens-auth-react'
import Form from 'react-bootstrap/Form';
import Board from "../Images/NoticeBoard.png"
import { Link } from 'react-router-dom'
import { useAuth0 } from "@auth0/auth0-react";
// import jobs from '../Images/Jobs.jpg'


function PostingJob({ files, setFiles, removeFile }) {
    const {isAuthenticated } = useAuth0();
    const [ActiveVar,SetActiveVar] = useState(false)
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})
    const [image, setImage] = useState();
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [url, setUrl] = useState();

   

    
    const setField = (field, value) => {
        setForm ({
            ...form,
            [field]: value
        })

        if (!!errors[field])
        setErrors({
            ...errors,
            [field]: null,
        })
    }

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)
        console.log("preview:",selectedFile);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

  const handleChange = (e) => {
    setImage(e.target.files[0])
    if (!e.target.files || e.target.files.length === 0) {
    setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
        console.log("selected File:", e.target.files[0])
    // setImage(e.target.files[0])
    setField('file',e.target.files[0])
  }

  const postDetails = () => {
    const data = new FormData()
    data.append("file",selectedFile)
    data.append("upload_preset","JobForm_Img")
    data.append("cloud_name","dv0frgqvj")
    fetch("https://api.cloudinary.com/v1_1/dv0frgqvj/image/upload",{
        method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
        console.log("data:",data)
        console.log(data.url)
       setUrl(data.url1)
    })
    .catch(err=>{
        console.log(err)
    })
  }



  const popup = () => {
    SetActiveVar(true);
  
  }
  const popdown = () => {
    SetActiveVar(false);
  
  }

  const SignUp = async () => {
    redirectToAuth();
}

  const validateForm = () => {
    const {Name, Background,Location,IDNumber,PrefferedLocation,Companies, CandidateType, InterviewMode, JobFunction, JobMode, JobSpecialisation, JoiningTime, MonthlySalary, Number,Skill, TypeWork} = form
    const newErrors = {}
    // console.log("name", Name)

    if (!Name || Name === "") 
        newErrors.Name = "Please enter the valid Name"
    if (!Location || Location === " ") 
        newErrors.Location = "Please enter the valid Location"
    if (!Number || Number === "") 
        newErrors.Number = "Please enter the valid Mobile Number"
    if (!IDNumber || IDNumber === "") 
        newErrors.IDNumber = "Please enter the valid ID-Number"
    if (!JobSpecialisation || JobSpecialisation === "") 
        newErrors.JobSpecialisation = "Please enter the valid Job Specialisation"
    if (!Skill || Skill === "") 
        newErrors.Skill = "Please enter the valid Skill"
    if (!CandidateType || CandidateType === "") 
        newErrors.CandidateType = "Please enter the valid Candidate Type"
    if (!Background || Background === " ") 
        newErrors.Background = "Please enter the valid Background"
    if (!PrefferedLocation || PrefferedLocation === "") 
        newErrors.PrefferedLocation = "Please enter the valid Location"
    if (!Companies || Companies === "") 
        newErrors.Companies = "Please enter the valid Company"
    if (!JobFunction || JobFunction === "") 
        newErrors.JobFunction = "Please enter the valid Job Function"
    if (!TypeWork || TypeWork === "") 
        newErrors.TypeWork = "Please enter the valid Type Work"  
    if (!JobMode || JobMode === "") 
        newErrors.JobMode = "Please enter the valid Job Mode" 
    if (!MonthlySalary || MonthlySalary === "") 
        newErrors.MonthlySalary = "Please enter the valid Monthy Salary"
    if (!InterviewMode || InterviewMode === "") 
        newErrors.InterviewMode = "Please enter the valid Interview Mode"
    if (!JoiningTime || JoiningTime === "") 
        newErrors.JoiningTime = "Please enter the valid Joining Time"
    
    return newErrors
}

  async function handleSubmit (e)  {
    e.preventDefault()

     

    try {
        const formErrors = await validateForm()
        if (Object.keys(formErrors).length > 0){
            setErrors(errors =>({
                ...errors,
                ...formErrors
            }))
            console.log( errors.Name)
            console.log(validateForm())
        } else {
            // else {
            console.log('form submitted');
            console.log(form)
            // dispatch(registerUser(form))
        
            await axios.post("https://backend.am3dpjobs.com/JobUpload", {
                CandidateName: form.Name,     
                Location: form.Location,
                Number: form.Number,
                IDNumber: form.IDNumber,
                JobSpecialisation: form.JobSpecialisation,
                Skills: form.Skill,
                CandidateType: form.CandidateType,
                Background: form.Background,
                PrefferedLocation: form.PrefferedLocation,
                Companies: form.Companies,
                JobFunction: form.JobFunction,
                TypeOfWork: form.TypeWork,
                JobMode: form.JobMode,
                MonthlySalary: form.MonthlySalary,
                Interview: form.InterviewMode,
                JoiningTime: form.JoiningTime, 
                file: url,

            })
            popdown()
    } } catch (error) {
        console.error(error)
    }
    
   
    
  }



  const uploadHandler = (event) => {
    const file = event.target.files[0];
    if(!file) return;
    file.isUploading = true;
    setFiles([...files, file])

    // upload file
    const formData = new FormData();
    formData.append(
        "newFile",
        file,
        file.name
    )
    axios.post('https://backend.am3dpjobs.com/upload', formData)
        .then((res) => {
            file.isUploading = false;
            setFiles([...files, file])
            console.log("Successfully sent")
        })
        .catch((err) => {
            // inform the user
            console.error(err)
            removeFile(file.name)
          });
        }

    // console.log(form.file)
  
  return (
    <div className='bg-cover w-full h-[39rem] bg-no-repeat background overlay'>
        <div className='opacity-50 text-white absolute left-0 top-80 text-5xl z-20 cursor-pointer'>
            <Link to={'/'} class="bi bi-chevron-left"></Link>
        </div>
        {/* <img className='h-48 absolute left-64' src={Board} alt="" /> */}
        {/* <img className='absolute right-0 top-36' src="https://www.freepnglogos.com/uploads/businessman-png/business-png-businessman-png-image-private-32.png" alt="" /> */}
        {/* <div className="h-[30rem] bg-[url('https://img.freepik.com/free-vector/smooth-white-wave-background_52683-55288.jpg?w=2000')] dark:bg-[url('https://media.istockphoto.com/photos/the-black-and-silver-are-light-gray-with-white-the-gradient-is-the-picture-id1332097112?b=1&k=20&m=1332097112&s=170667a&w=0&h=D_26WN2nM805ssHpKsrqFe9mE63_j2bNefybNF0wOLw=')] bg-cover"> */}
        <div className='h-[39rem]'>
        <h1 className='absolute text-center top-[15rem] flex flex-col items-center mx-auto w-full font-bold text-white drop-shadow-lg d text-3xl leading-[40px]'>
            The Resume is Dead. 
What you did does not matter.. <br />
What you want to do, does!
            </h1>
        <h1 className='absolute opacity mx-auto w-full md:mx-auto flex flex-col  md:top-[19.5rem] sm:top-[22rem] top-[24rem] sm:font-medium lg:font-semibold text-blue-400 italic text-md leading-[50px]'><span className='mx-auto'>Create your &nbsp;CARD to apply for jobs  </span>  </h1>
        <p className='absolute opacity mx-auto w-full md:mx-auto flex flex-col items-center  md:top-[21rem] sm:top-[24rem] top-[26rem] lg:font-semibold text-slate-300 italic text-md leading-[50px]'>Takes only a few clicks!</p>
        <div className='mx-auto w-full flex flex-col items-center '>
          {/* <button className=''   >Post a Job</button> */}
          <button className='absolute mx-auto flex flex-col items-center justify-center p-2 rounded-md  text-[#fff] bg-sky-500 dark:bg-emerald-500 dark:text-black font-bold top-[28.5rem] sm:top-[27rem] md:top-[24rem]' onClick={popup}>Create a Card</button>
        </div>
        
        <div className='opacity-50 z-20 text-white absolute right-0 top-80 text-5xl cursor-pointer'>
            <Link to={'/talent'} class="bi bi-chevron-right"></Link>
        </div>
        
        <div className={`product ${isAuthenticated ? 'hiddend' : ''}`}>
        <div className={`field drop-shadow-md ${ActiveVar ? 'active' : ''}`}>
            <button className='font-bold text-xl px-3 py-2 bg-blue-500 rounded-lg text-white' onClick={SignUp}>Sign up to Create a card</button>
            <a className='absolute top-16 right-5 text-xl cursor-pointer'><i class="fas fa-times close-btn dark:text-white" onClick={popdown}></i></a>

        </div>
        </div>

        <div className={`product ${isAuthenticated ? '' : 'hiddend'}`}>
        <div className={`field drop-shadow-md ${ActiveVar ? 'active': ''}`}>
        <div className=' my-auto'>
        <div className="file-card">

        <div className="file-inputs">
            
            <input onChange={handleChange} type="file" name='file'  />
            {selectedFile &&  <img className='z-5' src={preview} alt=''/> }
            <button className={`${selectedFile ? 'hiddend' : ''}`}>
                <i className='ml-[5.4rem]'>
                    <FontAwesomeIcon icon={faPlus} />
                </i>
                <p className='mt-3 text-2xl text-orange-600 font-bold drop-shadow-lg'>UPLOAD</p>
            </button>
        </div>
        </div>
        <button onClick={postDetails} className={`flex justify-center mx-auto font-bold ${selectedFile ? '' : 'hiddend'}`}>UPLOAD IT </button>

        <p className="text-blue-900 drop-shadow-lg font-bold mt-2 text-lg">Company Logo</p>

        </div>
        {/* <div className=' absolute left-[30rem] w-[60%]'> */}
        <div class=" container bg-[#fff] dark:bg-slate-800 ">
        <div className='d-flex justify-content-between mx-3 cursor-pointer'>
        <header className='font-bold text-blue-600 text-xl drop-shadow-lg'>Post a Job</header>
        <a ><i class="fas fa-times close-btn dark:text-white" onClick={popdown}></i></a>

        </div>
        
        
        
        <Form className='overflow-hidden'>
        <form action="#" className='bg-[#fff] dark:bg-slate-800 'enctype="multipart/form-data" >
            <div class="form first dark:bg-slate-800">
                {/* <div class="details personal dark:bg-slate-800 ">
                    <span class="title text-[#333] dark:text-white">Candidate Info</span>

                    <div class="fields">
                        
                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>Candidate Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your Company name" 
                            required
                            value={form.Name}
                            onChange={e=> setField(`Name`,e.target.value)}
                            isInvalid = {!!errors.Name}
                            />
                            
                            </Form.Group>
                        </div>                        */}
                        {/* <div class="input-field">
                        <Form.Group>
                            <Form.Label>Job Title</Form.Label>
                            <Form.Select 
                            required
                            value={form.Title}
                            onChange={e=> setField(`Title`,e.target.value)}
                            isInvalid = {!!errors.Title}
                            >
                                <option disabled selected>Select Job</option>
                                <option>Mechanical Engineer</option>
                                <option>Design Engineer</option>
                                <option>Project Engineer</option>
                                <option>Male</option>
                                <option>Intern / Fresher</option>
                                <option>AM Consultant</option>
                                <option>Application Engineer</option>
                                <option>Print Manager</option>
                                <option>R&D / Research</option>
                                <option>Electronics Engineer</option>
                                <option>Center Manager</option>
                                <option>Materials Specialist</option>
                            </Form.Select>
                            
                            </Form.Group>
                        </div>
                         */}

                        
                        {/* <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <label>City</label>
                            <Form.Control type="text" placeholder="Enter your City and PinCode" 
                            required
                            value={form.Location}
                            onChange={e=> setField(`Location`,e.target.value)} />
                            
                            </Form.Group>
                        </div>
                        

                        
                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control type="number" placeholder="Enter mobile number with Country code" 
                            required
                            value={form.Number}
                            onChange={e=> setField(`Number`,e.target.value)}
                            isInvalid = {!!errors.Number} 
                            />
                            
                            </Form.Group>
                        </div>

                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>ID Number</Form.Label>
                            <Form.Control type="number" placeholder="Enter mobile number with Country code" 
                            required
                            value={form.IDNumber}
                            onChange={e=> setField(`IDNumber`,e.target.value)}
                            isInvalid = {!!errors.IDNumber} 
                            />
                            
                            </Form.Group>
                        </div>
                        
                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>Specialisation</Form.Label>
                            <Form.Select 
                            required
                            value={form.JobSpecialisation}
                            onChange={e=> setField(`JobSpecialisation`,e.target.value)}
                            isInvalid = {!!errors.JobSpecialisation}
                            >
                                <option disabled selected>Select specialisation</option>
                                <option>Design</option>
                                <option>CAD</option>
                                <option>Manufacturing</option>
                            </Form.Select>
                            
                            </Form.Group>
                        </div>

                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>Job Skills / Capabilities</Form.Label>
                            <Form.Control type="text" placeholder="Enter the Skills Required" required
                            value={form.Skill}
                            onChange={e=> setField(`Skill`,e.target.value)}
                            isInvalid = {!!errors.Skill}
                            />
                            
                            </Form.Group>
                        </div>

                        
                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>Current Status</Form.Label>
                            <Form.Select 
                            required
                            value={form.CandidateType}
                            onChange={e=> setField(`CandidateType`,e.target.value)}
                            isInvalid = {!!errors.CandidateType}
                            >
                                <option disabled selected>Select Type</option>
                                <option>In</option>
                                <option>Out</option>
                              
                            </Form.Select>
                            
                            </Form.Group>
                        </div>
                        
                        <div class="input-field">
                        <Form.Group>
                            <Form.Label>Current Level</Form.Label>
                            <Form.Select 
                            required
                            value={form.Background}
                            onChange={e=> setField(`Background`,e.target.value)}
                            isInvalid = {!!errors.Background}
                            >
                                <option disabled selected>Select Background</option>
                                <option>Fresh</option>
                                <option>Been There</option>
                                <option>Done That</option>
                            </Form.Select>
                           
                            </Form.Group>
                        </div>
                        
                        
                        
                    </div>
                </div> */}

                <div class="details ID dark:bg-slate-800">
                    <span class="title">Job Prefrences</span>

                    <div class="fields">

                    <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <label>Preffered City</label>
                            <Form.Control type="text" placeholder="Enter your City and PinCode" 
                            required
                            value={form.PrefferedLocation}
                            onChange={e=> setField(`PrefferedLocation`,e.target.value)} />
                            
                            </Form.Group>
                        </div>
                    
                        <div class="input-field">
                        <Form.Group>
                            <Form.Label>Preferred Companies</Form.Label>
                            <Form.Select 
                            required
                            value={form.Companies}
                            onChange={e=> setField(`Companies`,e.target.value)}
                            isInvalid = {!!errors.Companies}
                            >
                                <option disabled selected>Select Job</option>
                                <option>HP</option>
                                <option>IBM</option>
                                <option>Apple</option>
                                
                            </Form.Select>
                            
                            </Form.Group>
                        </div>


                    <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>Prefered Function</Form.Label>
                            <Form.Select 
                            required
                            value={form.JobFunction}
                            onChange={e=> setField(`JobFunction`,e.target.value)}
                            isInvalid = {!!errors.JobFunction}
                            >
                            <option disabled selected>Select Function</option>
                                <option>Operations</option>
                                <option>Sales</option>
                                <option>Customer Service</option>
                            </Form.Select>
                            
                            </Form.Group>
                        </div>
                    <div class="input-field text-[#333] dark:text-white">
                            <Form.Group>
                            <Form.Label>Prefered Role</Form.Label>
                            <Form.Select 
                            required
                            value={form.TypeWork}
                            onChange={e=> setField(`TypeWork`,e.target.value)}
                            isInvalid = {!!errors.TypeWork}
                            >
                                <option disabled selected>Select Role</option>
                                <option>Gig</option>
                                <option>Part-Time</option>
                                <option>Full-Time</option>
                            </Form.Select>
                           
                            </Form.Group>
                        </div>
                        
                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>Prefered Mode</Form.Label>
                            <Form.Select 
                            required
                            value={form.JobMode}
                            onChange={e=> setField(`JobMode`,e.target.value)}
                            isInvalid = {!!errors.JobMode}
                            >
                                <option disabled selected>Select Mode</option>
                                <option>On-site</option>
                                <option>Remote</option>
                            </Form.Select>
                            
                            </Form.Group>
                        </div>
                        
                    

                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                            <Form.Label>Preferred Monthly Salary(INR)</Form.Label>
                            <Form.Control type="number" placeholder="Enter Salary" 
                            required 
                            value={form.MonthlySalary}
                            onChange={e=> setField(`MonthlySalary`,e.target.value)}
                            isInvalid = {!!errors.MonthlySalary}
                            />
                            
                            </Form.Group>
                        </div>
                        

                        <div class="input-field text-[#333] dark:text-white ">
                        <Form.Group>
                            <Form.Label>Interview Mode</Form.Label>
                            <Form.Select 
                            required
                            
                            value={form.InterviewMode}
                            onChange={e=> setField(`InterviewMode`,e.target.value)}
                            isInvalid = {!!errors.InterviewMode}
                            >
                                <option disabled selected>Select Mode</option>
                                <option>Face to Face</option>
                                <option>Virtual Video</option>
                                <option >Phone</option>
                            </Form.Select>
                            
                            </Form.Group>
                        </div>

                        <div class="input-field text-[#333] dark:text-white">
                        <Form.Group>
                        <Form.Label>Interview Availability</Form.Label>
                            <Form.Select 
                            required
                            value={form.JoiningTime}
                            onChange={e=> setField(`JoiningTime`,e.target.value)}
                            isInvalid = {!!errors.JoiningTime}
                            >
                                <option disabled selected>Select Time</option>
                                <option>Immediate</option>
                                <option>One Week</option>
                                <option>One Month</option>
                            </Form.Select>
                            
                            </Form.Group>
                        </div>
                       
                    </div>

                    <button onClick={handleSubmit} class="sumbit">
                            <span class="btnText">Submit</span>
                            <i class="uil uil-navigator"></i>
                    </button>
                </div> 
            </div>

            
                        
        </form>
        </Form>
        </div>
    </div>
    
        </div>
        </div>

    </div>
  )
}

export default PostingJob;