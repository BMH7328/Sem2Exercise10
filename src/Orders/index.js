import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
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

export default function Orders() {
  const queryClient = useQueryClient();
  const { isLoading, data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

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
      <Container size="100%">
        <Header title="My Orders" page="orders" />
        <Space h="35px" />
        <LoadingOverlay visible={isLoading} />
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
                          onChange={(payment) => handleUpdateStatus(o, payment)}
                          w="150px"
                          placeholder={o.status}
                          disabled={o.status == "Pending" ? true : false}
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
                        />
                      </td>
                      <td width={"500px"}>{o.paid_at}</td>
                      <td width={"200px"}>
                        {o.status == "Failed" && "Pending" && (
                          <Button
                            variant="outline"
                            color="red"
                            onClick={() => {
                              deleteMutation.mutate(o._id);
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
