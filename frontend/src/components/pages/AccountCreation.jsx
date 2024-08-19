import React, { useState } from 'react';
import backend from "../../backend.js";
import currentUser from "../../currentUser.js";
import { useNavigate } from 'react-router-dom';
import AccountTextField from "../ui-components/AccountTextField.jsx";
import {DateTime} from "luxon";

export default function AccountCreation() {

    const [pageNum, setPageNumber] = useState(1);

    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')

    const [dob, setDOB] = React.useState('')
    const [gender, setGender] = React.useState('')

    const [college, setCollege] = React.useState('')
    const [major, setMajor] = React.useState('')
    const [graduatingYear, setGraduatingYear] = React.useState('')

    const [hometown, setHometown] = React.useState('')
    const [internationalStudent, setInternationalStudent] = React.useState('')

    const [referral, setReferral] = React.useState('')
    const [housingPreference, setHousingPreference] = React.useState('')

    let [contactEmail, setContactEmail] = React.useState('')
    const [contactPhone, setContactPhone] = React.useState('')
    const [contactSnapchat, setContactSnapchat] = React.useState('')
    const [contactInstagram, setContactInstagram] = React.useState('')

    const navigate = useNavigate();

    const handleCollegeChange = (event) => {
        setCollege(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleInternationalChange = (event) => {
        setInternationalStudent(event.target.value);
    }

    const handleReferralChange = (event) => {
        setReferral(event.target.value);
    };

    const handleHousingChange = (event) => {
        setHousingPreference(event.target.value);
    };

    const goToNextPage = () => {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
    };

    const goToPreviousPage = () => {
        setPageNumber(prevPageNumber => prevPageNumber - 1);
    };

    async function enterKeyPress(event) {
        if (event.key !== `Enter` && event.keyCode  !== 13) return
        if(pageNum === 6 && validateFields()){
            await submit()
            return;
        }

        setPageNumber(pageNum + 1);
    }

    async function submit(){
        if(internationalStudent === "yes"){
            setInternationalStudent(true);
        } else {
            setInternationalStudent(false);
        }
        try {
            const payload = {
                user_id: currentUser.user_id,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    date_of_birth: DateTime.fromFormat(dob, "M/dd/yy").toSQLDate(),
                    gender: gender,
                    college: college,
                    major: major,
                    graduating_year: graduatingYear,
                    hometown: hometown,
                    international: internationalStudent,
                    hear_about_us: referral,
                    housing_preference: housingPreference,
                    contact_email: contactEmail,
                    contact_phone: contactPhone,
                    contact_snapchat: contactSnapchat,
                    contact_instagram: contactInstagram
                }
            };
    
            const res = await backend.post("/profile/set-gendata", payload);
    
            console.log(res.data.message);
    
            currentUser.user_data = await currentUser.getAccount();
    
            console.log("redirecting to match");
    
            navigate("/login");
    
        } catch(err) {
            console.error(err);
        }
    }    

    const notEmpty = (obj) => {
        return obj !== null && obj !== '';
    }

    const validateContacts = () => {
        return notEmpty(contactSnapchat) || notEmpty(contactEmail) || notEmpty(contactPhone) || notEmpty(contactInstagram);
    }

    const validateFields = () => {
        return validateContacts() && notEmpty(firstName) && notEmpty(lastName) && notEmpty(dob) && dob.length > 6 && notEmpty(major) && notEmpty(college) && notEmpty(referral) && notEmpty(housingPreference);
    }

    return (
      <>
          <nav className="flex flex-col bg-offwhite items-center w-full h-screen vertical-center">
              <link rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Lora:wght@500&display=swap"></link>
              <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
              <div className="w-1/2 h-1/2 text-center m-auto overflow-x-clip relative">
                  <p className={`text-maroon_new block font-lora text-5xl font-semibold text-center`}>
                      Welcome to Gophermatch!</p>
                  <div
                      className={`absolute left-0 right-0 flex flex-col w-1/2 m-auto transition duration-1000 ${pageNum === 1 ? '' : 'translate-x-[-160%] pointer-events-none'}`}>
                      <AccountTextField maxLength={255} topMargin="12" visPageNum={1} curPageNum={pageNum}
                                        enterKeyPress={enterKeyPress}
                                        fieldValue={firstName} valueSetter={setFirstName}
                                        placeholder="First Name"></AccountTextField>
                      <AccountTextField maxLength={255} topMargin="6" visPageNum={1} curPageNum={pageNum}
                                        enterKeyPress={enterKeyPress}
                                        fieldValue={lastName} valueSetter={setLastName}
                                        placeholder="Last Name"></AccountTextField>
                  </div>

                  <div
                      className={`absolute left-0 right-0 flex flex-col w-1/2 m-auto transition duration-1000 ${pageNum === 2 ? '' : (pageNum < 2 ? 'translate-x-[160%]' : 'translate-x-[-160%]')}`}>
                      <AccountTextField isDate={true} maxLength={8} topMargin="12" visPageNum={2} curPageNum={pageNum}
                                        enterKeyPress={enterKeyPress}
                                        fieldValue={dob} valueSetter={setDOB} placeholder="MM/DD/YY"></AccountTextField>
                      <select tabIndex={pageNum === 2 ? 2 : -1} onKeyUp={enterKeyPress} value={gender}
                              onChange={handleGenderChange}
                              className="text-maroon_new w-90 rounded-md mt-6 p-3 shadow-text-field border-2 border-maroon_new transition duration-100 font-inter hover:shadow-text-field-selected focus: text-black">
                          <option value="">Select your gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                      </select>
                  </div>

                  <div
                      className={`absolute left-0 right-0 mt-[3rem] flex flex-col w-1/2 m-auto transition-transform duration-1000 ${pageNum === 3 ? 'translate-x-0' : (pageNum < 3 ? 'translate-x-[160%] pointer-events-none' : '-translate-x-[160%] pointer-events-none')}`}>
                        <AccountTextField maxLength={255} visPageNum={3} curPageNum={pageNum}
                                        enterKeyPress={enterKeyPress}
                                        fieldValue={hometown} valueSetter={setHometown}
                                        placeholder="Hometown"></AccountTextField>
                        <select 
                            className="text-maroon_new w-90 rounded-md mt-6 p-3 shadow-text-field border-2 border-maroon_new transition duration-100 font-inter hover:shadow-text-field-selected focus: text-black"
                            value={internationalStudent} onKeyUp={enterKeyPress} valueSetter={setInternationalStudent}
                            onChange={handleInternationalChange}>     
                            <option value="">International Student?</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                  </div>

                  <div
                      className={`absolute left-0 right-0 flex flex-col w-1/2 m-auto transition-transform duration-1000 ${pageNum === 4 ? "translate-x-0" : (pageNum < 4 ? "translate-x-[160%] pointer-events-none" : "-translate-x-[160%] pointer-events-none")}`}>
                      <select tabIndex={pageNum === 4 ? 1 : -1} onKeyUp={enterKeyPress} value={college}
                              onChange={handleCollegeChange}
                              className="text-maroon_new w-90 rounded-md mt-12 p-3 shadow-text-field border-2 border-maroon_new transition duration-100 font-inter hover:shadow-text-field-selected focus: text-black">
                          <option value="">Select your college</option>
                          <option value="cse">CSE</option>
                          <option value="cbs">CBS</option>
                          <option value="carlson">Carlson</option>
                          <option value="design">Design</option>
                          <option value="cehd">CEHD</option>
                          <option value="cfans">CFANS</option>
                          <option value="nursing">Nursing</option>
                          <option value="other">Other</option>
                      </select>

                      <AccountTextField topMargin="6" visPageNum={4} curPageNum={pageNum} enterKeyPress={enterKeyPress}
                                        fieldValue={major} valueSetter={setMajor}
                                        placeholder="Major"></AccountTextField>

                      <AccountTextField topMargin="6" visPageNum={4} curPageNum={pageNum} enterKeyPress={enterKeyPress}
                                        fieldValue={graduatingYear} valueSetter={setGraduatingYear}
                                        placeholder="Graduating Year"></AccountTextField>
                  </div>

                  <div
                      className={`absolute left-0 right-0 flex flex-col w-1/2 m-auto transition duration-1000 ${pageNum === 5 ? '' : (pageNum < 5 ? 'translate-x-[160%]' : 'translate-x-[-160%]')}`}>
                      <select tabIndex={pageNum === 5 ? 1 : -1} onKeyUp={enterKeyPress} value={housingPreference}
                              onChange={handleHousingChange}
                              className="text-maroon_new w-90 rounded-md mt-12 p-3 shadow-text-field border-2 border-maroon_new transition duration-100 font-inter hover:shadow-text-field-selected focus: text-black">
                          <option value="">What housing are you searching for?</option>
                          <option value="apartments">Apartments</option>
                          <option value="dorms">Dorms</option>
                          <option value="both">Both</option>
                      </select>

                      <select tabIndex={pageNum === 5 ? 1 : -1} onKeyUp={enterKeyPress} value={referral}
                              onChange={handleReferralChange}
                              className="text-maroon_new w-90 rounded-md mt-6 p-3 shadow-text-field border-2 border-maroon_new transition duration-100 font-inter hover:shadow-text-field-selected focus: text-black">
                          <option value="">How did you hear about us?</option>
                          <option value="word-of-mouth">Word of mouth</option>
                          <option value="email">E-mail promotion</option>
                          <option value="social-media">Social media</option>
                          <option value="search-engine">Web search</option>
                          <option value="campus">Ads around campus</option>
                          <option value="other">Other</option>
                      </select>
                  </div>

                  <div
                      className={`absolute left-0 right-0 flex-col w-1/2 m-auto transition duration-1000 ${pageNum === 6 ? "translate-x-0" : "translate-x-[160%]"}`}>
                      <p className={'mt-12'}>
                          Please provide one or more ways for matched roommates to contact you.
                      </p>
                      <div className={'flex space-x-4'}>
                          <div className={'flex flex-col'}>
                              <AccountTextField topMargin="6" visPageNum={6} curPageNum={pageNum}
                                                enterKeyPress={enterKeyPress}
                                                fieldValue={contactEmail} valueSetter={setContactEmail}
                                                placeholder="E-mail"></AccountTextField>
                              <AccountTextField topMargin="6" visPageNum={6} curPageNum={pageNum}
                                                enterKeyPress={enterKeyPress}
                                                fieldValue={contactPhone} valueSetter={setContactPhone}
                                                placeholder="Phone Number"></AccountTextField>
                          </div>
                          <div className={'flex flex-col'}>
                              <AccountTextField topMargin="6" visPageNum={6} curPageNum={pageNum}
                                                enterKeyPress={enterKeyPress}
                                                fieldValue={contactSnapchat} valueSetter={setContactSnapchat}
                                                placeholder="Snapchat Username"></AccountTextField>
                              <AccountTextField topMargin="6" visPageNum={6} curPageNum={pageNum}
                                                enterKeyPress={enterKeyPress}
                                                fieldValue={contactInstagram} valueSetter={setContactInstagram}
                                                placeholder="Instagram Handle"></AccountTextField>
                          </div>
                      </div>
                  </div>

                  <div
                      className="absolute bottom-[5vh] left-0 right-0 m-auto w-1/3 pb-5 items-center flex flex-row justify-between">
                      <button tabIndex={pageNum === 1 ? -1 : 0} onClick={goToPreviousPage}
                              className={`transition duration-500 ${pageNum === 1 ? "opacity-0 pointer-events-none" : ""}`}>
                          <img src="../../assets/images/ArrowLeft.png" alt="Button"
                               className="w-5 h-5 hover:drop-shadow-md"/>
                      </button>
                      <div
                          className={`w-3 h-3 rounded-full transition duration-500 ${pageNum === 1 ? "bg-maroon_new scale-110" : "bg-inactive_gray"}`}></div>
                      <div
                          className={`w-3 h-3 rounded-full transition duration-500 ${pageNum === 2 ? "bg-maroon_new scale-110" : "bg-inactive_gray"}`}></div>
                      <div
                          className={`w-3 h-3 rounded-full transition duration-500 ${pageNum === 3 ? 'bg-maroon_new scale-110' : 'bg-inactive_gray'}`}></div>
                      <div
                          className={`w-3 h-3 rounded-full transition duration-500 ${pageNum === 4 ? 'bg-maroon_new scale-110' : 'bg-inactive_gray'}`}></div>
                      <div
                          className={`w-3 h-3 rounded-full transition duration-500 ${pageNum === 5 ? 'bg-maroon_new scale-110' : 'bg-inactive_gray'}`}></div>
                      <div
                          className={`w-3 h-3 rounded-full transition duration-500 ${pageNum === 6 ? 'bg-maroon_new scale-110' : 'bg-inactive_gray'}`}></div>
                      <button tabIndex={pageNum === 6 ? -1 : 0} onClick={goToNextPage}
                              className={`transition duration-500 ${pageNum === 6 ? 'opacity-0 pointer-events-none' : ''}`}>
                          <img src="../../assets/images/ArrowRight.png" alt="Button"
                               className="w-5 h-5 hover:drop-shadow-md"/>
                      </button>
                  </div>

                  <button tabIndex={pageNum === 6 ? 0 : -1} onClick={submit}
                          className={`rounded-lg p-2 text-white font-inter absolute bottom-0 left-0 right-0 m-auto w-1/5 transition duration-500 ${pageNum === 6 ? (validateFields() ? 'bg-maroon_new opacity-100' : 'bg-inactive_gray pointer-events-none opacity-80') : 'opacity-0'}`}>Submit
                  </button>
              </div>
          </nav>
      </>
    )
}