export default function useHandleLocalToken() {
  const local_token = localStorage.getItem('token')

  return local_token
}
