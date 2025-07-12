import React, { useEffect, useState } from "react";
import { listReviews, deleteReview } from "../../service/index";
import type { ReviewInterface } from "../../interface/IReview";
import { Card, Row, Col, Avatar, Typography, Rate, message, Button, Tooltip } from "antd";
import { UserOutlined, DeleteOutlined, PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import EditReviewModal from "./update/index";
import CreateReviewModal from "./create/index";

const { Title, Text } = Typography;

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewInterface | null>(null);
  const [createOpen, setCreateOpen] = useState(false); // <-- state สำหรับ create modal

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await listReviews();
    if (res) setReviews(res);
  };

  const handleDelete = async (id: number | string) => {
    const success = await deleteReview(id);
    if (success) {
      setReviews((prev) => prev.filter((r) => r.ID !== id));
      message.success("ลบรีวิวสำเร็จ!");
    } else {
      message.error("เกิดข้อผิดพลาดในการลบรีวิว");
    }
  };

  // Edit
  const handleEdit = (review: ReviewInterface) => {
    setSelectedReview(review);
    setEditOpen(true);
  };

  const handleEditSuccess = () => {
    setEditOpen(false);
    setSelectedReview(null);
    fetchReviews();
  };

  // Create
  const handleCreateSuccess = () => {
    setCreateOpen(false);
    fetchReviews();
  };

  return (
    <div style={{ background: "#f0f4ff", minHeight: "100vh", padding: 28 }}>
      <div style={{ maxWidth: 1080, margin: "auto", background: "#fff", borderRadius: 24, padding: "28px 10px" }}>
        <Title level={2} style={{ textAlign: "center", color: "#2563eb", marginBottom: 32 }}>
          รีวิวจากผู้ใช้
        </Title>
        <div style={{ textAlign: "right", marginBottom: 24 }}>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setCreateOpen(true)}
            style={{ borderRadius: 12 }}
          >
            Create
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          {reviews.map((review) => (
            <Col xs={24} sm={12} md={8} key={review.ID}>
              <Card style={{ borderRadius: 16, position: "relative", paddingRight: 60 }}>
                <DeleteOutlined
                  onClick={() => handleDelete(review.ID!)}
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 18,
                    color: "#e11d48",
                    fontSize: 20,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  title="ลบรีวิว"
                />
                <Tooltip title="แก้ไขรีวิว">
                  <EditOutlined
                    onClick={() => handleEdit(review)}
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 46,
                      color: "#f59e42",
                      fontSize: 20,
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />
                </Tooltip>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <Avatar
                    size={44}
                    style={{ background: "#b4cafe", color: "#1956d1", fontWeight: 700, marginRight: 12 }}
                    icon={!review.User?.FirstName && <UserOutlined />}
                  >
                    {review.User?.FirstName?.[0]?.toUpperCase()}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: 16, color: "#222b4e" }}>
                      {review.User?.FirstName || "ไม่ระบุชื่อ"}
                      {review.User?.LastName && ` ${review.User.LastName}`}
                    </Text>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      {review.Date && new Date(review.Date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <Rate disabled value={review.Rating || 0} style={{ fontSize: 18, marginBottom: 6 }} />
                <div style={{ color: "#475569", fontSize: 15 }}>{review.Comment}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {/* Edit Modal */}
      <EditReviewModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        review={selectedReview}
        onSuccess={handleEditSuccess}
      />
      {/* Create Modal */}
      <CreateReviewModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default ReviewList;
