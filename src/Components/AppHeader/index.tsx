import React from "react";
import { BellFilled, MailOutlined } from "@ant-design/icons";
import { Badge, Drawer, Image, List, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { getComments, getOrders } from "../../API";

interface Comment {
  id: number;
  body: string;
  postId: number;
}

interface Order {
  id: number;
  products: { title: string; price: number; quantity: number }[];
  total: number;
}

function AppHeader() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  useEffect(() => {
    getComments()
      .then((res) => {
        setComments(res);
      })
      .catch((error) => {
        console.error("Failed to fetch comments:", error);
      });

    getOrders()
      .then((res) => {
        const formattedOrders = res.products.map(
          (product: any, index: number) => ({
            id: index,
            products: [product],
            total: product.price * product.quantity,
          })
        );
        setOrders(formattedOrders);
      })
      .catch((error) => {
        console.error("Failed to fetch orders:", error);
      });
  }, []);

  return (
    <>
      <div className="AppHeader">
        <Image
          width={40}
          src="https://yt3.ggpht.com/ytc/AMLnZu83ghQ28n1SqADR-RbI2BGYTrqqThAtJbfv9jcq=s176-c-k-c0x00ffffff-no-rj"
          alt="Logo"
        />
        <Typography.Title>Aamir's Dashboard</Typography.Title>
        <Space>
          <Badge count={comments.length} dot>
            <MailOutlined
              style={{ fontSize: 24 }}
              onClick={() => {
                setCommentsOpen(true);
              }}
            />
          </Badge>
          <Badge count={orders.length}>
            <BellFilled
              style={{ fontSize: 24 }}
              onClick={() => {
                setNotificationsOpen(true);
              }}
            />
          </Badge>
        </Space>
        <Drawer
          title="Comments"
          open={commentsOpen}
          onClose={() => {
            setCommentsOpen(false);
          }}
          maskClosable
        >
          <List
            dataSource={comments}
            renderItem={(item) => {
              return <List.Item key={item.id}>{item.body}</List.Item>;
            }}
          />
        </Drawer>
        <Drawer
          title="Notifications"
          open={notificationsOpen}
          onClose={() => {
            setNotificationsOpen(false);
          }}
          maskClosable
        >
          <List
            dataSource={orders}
            renderItem={(item) => {
              return (
                <List.Item key={item.id}>
                  <Typography.Text strong>
                    {item.products[0].title}
                  </Typography.Text>{" "}
                  has been ordered!
                </List.Item>
              );
            }}
          />
        </Drawer>
      </div>
    </>
  );
}

export default AppHeader;
