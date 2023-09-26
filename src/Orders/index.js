import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Container, Table, Button, Space, Image, Select } from "@mantine/core";
import { Link } from "react-router-dom";
import Header from "../Header";
import {
  fetchOrders,
  getOrder,
  updateStatus,
  deleteOrders,
} from "../api/order";
import { notifications } from "@mantine/notifications";

export default function Orders() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  console.log(orders);

  const { isLoading } = useQuery({
    queryKey: ["orders", orders._id],
    queryFn: () => getOrder(orders._id),
    onSuccess: (data) => {
      setStatus(data.status);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Status Edited",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdateStatus = async (order, payment) => {
    updateMutation.mutate({
      id: order._id,
      data: JSON.stringify({
        status: payment,
      }),
    });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      notifications.show({
        title: "Order Deleted",
        color: "green",
      });
    },
  });
  return (
    <>
      <Container>
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        <Table>
          <thead>
            <tr>
              <th>Customers</th>
              <th>Products</th>
              <th></th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ? orders.map((o) => {
                  return (
                    <tr key={o._id}>
                      <td width={"200px"}>
                        {o.customerName}
                        <br />({o.customerEmail})
                      </td>
                      <td width={"300px"}>
                        {o.products.map((product, index) => (
                          <div key={index}>
                            {product.image && product.image !== "" ? (
                              <>
                                <Image
                                  src={"http://localhost:5000/" + product.image}
                                  width="100px"
                                />
                              </>
                            ) : (
                              <Image
                                src={
                                  "https://www.aachifoods.com/templates/default-new/images/no-prd.jpg"
                                }
                                width="100px"
                              />
                            )}
                          </div>
                        ))}
                      </td>
                      <td width={"500px"}>
                        {o.products.map((product, index) => (
                          <div key={index}>
                            <p>{product.name}</p>
                          </div>
                        ))}
                      </td>
                      <td width={"500px"}>{o.totalPrice}</td>
                      <td width={"500px"}>
                        <Select
                          value={o.status}
                          onChange={(payment) => handleUpdateStatus(o, payment)}
                          w="150px"
                          placeholder={o.status}
                          disabled={o.status == "Pending" ? true : false}
                          data={["Paid", "Failed", "Shipped", "Delivered"]}
                        />
                      </td>
                      <td width={"500px"}>{o.paid_at}</td>
                      <td width={"200px"}>
                        <Button
                          variant="outline"
                          color="red"
                          onClick={() => {
                            deleteMutation.mutate(o._id);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
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
