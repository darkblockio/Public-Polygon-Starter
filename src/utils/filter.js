export const filter = (array, apiData) => {
  let filterData = []
  array.forEach((nft) => {
    apiData.data.filter((item) => {
      if (item.contract.toLowerCase() === nft.contract.toLowerCase() && item.token.toLowerCase() === nft.token.toLowerCase()) {
        filterData.push(item)
      }
    })
  })
  return filterData
}
