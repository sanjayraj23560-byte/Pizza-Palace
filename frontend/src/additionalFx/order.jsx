useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user?._id

  if (!userId) return

  axios.get(`http://localhost:5000/api/order/${userId}`)
    .then((res) => {
      setOrders(res.data)
      setLoading(false)
    })
    .catch((err) => {
      console.error("Failed to fetch orders:", err.message)
      setLoading(false)
    })
}, [])