import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Container,
  Table,
  Button,
  Space,
  Image,
  Select,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { Link } from "react-router-dom";
import Header from "../Header";
import { fetchOrders, updateOrders, deleteOrders } from "../api/order";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";

export default function Orders() {
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const queryClient = useQueryClient();
  const { isLoading, data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(currentUser ? currentUser.token : ""),
  });

  const isAdmin = useMemo(() => {
    return cookies &&
      cookies.currentUser &&
      cookies.currentUser.role === "admin"
      ? true
      : false;
  }, [cookies]);

  const updateMutation = useMutation({
    mutationFn: updateOrders,
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
      <Container size="100%">
        <Space h="50px" />
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        {/* <LoadingOverlay visible={isLoading} /> */}
        <Table>
          <thead>
            <tr>
              <th>Customers</th>
              <th>Products</th>
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
                      <td width={"1000px"}>
                        {o.products.map((product, index) => (
                          <div key={index}>
                            <Group>
                              {product.image && product.image !== "" ? (
                                <>
                                  <Image
                                    src={
                                      "http://localhost:5000/" + product.image
                                    }
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
                              <p>{product.name}</p>
                            </Group>
                          </div>
                        ))}
                      </td>
                      {/* <td width={"700px"}>
                        {o.products.map((product, index) => (
                          <div key={index}>
                            <p>{product.name}</p>
                          </div>
                        ))}
                      </td> */}
                      <td width={"400px"}>{o.totalPrice}</td>
                      <td width={"500px"}>
                        <Select
                          value={o.status}
                          disabled={
                            o.status === "Pending" || !isAdmin ? true : false
                          }
                          data={[
                            {
                              value: "Pending",
                              label: "Pending",
                              disabled: true,
                            },
                            { value: "Paid", label: "Paid" },
                            { value: "Failed", label: "Failed" },
                            { value: "Shipped", label: "Shipped" },
                            { value: "Delivered", label: "Delivered" },
                          ]}
                          onChange={(newValue) => {
                            updateMutation.mutate({
                              id: o._id,
                              data: JSON.stringify({
                                status: newValue,
                              }),
                              token: currentUser ? currentUser.token : "",
                            });
                          }}
                        />
                      </td>
                      <td width={"500px"}>{o.paid_at}</td>
                      <td width={"200px"}>
                        {o.status === "Pending" && isAdmin && (
                          <Button
                            variant="outline"
                            color="red"
                            onClick={() => {
                              deleteMutation.mutate({
                                id: o._id,
                                token: currentUser ? currentUser.token : "",
                              });
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </Table>
        <Group position="center">
          <Button component={Link} to="/">
            Continue Shopping
          </Button>
        </Group>
      </Container>
    </>
  );
}
