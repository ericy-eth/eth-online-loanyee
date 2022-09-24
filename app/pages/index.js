import Link from "next/link";
import Image from "next/image";
import loanyeeLogo from '../public/image/LoanyeeLogo.svg'
import banner from "../public/image/banner.png";
import BorrowerSection from "../components/borrowerSection.js";
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { ethers } from "ethers";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/useContext";

import dataSet from "../data/borrowerList"

//API Calls
import fetchLoanHistory from "../api/fetchLoanHistory"
const axios = require("axios")



let ensName;



export default function Home() {
  const { user, setUser } = useContext(UserContext);

  const [isWalletConnected, setWalletConnected] = useState();

  const [data, setData] = useState();

  const [loanData, setLoanData] = useState([])

  useEffect(() => {
    checkIfWalletConnected();
    fetchLoans();
  }, []);

  async function fetchLoans(){

    const getLoanHistory = async()=>{
        const loanHistory = await axios.post(
            'https://api.studio.thegraph.com/query/35243/loanyee/0.2.8',
            {
                query:`
                {

                  loanHistories(first: 5, orderBy: loanId, orderDirection:desc) {

                    loanHistories(first: 20) {

                      id
                      interestRate
                      borrowAmount
                      interestRate
                      paybackMonths
                      borrower
                    }
                }
                `
            }
        )
        return loanHistory

    }

    let loanList = await fetch("https://testnet.tableland.network/query?s=SELECT%20*%20FROM%20loan_5_775")
    const data = await loanList.json()
    const loanDataTemp = await getLoanHistory()
    console.log(loanDataTemp);
    console.log("Loan data from the graph returns ", loanDataTemp.data.data.loanHistories);
    setLoanData(loanDataTemp.data.data.loanHistories)
    
    setData(data);
  }

  async function checkIfWalletConnected() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      const provider = new ethers.providers.Web3Provider(ethereum);
      ensName = await provider.resolveName("vitalik.eth");

      console.log("ENS name is " + ensName);

      if (accounts.length !== 0) {
        const account = accounts[0];

        console.log("Found an authorized account:", account);
        setWalletConnected(true);
        setUser({ account: account });
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function connectWallet() {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("No metamask detected");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    setUser({ account: account});
    setWalletConnected(true);
  }
 
  return (
    <div class="bg-white">

      {/* Banner */}
      <div class="container mt-12 mx-auto">
        <Image class="w-12" src={banner}></Image>
      </div>

      {/* Sorting */}
      {/* <div class="container mt-12 mx-auto grid grid-cols-12">
      
         <div class="bg-neutral-100 rounded-full px-5 py-1">
          <input style={{outline:"none"}} ></input>
         </div>
      </div> */}

      {/* Categories */}
      <div class="container mt-10 mx-auto py-5 grid grid-cols-9 justify-between text-xl text-stone-500 items-center">
        <div class="col-span-2">Borrower</div>
        <div class="col-span-2">Loan Value</div>
        <div class="col-span-2">Duration</div>
        {/* <div class="col-span-2">Credit Score</div> */}
        {/* <div class="col-span-2">Salary History</div> */}
        <div class="col-span-2">Interest Rate</div>
        <div class="col-span-1">Status</div>
      </div>

      {/* Borrowers List */}
      <div
        style={{ maxHeight: "67rem" }}
        class="container mx-auto"
      >
        {loanData.map((borrower, index) => {
          return <Link   href={{pathname: "/borrowerDetail", query: borrower}}>
          <a >
          <BorrowerSection index={index} data={borrower} />


          </a>
          </Link>
        })}
      </div>
    </div>
  );
}
