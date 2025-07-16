import { ethers } from "./ethers-6.7.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")

connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()

      // Force switch to Anvil if not on it
      if (network.chainId !== 31337n) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7A69" }], // 31337 in hex
          })
        } catch (switchError) {
          alert("Please switch MetaMask to Anvil (localhost:8545)")
          return
        }
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      connectButton.innerHTML = `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
      console.log("Connected account:", accounts[0])
    } catch (error) {
      console.error("Connection error:", error)
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      const txResponse = await contract.withdraw()
      await txResponse.wait(1)
      console.log("Withdraw complete")
    } catch (error) {
      console.error("Withdraw error:", error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      const txResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      })
      await txResponse.wait(1)
      console.log("Funding complete")
    } catch (error) {
      console.error("Funding error:", error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    try {
      const balance = await provider.getBalance(contractAddress)
      console.log(`Contract balance: ${ethers.formatEther(balance)} ETH`)
    } catch (error) {
      console.error("Get balance error:", error)
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}

// Listen to account changes
if (typeof window.ethereum !== "undefined") {
  ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      connectButton.innerHTML = `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
      console.log("Switched account:", accounts[0])
    } else {
      connectButton.innerHTML = "Connect Wallet"
    }
  })
}
