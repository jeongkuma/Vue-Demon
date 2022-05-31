/**
 * input(File) Element배열을 requestApi 에서 사용하는 형식으로 반환
 * @param {Array of Input File Element} fileArray
 */
function getRequestFileArray(fileArray) {
  if (!fileArray) {
    return []
  }
  let reqFileArray = []
  fileArray = fileArray.filter(f => !!f)
  verifyFileArray(fileArray)
    .map(fileObj => {
      return fileObj.files
    })
    .filter(fileList => {
      return fileList.length > 0
    })
    .forEach(fileList => {
      Array.from(fileList).forEach(file => {
        reqFileArray.push({
          name: file.name,
          file: file
        })
      })
    })

  return reqFileArray
}

/**
 * verify Array of Input File Element
 * @param {Array of Input File Element} fileArray
 */
function verifyFileArray(fileArray) {
  if (fileArray instanceof Array) {
    fileArray.filter(fileObj => {
      if (fileObj.files instanceof FileList === false) {
        console.error('fileObj is not FileList', fileObj)
      }
      return fileObj.files instanceof FileList
    })
    return fileArray
  } else {
    console.error('fileArray object is not Array', fileArray)
    return []
  }
}

export default getRequestFileArray
