import React, { useEffect, useState } from "react";
import { listReviews, deleteReview } from "../../../service/index";
import type { ReviewInterface } from "../../../interface/IReview";
import {
  Table,
  Avatar,
  Typography,
  Rate,
  Button,
  Tooltip,
  message,
  Modal,
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import EditReviewModal from "./update/index";
import CreateReviewModal from "./create/index";
import "./review.css";

const { Title } = Typography;
const { confirm } = Modal;

const ReviewTable: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewInterface | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  const fetchReviews = async () => {
    const res = await listReviews();
    if (res) setReviews(res);
  };

  const handleDelete = (id: number | string) => {
    confirm({
      title: "ต้องการลบรีวิวนี้หรือไม่?",
      icon: <ExclamationCircleOutlined />,
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: async () => {
        const success = await deleteReview(id);
        if (success) {
          setReviews((prev) => prev.filter((r) => r.ID !== id));
          message.success("ลบรีวิวสำเร็จ!");
        } else {
          message.error("เกิดข้อผิดพลาดในการลบรีวิว");
        }
      },
    });
  };

  const columns = [
    {
      title: "",
      dataIndex: ["User", "FirstName"],
      key: "avatar",
      width: 60,
      align: "center" as const,
      render: (_: any, record: ReviewInterface) => (
        <Avatar
          style={{
            background: "#fff3e0",
            color: "#ff9800",
            fontWeight: 700,
            border: "2px solid #ffdfb0",
          }}
          icon={!record.User?.FirstName && <UserOutlined />}
        >
          {record.User?.FirstName?.[0]?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "ผู้ใช้",
      key: "user",
      width: 140,
      render: (_: any, record: ReviewInterface) => (
        <span className="user-col">
          {record.User?.FirstName || "ไม่ระบุชื่อ"}
          {record.User?.LastName && ` ${record.User.LastName}`}
        </span>
      ),
    },
    {
      title: "วันที่",
      dataIndex: "Date",
      key: "date",
      width: 120,
      render: (date: string) =>
        date ? (
          <span className="date-col">
            {new Date(date).toLocaleDateString("th-TH", {
              year: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: "คะแนน",
      dataIndex: "Rating",
      key: "rating",
      width: 110,
      render: (rating: number) => (
        <Rate disabled allowHalf value={rating || 0} style={{ color: "#ff9800", fontSize: 20 }} />
      ),
      sorter: (a: ReviewInterface, b: ReviewInterface) => (a.Rating ?? 0) - (b.Rating ?? 0),
    },
    {
      title: "รีวิว",
      dataIndex: "Comment",
      key: "comment",
      className: "comment-col",
      render: (comment: string) => <span>{comment}</span>,
    },
    {
      title: "",
      key: "action",
      width: 90,
      align: "center" as const,
      render: (_: any, record: ReviewInterface) => (
        <>
          <Tooltip title="แก้ไข">
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => {
                setSelectedReview(record);
                setEditOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Button
              icon={<DeleteOutlined />}
              danger
              type="text"
              onClick={() => handleDelete(record.ID!)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className="review-bg">
      <div className="review-table-glass">
        <Title level={3} className="review-title-2">
          Admin Dashboard Reviews
        </Title>
        <div style={{ textAlign: "right", marginBottom: 18 }}>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            style={{
              background: "#ff9800",
              borderColor: "#ff9800",
              borderRadius: 11,
              fontWeight: 700,
              letterSpacing: 0.2,
              fontSize: "1.04rem",
            }}
            onClick={() => setCreateOpen(true)}
          >
            สร้างรีวิว
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="ID"
          pagination={{ pageSize: 5, showSizeChanger: false }}
          bordered={false}
          size="middle"
          className="review-ant-table"
          style={{ width: "100%" }}
        />
      </div>
      {/* Edit Modal */}
      <EditReviewModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        review={selectedReview}
        onSuccess={() => {
          setEditOpen(false);
          setSelectedReview(null);
          fetchReviews();
        }}
      />
      {/* Create Modal */}
      <CreateReviewModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          fetchReviews();
        }}
      />
    </div>
  );
};

export default ReviewTable;
