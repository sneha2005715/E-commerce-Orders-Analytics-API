router.get("/", (req, res) => {
  const db = readDB();
  res.status(200).json({
    success: true,
    count: db.orders.length,
    data: db.orders
  });
});
