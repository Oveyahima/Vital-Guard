import React, { useState } from 'react';
import './Signup.css';
import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import contract from '../contracts/contract.json';
import image from '../assets/signup_background.jpeg';

const Signup = () => {
  const [type, setType] = useState('patient');
  const [regp, setRegp] = useState({
    name: '',
    email: '',
    password: '',
    number: 1,
    contactNumber: '',
    insurance: [{}],
    allergies: [{}],
    medicalhistory: [{}],
    hospitalizationhistory: [{}],
    visit: [{}],
    selectedDoctors: [{}],
  });
  const confirmPasswordElement = document.getElementById('confirmPassword');
  const [regd, setRegd] = useState({
    name: '',
    email: '',
    password: '',
    hospital: '',
    contactNumber: '',
    license: '',
    specialization: '',
    accessRequestsSent: [],
    accessRecieved: [],
  });

  const validatePasswordConfirmation = () => regp.password === confirmPasswordElement.value;

  function handle(e) {
    const newData = type === 'doctor' ? { ...regd } : { ...regp };
    newData[e.target.name] = e.target.value;
    type === 'doctor' ? setRegd(newData) : setRegp(newData);
  }

  const register = async () => {
    // if (!regp.name || !regp.email || !regp.password || !confirmPasswordElement) {
    //   alert('Please fill in all required fields');
    //   return;
    // }

    // if (!validatePasswordConfirmation()) {
    //   alert('Password and Confirm Password do not match');
    //   return;
    // }

    try {
      // Check eemail existence
      const emailCheck = await fetch(
        `http://localhost:8050/api/doctors/check-email?email=${regp.email}&type=${type}`
      );
      const { exists } = await emailCheck.json();
      
      if (exists) {
        alert('Email address is already registered');
        return;
      }

      const response = await fetch('http://localhost:8050/api/doctors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(type === 'doctor' ? regd : regp), // Include doctor data if type is doctor, else patient data
          type,
          address: (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0],
        })
      });

      if (response.ok) {
        alert('Account created successfully!');
      } else {
        alert('Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error during registration');
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to right, #004e92,#000428)' }}>
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center bg-white/20 z-10 backdrop-filter backdrop-blur-lg shadow-lg m-10">
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-gray-200">Register</h2>
          <p className="text-xs mt-4 text-gray-300">Create a new account</p>

          <form action="" className="flex flex-col gap-4">
            <input className="p-2 mt-8 rounded-xl border" type="text" name="name" onChange={(e) => handle(e)} id="name" placeholder="Full Name" />
            <input className="p-2 rounded-xl border" type="email" name="email" id="email" placeholder="Email" onChange={(e) => handle(e)} />

            <input onChange={handle} type="text" placeholder="Contact Number" name="contactNumber" className="p-2 rounded-xl border w-full mb-5" />

            <div className="relative">
              <div className="input-heading" style={{ margin: '1rem 0' }}>
                <h5 className="text-gray-300"> Type</h5>
                <select className="p-2 rounded-xl border w-full text-gray-400" id="user-type" name="type" onChange={(e) => setType(e.target.value)} style={{ padding: '0.5rem', backgroundColor: 'white' }}>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            </div>

            {type === 'doctor' && (
              <div className="relative">
                <input onChange={handle} type="text" placeholder="Specialization" name="specialization" className="p-2 rounded-xl border w-full mb-5" />
                <input onChange={handle} type="text" placeholder="Hospital" name="hospital" className="p-2 rounded-xl border w-full mb-5" />
                <input onChange={handle} type="text" placeholder="License No." name="license" className="p-2 rounded-xl border w-full" />
              </div>
            )}

            <input className="p-2 rounded-xl border w-full" type="password" name="password" placeholder="Password" onChange={(e) => handle(e)} />
            <input className="p-2 rounded-xl border" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />

            <button type="button" className="bg-[#002D74] rounded-xl text-gray-300 py-2 hover:scale-105 duration-300" onClick={register}>Signup</button>
          </form>

          <div className="mt-3 text-xs flex justify-between items-center text-[#002D74] ">
            <p className="text-gray-300">Already have an account?</p>
            <a href="/login" className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">Login</a>
          </div>
        </div>

        <div className="md:block hidden w-1/2">
          <img className="rounded-2xl" src={image} alt="Registration" />
        </div>
      </div>
    </section>
  );
};

export default Signup;
