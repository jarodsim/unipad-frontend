export default function copyToClipBoard(text = '') {
  try {
    navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    return false
  }
}
