import dynamic from 'next/dynamic'
import Router from 'next/router'

const PolygonDarkblockWidget = dynamic(
  () =>
    import('@darkblock.io/matic-widget').then((mod) => {
      return mod.PolygonDarkblockWidget
    }),
  { ssr: false }
)

const PolygonUpgradeWidget = dynamic(
  () =>
    import('@darkblock.io/matic-widget').then((mod) => {
      return mod.PolygonUpgradeWidget
    }),
  { ssr: false }
)

const cb = (param1) => {
  // console.log('Polygon cb', param1)
}

const config = {
  customCssClass: '', // pass here a class name you plan to use
  debug: false, // debug flag to console.log some variables
  imgViewer: {
    // image viewer control parameters
    showRotationControl: true,
    autoHideControls: true,
    controlsFadeDelay: true,
  },
}

const cbUpgrade = (param1) => {
  if (param1 === 'upload_complete') {
    Router.reload()
  }
}

const apiKey = process.env.NEXT_PUBLIC_REACT_APP_API_KEY

export const PolygonWidget = ({ id, contract, w3, upgrade = false, network = 'mainnet' }) => {
  if(w3) {
    if (upgrade) {
      return (
        <PolygonUpgradeWidget
          apiKey={apiKey}
          contractAddress={contract}
          tokenId={id}
          w3={w3}
          cb={cbUpgrade}
          config={config}
          network={network}
        />
      )
    } else {
      return (
        <PolygonDarkblockWidget
          contractAddress={contract}
          tokenId={id}
          w3={w3}
          cb={cb}
          config={config}
          network={network}
        />
      )
    }
  } else {
    return <div></div>
  }
}
