import { useQuery } from "@tanstack/react-query";
import { Container, Table, Button, Space } from "@mantine/core";
import { Link } from "react-router-dom";
import Header from "../Header";
import { fetchOrders } from "../api/order";

export default function Orders() {
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  console.log(orders);
  return (
    <>
      <Container>
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ? orders.map((o) => {
                  return (
                    <tr key={o._id}>
                      <td>{o._id}</td>
                      <td>
                        {o.products.map((product, index) => (
                          <div key={index}>
                            <p>{product.name}</p>
                          </div>
                        ))}
                      </td>
                      <td>{o.totalPrice}</td>
                      <td>{o.status}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
          <Button component={Link} to="/">
            Continue Shopping
          </Button>
        </Table>
      </Container>
    </>
  );
}
