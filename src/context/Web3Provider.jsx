import { useEffect, useState, useCallback } from 'react'
import { Web3Context } from './Web3Context'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import { providers } from 'ethers'
import Web3Modal from 'web3modal'

export const Web3Provider = ({ children }) => {
  const [wallet, setWallet] = useState()
  const [address, setAddress] = useState()

  // Codes of the chain
  const chainValues = {
    int: 137,
    hex: '0x89'
  }

  useEffect(() => {
    if (!window.ethereum) {
      return
    }

    const web3 = new Web3(window.web3.currentProvider)

    const accountWasChanged = accounts => {
      setWallet(null)
      setTimeout(() => {
        if (accounts[0]) {
          setWallet(web3)
          setAddress(accounts[0])
        } else {
          setAddress('')
        }
      }, 0)
    }

    const getAndSetAccount = async () => {
      const changedAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      setWallet(null)
      setTimeout(() => {
        if (changedAccounts[0]) {
          setWallet(web3)
          setAddress(changedAccounts[0])
        } else {
          setAddress('')
        }
      }, 0)
    }

    const clearAccount = () => {
      setWallet(null)
      setAddress('')
    }

    window.ethereum.on('accountsChanged', accountWasChanged)
    window.ethereum.on('connect', getAndSetAccount)
    window.ethereum.on('disconnect', clearAccount)

    async function getAddress () {
      if (window.ethereum) {
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts[0]) {
          setAddress(accounts[0])
        }
      }
    }

    async function getAccount () {
      if (window.ethereum) {
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts[0]) {
          setWallet(web3)
        }
      }
    }

    getAddress()
    getAccount()
  }, [])

  let web3Modal

  if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,

    })
  }

  const connect = useCallback(async function () {

    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainValues.hex }] // chainId in hexadecimal
      })
    }

    let provider = await detectEthereumProvider()
    let web3Provider, signer, address, network, web3

    if (provider) {
      web3Provider = new providers.Web3Provider(provider)
    } else {
      await web3Modal.clearCachedProvider()
      provider = await web3Modal.connect()
      web3Provider = new providers.Web3Provider(provider)
    }

    try {
      signer = web3Provider.getSigner()
      address = await signer.getAddress()
      network = await web3Provider.getNetwork()
      web3 = new Web3(provider)

      if (!network || network.chainId !== chainValues.int) {
        await web3Modal.clearCachedProvider()
        dispatch({
          type: 'SET_CHAIN_ERROR',
          chainError: true
        })
      } else {
        dispatch({
          type: 'SET_WEB3_PROVIDER',
          provider,
          web3Provider,
          address,
          web3,
          chainId: network.chainId,
          chainError: false
        })
      }
    } catch (err) {
      await web3Modal.clearCachedProvider()
      provider = await web3Modal.connect()
      connect()
    }
  }, [])

  useEffect(() => {
    connect()
  }, [])

  return (
    <Web3Context.Provider value={{ wallet, connect, address, setAddress }}>
      {children}
    </Web3Context.Provider>
  )
}
