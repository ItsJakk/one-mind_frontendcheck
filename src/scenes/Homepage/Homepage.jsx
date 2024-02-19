import React, { useState, useEffect } from "react";

import homePageOneMindLogo from "../../assets/logo-blue.png";
import searchIcon from "../../assets/search-icon.png";
import ageIcon from "../../assets/filter-age-icon.png";
import dateIcon from "../../assets/calendar-icon.png";
import genderIcon from "../../assets/gender-icon.png";
import phq9Icon from "../../assets/PHQ9-icon.png";
import statusIcon from "../../assets/status-icon.png";
import notiIcon from "../../assets/notification.png";
import userIcon from "../../assets/user.png";
import inReviewIcon from "../../assets/in-review.png";
import diagnosedIcon from "../../assets/diagnosed-icon.png";
import totalIcon from "../../assets/total-icon.png";
import searchRightIcon from "../../assets/search.png";
import Datatable from "../Datatable/Datatable";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import "./HomePage.css";


const Homepage = () => {
  const navigate = useNavigate();

  //search bar
  const [search, setSearch] = useState("");
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
 
  //filter age
  const [selectedValue, setSelectedValue] = useState("");
  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };
 
  //filter date
  const [selectedDate, setSelectedDate] = useState("");
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
 
  //filter gender 
  const [selectedGenderOption, setSelectedGenderOption] = useState("");
  const handleGenderOption = (event) => {
    setSelectedGenderOption(event.target.value);
  };
 
  //filter phq9 score
  const [filterScore, setfilterScore] = useState("");
  const handleFilterScore = (event) => {
    setfilterScore(event.target.value);
  };
 
  //filter status
  const [selectedStatusOption, setSelectedStatusOption] = useState("");
  const handleStatusOption = (event) => {
    setSelectedStatusOption(event.target.value);
  };

  //the statistics
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalPerc, setforTotalPerc] = useState(null);
  const [inReviewAmount, setInReviewAmount] = useState(null);
  const [diagnosedAmount, setDiagnosedAmount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      //In Review Amount
      const reviewListQuery = query(
        collection(db, "PatientList"),
        where("Status", "==", "In Review")
      );
      const reviewListData = await getDocs(reviewListQuery);
      setInReviewAmount(reviewListData.docs.length);

      //Diagnosed Amount
      const diagnosedListQuery = query(
        collection(db, "PatientList"),
        where("Status", "==", "Diagnosed")
      );
      const diagnosedListData = await getDocs(diagnosedListQuery);
      setDiagnosedAmount(diagnosedListData.docs.length);

      //Total Amount
      const patientListQuery = query(collection(db, "PatientList"));
      const patientListData = await getDocs(patientListQuery);
      setTotalAmount(patientListData.docs.length);

      //for percentage
      const today = new Date();
      const lastWeek = new Date(new Date().setDate(today.getDate() - 7));
      const prevWeek = new Date(new Date().setDate(today.getDate() - 14));

      const lastWeekQuery = query(
        collection(db, "PatientList"),
        where("Date", "<=", today),
        where("Date", ">", lastWeek)
      );

      const prevWeekQuery = query(
        collection(db, "PatientList"),
        where("Date", "<=", lastWeek),
        where("Date", ">", prevWeek)
      );

      const lastWeekData = await getDocs(lastWeekQuery);
      const prevWeekData = await getDocs(prevWeekQuery);

      setforTotalPerc(
        ((lastWeekData.docs.length - prevWeekData.docs.length) /
          prevWeekData.docs.length) *
          100
      );
    };

    fetchData();
  }, []);

  return (
    <div className="Homepage">
      <div className="top-nav">
        <div>
          <button className="homepage-home-button">
            <img src={homePageOneMindLogo} alt="search Logo" />
            <p>OneMind</p>
          </button>
          <button className="get-started-button" onClick={() => navigate('/results')}>To results page for now</button>

        </div>
        <div className="homepage-right-side">
          <div className="user-icon">
            <img src={userIcon} alt="search Logo" />
          </div>
        </div>
      </div>

      <div className="bottom-content">
        <div className="filter-bar">
          <div className="name-block">
            <div className="name-search">
              <img src={searchIcon} alt="search Logo" />
              <p>Filter</p>
            </div>
            <input 
              type="text" 
              placeholder="ID/Name" 
              value={search} 
              onChange={handleSearch}/>
          </div>
          <div className="age-block">
            <div className="age-search">
              <img src={ageIcon} alt="search Logo" />
              <p>Age</p>
            </div>
            <select
              id="dropdown"
              value={selectedValue}
              onChange={handleDropdownChange}
            >
              <option value="">Choose an option</option>
              <option value="1-10">1-10</option>
              <option value="10-20">10-20</option>
              <option value="30-40">30-40</option>
              <option value="40-50">40-50</option>
              <option value="50-60">50-60</option>
              <option value="60-70">60-70</option>
              <option value="70-80">70-80</option>
            </select>
          </div>
          <div className="date-block">
            <div className="date-search">
              <img src={dateIcon} alt="search Logo" />
              <p>Date</p>
            </div>
            <input 
              type="date"  
              value={selectedDate} 
              onChange={handleDateChange} />
          </div>

          <div className="gender-block">
            <div className="gender-search">
              <img src={genderIcon} alt="gender Logo" />
              <p>Gender</p>
            </div>
            <label className="gender-radio">
              Male
              <input
                type="radio"
                value="Male"
                checked={selectedGenderOption === "Male"}
                onChange={handleGenderOption}
              />
              <span className="checkmark"></span>
            </label>
 
            <label className="gender-radio">
              Female
              <input
                value="Female"
                type="radio"
                checked={selectedGenderOption === "Female"}
                onChange={handleGenderOption}
              />
              <span className="checkmark"></span>
            </label>

            {/* <p>Selected option: {selectedOption}</p> */}
          </div>
          <div className="name-block">
            <div className="name-search">
              <img src={phq9Icon} alt="search Logo" />
              <p>PHQ-9 Score</p>
            </div>
            <input 
              type="number" 
              placeholder="Enter a score" 
              value={filterScore}
              onChange={handleFilterScore}/>
          </div>
          <div className="name-block">
            <div className="name-search">
              <img src={statusIcon} alt="search Logo" />
              <p>Status</p>
            </div>
            <label className="gender-radio">
            In Review
              <input
                type="radio"
                value="In Review"
                checked={selectedStatusOption === "In Review"}
                onChange={handleStatusOption}
              />
              <span className="checkmark"></span>
            </label>
 
            <label className="gender-radio">
              Diagnosed
              <input
                value="Diagnosed"
                type="radio"
                checked={selectedStatusOption === "Diagnosed"}
                onChange={handleStatusOption}
              />
              <span className="checkmark"></span>
            </label>

            {/* <p>Selected option: {selectedOption}</p> */}
          </div>
        </div>

        <div className="home-main-content">
          <div className="diagnosis-details">
            <div className="in-review">
              <div className="in-review-header">
                <img src={inReviewIcon} alt="search Logo" />
                <p>In Review</p>
              </div>
              <div className="in-review-description">
                <p> {inReviewAmount} </p>
              </div>
            </div>
            <div className="diagnosed">
              <div className="in-review-header">
                <img src={diagnosedIcon} alt="search Logo" />
                <p>Diagnosed</p>
              </div>
              <div className="in-review-description">
                <p> {diagnosedAmount} </p>
              </div>
            </div>
            <div className="total">
              <div className="in-review-header">
                <img src={totalIcon} alt="search Logo" />
                <p>Total</p>
              </div>
              <div className="in-review-description">
                <p> {totalAmount} </p>
              </div>
            </div>
          </div>
          <Datatable 
            search={search}
            handleSearch={handleSearch}
            selectedValue={selectedValue}
            handleDropdownChange={handleDropdownChange}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            selectedGenderOption={selectedGenderOption}
            handleGenderOption={handleGenderOption}
            selectedStatusOption={selectedStatusOption}
            handleStatusOption={handleStatusOption}
            filterScore={filterScore}
            handleFilterScore={handleFilterScore}
          />

          {/* <div className="home-page-navigation">
            <button>Previous</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default Homepage;
