router.delete("/:orderId", (req, res) => {
  const orderId = Number(req.params.orderId);
  const db = readDB();

  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.status === "cancelled") {
    return res.status(400).json({ success: false, message: "Order already cancelled" });
  }

  const today = new Date().toISOString().split("T")[0];
  if (order.createdAt !== today) {
    return res.status(400).json({ success: false, message: "Cancellation window expired" });
  }

  const product = db.products.find(p => p.id === order.productId);
  product.stock += order.quantity;

  order.status = "cancelled";
  writeDB(db);

  res.status(200).json({ success: true, data: order });
});
