declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: true
      request: (args: {
        method: string
        params?: any[]
      }) => Promise<any>
    } & any
  }
}

export {}