import { useState, useEffect } from 'react'

const App = () => {

  // Variables to hold address and network information
  const [current, setcurrent] = useState({
    address: "",
    network: ""
  })

  // True if metamask is installed
  const [hasMetaMask, setHasMetaMask] = useState(true)

  // Check if there is connected account to skip pressing the button
  const checkIfWalletIsConnected = async () => {
    try {
      const account = await window.ethereum.request({ method: "eth_accounts" })
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      if (account.length) {
        setcurrent({ address: account, network: chainId })
      }
      else {
        setcurrent({ address: "", network: "" })
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Connect to wallet by pressing the button if there is no connected wallet
  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      if (accounts.length) {
        setcurrent({ address: accounts[0], network: chainId })
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Handle chain change
  const handleChainChanged = () => {
    window.location.reload()
  }

  // check for connected wallet, set listener to account and chain change
  useEffect(() => {
    if (!window.ethereum) {
      setHasMetaMask(false)
      return
    }
    checkIfWalletIsConnected()
    window.ethereum.on('accountsChanged', checkIfWalletIsConnected)
    window.ethereum.on('chainChanged', handleChainChanged)


    return () => {
      window.ethereum.removeListener('chainChanged', handleChainChanged)
      window.ethereum.removeListener('accountsChanged', checkIfWalletIsConnected)
    }
  }, [])

  return (
    <div className="bg-[#1F2933] min-h-screen p-6">
      {current.address && <div className='text-slate-200'><p>Address: {current.address}</p><p>Network: {current.network}</p></div>}
      {!current.address && <button onClick={connectWallet} disabled={!hasMetaMask} className="px-4 py-2 rounded-lg bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50">Authenticate with Metamask</button>}
      {!hasMetaMask && <p className='text-red-600 text-sm'>* Please install Metamask</p>}
    </div>
  )
}

export default App
